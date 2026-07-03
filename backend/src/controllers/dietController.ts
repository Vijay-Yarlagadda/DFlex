import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import DietPlan from '../models/DietPlan';
import { generateDietFromAI } from '../services/aiService';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateWaterIntake,
  GoalType
} from '../utils/calculations';

const ProfileSchema = z.object({
  name: z.string(),
  dob: z.string().optional(),
  gender: z.string(),
  height: z.number(),
  heightUnit: z.string(),
  weight: z.number(),
  weightUnit: z.string(),
  trainingType: z.string(),
  activityLevel: z.string(),
  workoutDays: z.number(),
  mealsPerDay: z.number(),
  budget: z.string(),
  goal: z.string(),
  dietType: z.string(),
  cuisinePreference: z.string(),
  foodPreferences: z.record(z.string(), z.string()),
  supplements: z.array(z.string()),
  allergies: z.array(z.string()),
  medicalConditions: z.array(z.string()),
  waterIntakeGoal: z.string(),
  sleepDuration: z.string(),
  smoking: z.string(),
  alcohol: z.string(),
  cookingTime: z.string(),
  spicePreference: z.string()
});

export const calculatePreview = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const bmiData = calculateBMI(weightKg, heightCm);
    const bmr = calculateBMR(weightKg, heightCm, age, parsedData.gender as any);
    const tdee = calculateTDEE(bmr, parsedData.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, parsedData.goal as GoalType);
    const macros = calculateMacros(targetCalories, parsedData.goal as GoalType, weightKg);
    const water = calculateWaterIntake(weightKg, parsedData.activityLevel, parsedData.workoutDays);

    res.json({
      bmi: bmiData.value,
      bmr,
      tdee,
      dailyCalories: targetCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      waterGoal: water.ml
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.issues });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const generateDiet = async (req: Request, res: Response): Promise<void> => {
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
    const bmiData = calculateBMI(weightKg, heightCm);
    const bmr = calculateBMR(weightKg, heightCm, age, parsedData.gender as any);
    const tdee = calculateTDEE(bmr, parsedData.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, parsedData.goal as GoalType);
    const macros = calculateMacros(targetCalories, parsedData.goal as GoalType, weightKg);
    const water = calculateWaterIntake(weightKg, parsedData.activityLevel, parsedData.workoutDays);

    // 7-8. Build AI Prompt and Call Gemini
    const foodLikes = Object.entries(parsedData.foodPreferences)
      .filter(([_, v]) => v === 'Love')
      .map(([k]) => k).join(', ') || 'None';
    
    const foodAvoids = Object.entries(parsedData.foodPreferences)
      .filter(([_, v]) => v === 'Avoid')
      .map(([k]) => k).join(', ') || 'None';

    const aiDiet = await generateDietFromAI({
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
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, ...parsedData });
    } else {
      Object.assign(user, parsedData);
    }
    await user.save();

    const dietPlan = new DietPlan({
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

  } catch (error: any) {
    console.error("Error generating diet:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.issues });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getDiet = async (req: Request, res: Response): Promise<void> => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const diet = await DietPlan.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (!diet) {
      res.status(404).json({ error: "Diet plan not found" });
      return;
    }

    res.json(diet);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOneAndUpdate({ clerkId }, req.body, { new: true, upsert: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
