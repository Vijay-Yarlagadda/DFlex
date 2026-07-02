"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getDiet = exports.generateDiet = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const DietPlan_1 = __importDefault(require("../models/DietPlan"));
const aiService_1 = require("../services/aiService");
const calculations_1 = require("../utils/calculations");
const ProfileSchema = zod_1.z.object({
    name: zod_1.z.string(),
    dob: zod_1.z.string().optional(),
    gender: zod_1.z.string(),
    height: zod_1.z.number(),
    heightUnit: zod_1.z.string(),
    weight: zod_1.z.number(),
    weightUnit: zod_1.z.string(),
    trainingType: zod_1.z.string(),
    activityLevel: zod_1.z.string(),
    workoutDays: zod_1.z.number(),
    mealsPerDay: zod_1.z.number(),
    budget: zod_1.z.string(),
    goal: zod_1.z.string(),
    dietType: zod_1.z.string(),
    cuisinePreference: zod_1.z.string(),
    foodPreferences: zod_1.z.record(zod_1.z.string()),
    supplements: zod_1.z.array(zod_1.z.string()),
    allergies: zod_1.z.array(zod_1.z.string()),
    medicalConditions: zod_1.z.array(zod_1.z.string()),
    waterIntakeGoal: zod_1.z.string(),
    sleepDuration: zod_1.z.string(),
    smoking: zod_1.z.string(),
    alcohol: zod_1.z.string(),
    cookingTime: zod_1.z.string(),
    spicePreference: zod_1.z.string()
});
const generateDiet = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // 1. Validate data
        const parsedData = ProfileSchema.parse(req.body);
        const weightKg = parsedData.weightUnit === 'lbs' ? parsedData.weight * 0.453592 : parsedData.weight;
        let heightCm = parsedData.height;
        if (parsedData.heightUnit === 'ft') {
            const ft = Math.floor(parsedData.height);
            const inches = Math.round((parsedData.height - ft) * 100);
            heightCm = (ft * 30.48) + (inches * 2.54);
        }
        const diff_ms = Date.now() - new Date(parsedData.dob || '1995-01-01').getTime();
        const age = Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);
        // 2-6. Calculate all metrics
        const bmiData = (0, calculations_1.calculateBMI)(weightKg, heightCm);
        const bmr = (0, calculations_1.calculateBMR)(weightKg, heightCm, age, parsedData.gender);
        const tdee = (0, calculations_1.calculateTDEE)(bmr, parsedData.activityLevel);
        const targetCalories = (0, calculations_1.calculateTargetCalories)(tdee, parsedData.goal);
        const macros = (0, calculations_1.calculateMacros)(targetCalories, parsedData.goal, weightKg);
        const water = (0, calculations_1.calculateWaterIntake)(weightKg, parsedData.activityLevel, parsedData.workoutDays);
        // 7-8. Build AI Prompt and Call Gemini
        const foodLikes = Object.entries(parsedData.foodPreferences)
            .filter(([_, v]) => v === 'Love')
            .map(([k]) => k).join(', ') || 'None';
        const foodAvoids = Object.entries(parsedData.foodPreferences)
            .filter(([_, v]) => v === 'Avoid')
            .map(([k]) => k).join(', ') || 'None';
        const aiDiet = await (0, aiService_1.generateDietFromAI)({
            age,
            gender: parsedData.gender,
            height: heightCm,
            weight: weightKg,
            bmi: bmiData.value,
            bmr,
            tdee,
            calories: targetCalories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
            goal: parsedData.goal,
            budget: parsedData.budget,
            activityLevel: parsedData.activityLevel,
            workoutDays: parsedData.workoutDays,
            dietType: parsedData.dietType,
            cuisine: parsedData.cuisinePreference,
            foodLikes,
            foodAvoids,
            allergies: parsedData.allergies.join(', '),
            mealsPerDay: parsedData.mealsPerDay,
            cookingTime: parsedData.cookingTime,
            waterGoal: `${water.litres}L`,
            medicalConditions: parsedData.medicalConditions.join(', ')
        });
        // 9. Save in MongoDB
        let user = await User_1.default.findOne({ clerkId });
        if (!user) {
            user = new User_1.default({ clerkId, ...parsedData });
        }
        else {
            Object.assign(user, parsedData);
        }
        await user.save();
        const dietPlan = new DietPlan_1.default({
            userId: user._id,
            bmi: bmiData.value,
            bmr,
            tdee,
            targetCalories,
            targetProtein: macros.protein,
            targetCarbs: macros.carbs,
            targetFat: macros.fat,
            breakfast: aiDiet.Breakfast,
            morningSnack: aiDiet['Morning Snack']?.food ? aiDiet['Morning Snack'] : undefined,
            lunch: aiDiet.Lunch,
            eveningSnack: aiDiet['Evening Snack']?.food ? aiDiet['Evening Snack'] : undefined,
            dinner: aiDiet.Dinner,
            totalCalories: aiDiet.TotalCalories,
            totalProtein: aiDiet.TotalProtein,
            totalCarbs: aiDiet.TotalCarbs,
            totalFat: aiDiet.TotalFat,
            shoppingTips: aiDiet.ShoppingTips || [],
            mealAlternatives: aiDiet.MealAlternatives || []
        });
        await dietPlan.save();
        // 10. Return everything
        res.json({
            metrics: {
                bmi: bmiData.value,
                bmr,
                tdee,
                dailyCalories: targetCalories,
                protein: macros.protein,
                carbs: macros.carbs,
                fat: macros.fat,
                waterGoal: water.ml
            },
            diet: dietPlan
        });
    }
    catch (error) {
        console.error("Error generating diet:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: "Validation failed", details: error.errors });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};
exports.generateDiet = generateDiet;
const getDiet = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const user = await User_1.default.findOne({ clerkId });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const diet = await DietPlan_1.default.findOne({ userId: user._id }).sort({ createdAt: -1 });
        if (!diet) {
            res.status(404).json({ error: "Diet plan not found" });
            return;
        }
        res.json(diet);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getDiet = getDiet;
const updateProfile = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const user = await User_1.default.findOneAndUpdate({ clerkId }, req.body, { new: true, upsert: true });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=dietController.js.map