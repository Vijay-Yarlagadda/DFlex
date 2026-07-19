export const calculateBMI = (weightKg: number, heightCm: number) => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
};

export const calculateBMR = (gender: 'male' | 'female', weightKg: number, heightCm: number, age: number) => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return Number(bmr.toFixed(2));
};

export const calculateTDEE = (bmr: number, activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active') => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    super_active: 1.9,
  };
  const multiplier = multipliers[activityLevel] || 1.2;
  return Number((bmr * multiplier).toFixed(2));
};

export const calculateCalories = (tdee: number, goal: 'lose' | 'maintain' | 'gain') => {
  if (goal === 'lose') return Number((tdee - 500).toFixed(2));
  if (goal === 'gain') return Number((tdee + 500).toFixed(2));
  return tdee;
};

export const calculateMacros = (calories: number) => {
  // Standard split: 30% Protein, 40% Carbs, 30% Fat
  const proteinCals = calories * 0.3;
  const carbCals = calories * 0.4;
  const fatCals = calories * 0.3;

  return {
    protein: Math.round(proteinCals / 4), // 4 calories per gram of protein
    carbs: Math.round(carbCals / 4), // 4 calories per gram of carbs
    fat: Math.round(fatCals / 9), // 9 calories per gram of fat
  };
};

export const calculateWater = (weightKg: number, activityLevel: string) => {
  // Baseline: 35ml per kg of body weight
  let waterMl = weightKg * 35;
  
  // Add more based on activity
  if (activityLevel === 'very_active' || activityLevel === 'super_active') {
    waterMl += 1000;
  } else if (activityLevel === 'moderately_active') {
    waterMl += 500;
  }
  
  return Number((waterMl / 1000).toFixed(2)); // Return in Liters
};
