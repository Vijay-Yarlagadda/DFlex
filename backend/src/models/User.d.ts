import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map