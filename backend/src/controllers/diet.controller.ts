import { Request, Response } from 'express';
import * as dietService from '../services/diet.service';
import { sendResponse } from '../utils/response';
import { DietPlan } from '../models/DietPlan';
import { User } from '../models/User';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  calculateMacros,
  calculateWater
} from '../utils/calculations';

export const calculatePreview = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const weightKg = data.weightUnit === 'lbs' ? data.weight * 0.453592 : data.weight;
    
    let heightCm = data.height;
    if (data.heightUnit === 'ft') {
      const ft = Math.floor(data.height);
      const inches = Math.round((data.height - ft) * 100);
      heightCm = (ft * 30.48) + (inches * 2.54);
    }

    const diff_ms = Date.now() - new Date(data.dob || '1995-01-01').getTime();
    const age = Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);

    const bmi = calculateBMI(weightKg, heightCm);
    const bmr = calculateBMR(data.gender as any, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const dailyCalories = calculateCalories(tdee, data.goal);
    const macros = calculateMacros(dailyCalories);
    const waterRecommendation = calculateWater(weightKg, data.activityLevel);

    res.json({
      bmi,
      bmr,
      tdee,
      dailyCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      waterGoal: waterRecommendation * 1000 // Convert back to ml for frontend if needed
    });
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Failed to calculate metrics', error.message);
  }
};

export const generateDiet = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const dietPlan = await dietService.generateAndSaveDiet(userId, req.body);
    
    // Return format expected by frontend
    res.json({
      metrics: {
        bmi: dietPlan.BMI,
        bmr: dietPlan.BMR,
        tdee: dietPlan.TDEE,
        dailyCalories: dietPlan.Calories,
        protein: dietPlan.Protein,
        carbs: dietPlan.Carbs,
        fat: dietPlan.Fat,
        waterGoal: dietPlan.WaterRecommendation * 1000
      },
      diet: dietPlan.GeneratedDiet
    });
  } catch (error: any) {
    console.error("Error generating diet:", error);
    return sendResponse(res, 500, false, 'Failed to generate diet', error.message);
  }
};

export const getDiet = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const diet = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!diet) {
      return sendResponse(res, 404, false, 'Diet plan not found');
    }
    
    res.json(diet.GeneratedDiet);
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Server error', error.message);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const diet = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });
    
    let metrics = null;
    if (diet) {
      metrics = {
        bmi: diet.BMI,
        bmr: diet.BMR,
        tdee: diet.TDEE,
        dailyCalories: diet.Calories,
        protein: diet.Protein,
        carbs: diet.Carbs,
        fat: diet.Fat,
        waterGoal: diet.WaterRecommendation * 1000
      };
    }

    res.json({ user, diet: diet?.GeneratedDiet, metrics });
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Server error', error.message);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error: any) {
    return sendResponse(res, 500, false, 'Server error', error.message);
  }
};
