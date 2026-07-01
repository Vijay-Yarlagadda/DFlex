import { GoogleGenAI } from '@google/genai';
import type { UserData, DashboardMetrics, Meal } from './store';

// We fall back to a sophisticated generator if no API key is provided
const fallbackGenerator = (userData: UserData, metrics: DashboardMetrics): Meal[] => {
  const isVeg = userData.foodPreference === 'Veg' || userData.foodPreference === 'Vegan';
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
    // Simulate network delay for the fallback
    await new Promise(r => setTimeout(r, 2000));
    return fallbackGenerator(userData, metrics);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an elite sports nutritionist AI. Generate a strict ${userData.mealsPerDay}-meal diet plan for a ${userData.age} year old ${userData.gender}.
      Goal: ${userData.goal}.
      Target Macros per day: ${metrics.dailyCalories} kcal, ${metrics.protein}g protein, ${metrics.carbs}g carbs, ${metrics.fat}g fat.
      Food Preference: ${userData.foodPreference}.
      Allergies: ${userData.allergies.join(', ')}.
      Foods to avoid: ${userData.foodsToAvoid || 'None'}.
      Favorite foods: ${userData.favoriteFoods || 'None'}.

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
      Make sure the total calories and macros sum up closely to the daily targets.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
    // Clean up potential markdown formatting if the model still includes it
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result: Meal[] = JSON.parse(cleanText);
    
    // Safety check
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Invalid AI response format");
    }
    
    return result;
  } catch (error) {
    console.error("AI Generation failed, falling back to mock:", error);
    return fallbackGenerator(userData, metrics);
  }
};
