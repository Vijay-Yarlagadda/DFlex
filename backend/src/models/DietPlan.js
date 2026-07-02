"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MealSchema = new mongoose_1.Schema({
    food: { type: String, required: true },
    qty: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
}, { _id: false });
const DietPlanSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
    shoppingTips: [{ type: String }],
    mealAlternatives: [{ type: String }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('DietPlan', DietPlanSchema);
//# sourceMappingURL=DietPlan.js.map