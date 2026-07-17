import mongoose, { Schema, Document } from 'mongoose';

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
  shoppingSuggestions: string[];
  healthyAlternatives: string[];
  nutritionTips: string[];
  createdAt: Date;
}

const MealSchema = new Schema<IMeal>({
  food: { type: String, required: true },
  qty: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true }
}, { _id: false });

const DietPlanSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Stored metrics at time of generation
  bmi: { type: Number },
  bmr: { type: Number },
  tdee: { type: Number },
  targetCalories: { type: Number },
  targetProtein: { type: Number },
  targetCarbs: { type: Number },
  targetFat: { type: Number },
  
  // AI Generated Content
  breakfast: { type: MealSchema, required: true },
  morningSnack: { type: MealSchema },
  lunch: { type: MealSchema, required: true },
  eveningSnack: { type: MealSchema },
  dinner: { type: MealSchema, required: true },
  
  totalCalories: { type: Number },
  totalProtein: { type: Number },
  totalCarbs: { type: Number },
  totalFat: { type: Number },
  
  shoppingSuggestions: [{ type: String }],
  healthyAlternatives: [{ type: String }],
  nutritionTips: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);
