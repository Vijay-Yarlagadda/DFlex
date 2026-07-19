import { DietPlan } from '../models/DietPlan';
import { User } from '../models/User';
import { generateDietFromAI } from './aiService';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  calculateMacros,
  calculateWater
} from '../utils/calculations';

export const generateAndSaveDiet = async (userId: string, data: any) => {
  // Convert metrics to metric system
  const weightKg = data.weightUnit === 'lbs' ? data.weight * 0.453592 : data.weight;
  
  let heightCm = data.height;
  if (data.heightUnit === 'ft') {
    const ft = Math.floor(data.height);
    const inches = Math.round((data.height - ft) * 100);
    heightCm = (ft * 30.48) + (inches * 2.54);
  }

  const diff_ms = Date.now() - new Date(data.dob || '1995-01-01').getTime();
  const age = Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);

  // 1-9: Calculations
  const bmi = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(data.gender as any, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const targetCalories = calculateCalories(tdee, data.goal);
  const macros = calculateMacros(targetCalories);
  const waterRecommendation = calculateWater(weightKg, data.activityLevel); // returns liters

  // 10: Build Prompt Strings
  const foodLikes = data.foodPreferences 
    ? Object.entries(data.foodPreferences).filter(([_, v]) => v === 'Love').map(([k]) => k).join(', ') 
    : 'None';
  const foodAvoids = data.foodPreferences 
    ? Object.entries(data.foodPreferences).filter(([_, v]) => v === 'Avoid').map(([k]) => k).join(', ') 
    : 'None';

  // 11: Call Gemini
  const aiDiet = await generateDietFromAI({
    age,
    gender: data.gender,
    height: heightCm,
    weight: weightKg,
    bmi,
    bmr,
    tdee,
    calories: targetCalories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    goal: data.goal,
    budget: data.budget || "Medium",
    activityLevel: data.activityLevel,
    workoutDays: data.workoutDays || 3,
    dietType: data.dietType || "Balanced",
    cuisine: data.cuisinePreference || "Any",
    foodLikes: foodLikes || "None",
    foodAvoids: foodAvoids || "None",
    allergies: (data.allergies || []).join(', ') || "None",
    mealsPerDay: data.mealsPerDay || 3,
    cookingTime: data.cookingTime || "30 mins",
    waterGoal: waterRecommendation + "L",
    medicalConditions: (data.medicalConditions || []).join(', ') || "None",
    averageDailySteps: data.averageDailySteps || "0-3000",
    stressLevel: data.stressLevel || "Medium"
  });

  // 13: Save Diet
  const dietPlan = new DietPlan({
    userId,
    BMI: bmi,
    BMR: bmr,
    TDEE: tdee,
    Calories: targetCalories,
    Protein: macros.protein,
    Carbs: macros.carbs,
    Fat: macros.fat,
    WaterRecommendation: waterRecommendation,
    GeneratedDiet: aiDiet
  });

  await dietPlan.save();

  // Also update user profile with latest data (optional but helpful)
  await User.findByIdAndUpdate(userId, { name: data.name || undefined });

  // Return the newly created diet plan document
  return dietPlan;
};
