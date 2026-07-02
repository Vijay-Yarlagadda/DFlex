import mongoose, { Document } from 'mongoose';
export interface IMeal {
    food: string;
    qty: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}
export interface IDietPlan extends Document {
    userId: mongoose.Types.ObjectId;
    bmi: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    breakfast: IMeal;
    morningSnack?: IMeal;
    lunch: IMeal;
    eveningSnack?: IMeal;
    dinner: IMeal;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    shoppingTips: string[];
    mealAlternatives: string[];
    createdAt: Date;
}
declare const _default: mongoose.Model<IDietPlan, {}, {}, {}, mongoose.Document<unknown, {}, IDietPlan, {}, mongoose.DefaultSchemaOptions> & IDietPlan & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDietPlan>;
export default _default;
//# sourceMappingURL=DietPlan.d.ts.map