import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  dob: string;
  gender: string;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  trainingType: string;
  activityLevel: string;
  workoutDays: number;
  mealsPerDay: number;
  budget: string;
  goal: string;
  dietType: string;
  cuisinePreference: string;
  foodPreferences: Map<string, string>;
  supplements: string[];
  allergies: string[];
  medicalConditions: string[];
  waterIntakeGoal: string;
  sleepDuration: string;
  smoking: string;
  alcohol: string;
  cookingTime: string;
  spicePreference: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String },
  gender: { type: String },
  height: { type: Number },
  heightUnit: { type: String, default: 'cm' },
  weight: { type: Number },
  weightUnit: { type: String, default: 'kg' },
  trainingType: { type: String },
  activityLevel: { type: String },
  workoutDays: { type: Number },
  mealsPerDay: { type: Number },
  budget: { type: String },
  goal: { type: String },
  dietType: { type: String },
  cuisinePreference: { type: String },
  foodPreferences: { type: Map, of: String },
  supplements: [{ type: String }],
  allergies: [{ type: String }],
  medicalConditions: [{ type: String }],
  waterIntakeGoal: { type: String },
  sleepDuration: { type: String },
  smoking: { type: String },
  alcohol: { type: String },
  cookingTime: { type: String },
  spicePreference: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
