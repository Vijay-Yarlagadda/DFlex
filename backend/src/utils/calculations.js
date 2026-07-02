"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWaterIntake = exports.calculateMacros = exports.calculateTargetCalories = exports.calculateTDEE = exports.calculateBMR = exports.calculateBMI = void 0;
const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = 'Normal';
    if (bmi < 18.5)
        category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9)
        category = 'Overweight';
    else if (bmi >= 30)
        category = 'Obese';
    return {
        value: Math.round(bmi * 10) / 10,
        category
    };
};
exports.calculateBMI = calculateBMI;
const calculateBMR = (weightKg, heightCm, age, gender) => {
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr += (gender === 'Female' ? -161 : 5);
    return Math.round(bmr);
};
exports.calculateBMR = calculateBMR;
const calculateTDEE = (bmr, activityLevel) => {
    const multipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Athlete': 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};
exports.calculateTDEE = calculateTDEE;
const calculateTargetCalories = (tdee, goal) => {
    let calories = tdee;
    switch (goal) {
        case 'Lean Bulk':
            calories += 250;
            break;
        case 'Dirty Bulk':
            calories += 500;
            break;
        case 'Lean Cut':
            calories -= 300;
            break;
        case 'Fat Loss':
            calories -= 500;
            break;
        case 'Maintenance':
        case 'Body Recomposition':
            break;
    }
    return Math.round(calories);
};
exports.calculateTargetCalories = calculateTargetCalories;
const calculateMacros = (calories, goal, weightKg) => {
    let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
    if (goal.includes('Bulk')) {
        pRatio = 0.25;
        cRatio = 0.5;
        fRatio = 0.25;
    }
    else if (goal.includes('Loss') || goal.includes('Cut') || goal === 'Body Recomposition') {
        pRatio = 0.4;
        cRatio = 0.3;
        fRatio = 0.3;
    }
    return {
        protein: Math.round((calories * pRatio) / 4),
        carbs: Math.round((calories * cRatio) / 4),
        fat: Math.round((calories * fRatio) / 9)
    };
};
exports.calculateMacros = calculateMacros;
const calculateWaterIntake = (weightKg, activityLevel, workoutDays) => {
    // Base water: 35ml per kg of body weight
    let waterMl = weightKg * 35;
    // Add 500ml for training days
    if (workoutDays > 0)
        waterMl += 500;
    return {
        ml: Math.round(waterMl),
        litres: Math.round((waterMl / 1000) * 10) / 10
    };
};
exports.calculateWaterIntake = calculateWaterIntake;
//# sourceMappingURL=calculations.js.map