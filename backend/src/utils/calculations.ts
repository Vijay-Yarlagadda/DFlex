export type GoalType = 'Lean Bulk' | 'Dirty Bulk' | 'Lean Cut' | 'Fat Loss' | 'Maintenance' | 'Body Recomposition';

export const calculateBMI = (weightKg: number, heightCm: number) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';

  return {
    value: Math.round(bmi * 10) / 10,
    category
  };
};

export const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: 'Male' | 'Female' | 'Other') => {
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  bmr += (gender === 'Female' ? -161 : 5);
  return Math.round(bmr);
};

export const calculateTDEE = (bmr: number, activityLevel: string) => {
  const multipliers: Record<string, number> = {
    'Sedentary': 1.2, 
    'Lightly Active': 1.375, 
    'Moderately Active': 1.55, 
    'Very Active': 1.725, 
    'Athlete': 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const calculateTargetCalories = (tdee: number, goal: GoalType) => {
  let calories = tdee;
  switch(goal) {
    case 'Lean Bulk': calories += 250; break;
    case 'Dirty Bulk': calories += 500; break;
    case 'Lean Cut': calories -= 300; break;
    case 'Fat Loss': calories -= 500; break;
    case 'Maintenance': 
    case 'Body Recomposition':
      break;
  }
  return Math.round(calories);
};

export const calculateMacros = (calories: number, goal: GoalType, weightKg: number) => {
  let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
  
  if (goal.includes('Bulk')) { pRatio = 0.25; cRatio = 0.5; fRatio = 0.25; }
  else if (goal.includes('Loss') || goal.includes('Cut') || goal === 'Body Recomposition') { 
    pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; 
  }

  return {
    protein: Math.round((calories * pRatio) / 4),
    carbs: Math.round((calories * cRatio) / 4),
    fat: Math.round((calories * fRatio) / 9)
  };
};

export const calculateWaterIntake = (weightKg: number, activityLevel: string, workoutDays: number) => {
  // Base water: 35ml per kg of body weight
  let waterMl = weightKg * 35;
  // Add 500ml for training days
  if (workoutDays > 0) waterMl += 500;
  
  return {
    ml: Math.round(waterMl),
    litres: Math.round((waterMl / 1000) * 10) / 10
  };
};
