interface DietPromptData {
    age: number;
    gender: string;
    height: number;
    weight: number;
    bmi: number;
    bmr: number;
    tdee: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal: string;
    budget: string;
    activityLevel: string;
    workoutDays: number;
    dietType: string;
    cuisine: string;
    foodLikes: string;
    foodAvoids: string;
    allergies: string;
    mealsPerDay: number;
    cookingTime: string;
    waterGoal: string;
    medicalConditions: string;
}
export declare const buildPrompt: (data: DietPromptData) => string;
export declare const generateDietFromAI: (promptData: DietPromptData) => Promise<any>;
export {};
//# sourceMappingURL=aiService.d.ts.map