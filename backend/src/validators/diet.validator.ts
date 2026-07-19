import { z } from 'zod';

export const ProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string(),
    height: z.number(),
    heightUnit: z.string(),
    weight: z.number(),
    weightUnit: z.string(),
    trainingType: z.string().optional(),
    activityLevel: z.string(),
    workoutDays: z.number().optional(),
    mealsPerDay: z.number().optional(),
    budget: z.string().optional(),
    goal: z.string(),
    dietType: z.string().optional(),
    cuisinePreference: z.string().optional(),
    foodPreferences: z.record(z.string(), z.string()).optional(),
    supplements: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medicalConditions: z.array(z.string()).optional(),
    waterIntakeGoal: z.string().optional(),
    sleepDuration: z.string().optional(),
    smoking: z.string().optional(),
    alcohol: z.string().optional(),
    cookingTime: z.string().optional(),
    spicePreference: z.string().optional(),
    averageDailySteps: z.string().optional().default("0-3000"),
    stressLevel: z.string().optional().default("Medium")
  })
});
