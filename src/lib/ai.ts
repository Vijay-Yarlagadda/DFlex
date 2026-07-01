import { GoogleGenAI } from '@google/genai';
import type { UserData, DashboardMetrics, Meal } from './store';

// We fall back to a sophisticated generator if no API key is provided
const fallbackGenerator = (userData: UserData, metrics: DashboardMetrics): Meal[] => {
  const isVeg = userData.dietType === 'Vegetarian' || userData.dietType === 'Vegan';
  const meals = [
    {
      name: 'Breakfast',
      food: isVeg ? 'Oatmeal with Plant Protein & Mixed Berries' : 'Scrambled Eggs (4) & Whole Wheat Toast',
      qty: '1 Bowl / 2 Slices',
      calories: Math.round(metrics.dailyCalories * 0.25),
      protein: Math.round(metrics.protein * 0.25),
      carbs: Math.round(metrics.carbs * 0.30),
      fat: Math.round(metrics.fat * 0.20),
    },
    {
      name: 'Morning Snack',
      food: isVeg ? 'Greek Yogurt (or Soy) & Almonds' : 'Greek Yogurt & Almonds',
      qty: '150g / 15g',
      calories: Math.round(metrics.dailyCalories * 0.10),
      protein: Math.round(metrics.protein * 0.10),
      carbs: Math.round(metrics.carbs * 0.05),
      fat: Math.round(metrics.fat * 0.15),
    },
    {
      name: 'Lunch',
      food: isVeg ? 'Lentil Curry, Quinoa & Salad' : 'Grilled Chicken Breast, Brown Rice & Broccoli',
      qty: '200g / 150g / 100g',
      calories: Math.round(metrics.dailyCalories * 0.30),
      protein: Math.round(metrics.protein * 0.35),
      carbs: Math.round(metrics.carbs * 0.35),
      fat: Math.round(metrics.fat * 0.25),
    },
    {
      name: 'Evening Snack',
      food: 'Protein Shake & Banana',
      qty: '1 Scoop / 1 Medium',
      calories: Math.round(metrics.dailyCalories * 0.10),
      protein: Math.round(metrics.protein * 0.15),
      carbs: Math.round(metrics.carbs * 0.10),
      fat: Math.round(metrics.fat * 0.05),
    },
    {
      name: 'Dinner',
      food: isVeg ? 'Paneer/Tofu Tikka & Veggies' : 'Baked Salmon & Sweet Potato',
      qty: '150g / 100g',
      calories: Math.round(metrics.dailyCalories * 0.25),
      protein: Math.round(metrics.protein * 0.15),
      carbs: Math.round(metrics.carbs * 0.20),
      fat: Math.round(metrics.fat * 0.35),
    }
  ];
  return userData.mealsPerDay === 3 ? [meals[0], meals[2], meals[4]] : meals.slice(0, userData.mealsPerDay);
};

export const generateDietWithAI = async (
  apiKey: string, 
  userData: UserData, 
  metrics: DashboardMetrics
): Promise<Meal[]> => {
  if (!apiKey || apiKey.trim() === '') {
    await new Promise(r => setTimeout(r, 2000));
    return fallbackGenerator(userData, metrics);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Parse food preferences
    const lovedFoods = Object.entries(userData.foodPreferences).filter(([_, v]) => v === 'Love').map(([k]) => k).join(', ');
    const likedFoods = Object.entries(userData.foodPreferences).filter(([_, v]) => v === 'Like').map(([k]) => k).join(', ');
    const avoidedFoods = Object.entries(userData.foodPreferences).filter(([_, v]) => v === 'Avoid').map(([k]) => k).join(', ');

    const prompt = `
      You are an elite sports nutritionist AI. Generate a strict ${userData.mealsPerDay}-meal diet plan for a ${userData.age} year old ${userData.gender}.
      
      [PHYSICAL & LIFESTYLE]
      Goal: ${userData.goal}
      Training: ${userData.trainingType} (${userData.activityLevel}, ${userData.workoutDays} days/week)
      Target Macros: ${metrics.dailyCalories} kcal, ${metrics.protein}g protein, ${metrics.carbs}g carbs, ${metrics.fat}g fat.
      Cooking Time Available: ${userData.cookingTime}
      Medical Conditions: ${userData.medicalConditions.join(', ') || 'None'}
      
      [NUTRITION PREFERENCES]
      Diet Type: ${userData.dietType}
      Cuisine Preference: ${userData.cuisinePreference}
      Spice Level: ${userData.spicePreference}
      Allergies: ${userData.allergies.join(', ') || 'None'}
      Supplements Taken: ${userData.supplements.join(', ') || 'None'}
      Budget Constraint: ${userData.budget} per day
      
      [SPECIFIC FOOD PREFERENCES]
      MUST INCLUDE / LOVED: ${lovedFoods || 'None'}
      CAN INCLUDE / LIKED: ${likedFoods || 'None'}
      STRICTLY AVOID: ${avoidedFoods || 'None'}

      IMPORTANT: You must return the output STRICTLY as a JSON array of objects. Do not include markdown formatting or backticks.
      Format:
      [
        {
          "name": "Breakfast",
          "food": "Specific meal description",
          "qty": "Quantity",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number
        }
      ]
      Make sure the total calories and macros sum up closely to the daily targets. Ensure the food matches their cuisine preference, cooking time, and avoids their allergens.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result: Meal[] = JSON.parse(cleanText);
    
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Invalid AI response format");
    }
    
    return result;
  } catch (error) {
    console.error("AI Generation failed, falling back to mock:", error);
    return fallbackGenerator(userData, metrics);
  }
};
