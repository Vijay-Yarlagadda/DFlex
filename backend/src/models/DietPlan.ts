import mongoose, { Document, Schema } from 'mongoose';

export interface IDietPlan extends Document {
  userId: mongoose.Types.ObjectId;
  BMI: number;
  BMR: number;
  TDEE: number;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  WaterRecommendation: number;
  GeneratedDiet: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DietPlanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    BMI: { type: Number, required: true },
    BMR: { type: Number, required: true },
    TDEE: { type: Number, required: true },
    Calories: { type: Number, required: true },
    Protein: { type: Number, required: true },
    Carbs: { type: Number, required: true },
    Fat: { type: Number, required: true },
    WaterRecommendation: { type: Number, required: true },
    GeneratedDiet: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

export const DietPlan = mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);
