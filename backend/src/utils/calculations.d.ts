export type GoalType = 'Lean Bulk' | 'Dirty Bulk' | 'Lean Cut' | 'Fat Loss' | 'Maintenance' | 'Body Recomposition';
export declare const calculateBMI: (weightKg: number, heightCm: number) => {
    value: number;
    category: string;
};
export declare const calculateBMR: (weightKg: number, heightCm: number, age: number, gender: "Male" | "Female" | "Other") => number;
export declare const calculateTDEE: (bmr: number, activityLevel: string) => number;
export declare const calculateTargetCalories: (tdee: number, goal: GoalType) => number;
export declare const calculateMacros: (calories: number, goal: GoalType, weightKg: number) => {
    protein: number;
    carbs: number;
    fat: number;
};
export declare const calculateWaterIntake: (weightKg: number, activityLevel: string, workoutDays: number) => {
    ml: number;
    litres: number;
};
//# sourceMappingURL=calculations.d.ts.map