"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDietFromAI = exports.buildPrompt = void 0;
const generative_ai_1 = require("@google/generative-ai");
// Initialize Gemini outside to be reused
let genAI;
const getAIModel = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey)
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};
const buildPrompt = (data) => {
    return `
You are an expert sports nutritionist and AI diet planner.
Create a hyper-personalized, realistic daily diet plan based on the following user profile and scientific metrics.

## USER PROFILE & METRICS
- Age: ${data.age}
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- BMI: ${data.bmi}
- BMR: ${data.bmr} kcal
- TDEE: ${data.tdee} kcal
- Activity Level: ${data.activityLevel}
- Workout Days: ${data.workoutDays}/week
- Medical Conditions: ${data.medicalConditions}

## TARGET GOALS
- Primary Goal: ${data.goal}
- Target Calories: ${data.calories} kcal
- Target Macros: ${data.protein}g Protein, ${data.carbs}g Carbs, ${data.fat}g Fat
- Target Water: ${data.waterGoal}
- Budget: ${data.budget}/day
- Cooking Time: ${data.cookingTime}

## PREFERENCES
- Diet Type: ${data.dietType}
- Cuisine Preference: ${data.cuisine}
- Loved Foods: ${data.foodLikes}
- Foods to Avoid: ${data.foodAvoids}
- Allergies: ${data.allergies}
- Meals Per Day: ${data.mealsPerDay}

## OUTPUT REQUIREMENT (STRICT JSON ONLY)
Return the diet plan as a VALID JSON object matching exactly this schema, without any markdown formatting or \`\`\`json wrappers. Do not include plain text.
{
  "Breakfast": { "food": "string", "qty": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
  "Morning Snack": { "food": "string", "qty": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
  "Lunch": { "food": "string", "qty": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
  "Evening Snack": { "food": "string", "qty": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
  "Dinner": { "food": "string", "qty": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
  "TotalCalories": number,
  "TotalProtein": number,
  "TotalCarbs": number,
  "TotalFat": number,
  "ShoppingTips": ["string"],
  "MealAlternatives": ["string"]
}

Ensure the Total macros roughly match the Target macros. If the user requested less than 5 meals, you can omit snacks or set them to empty objects.
`;
};
exports.buildPrompt = buildPrompt;
const generateDietFromAI = async (promptData) => {
    const model = getAIModel();
    const prompt = (0, exports.buildPrompt)(promptData);
    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
            }
        });
        const responseText = result.response.text();
        return JSON.parse(responseText);
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate diet plan from AI.");
    }
};
exports.generateDietFromAI = generateDietFromAI;
//# sourceMappingURL=aiService.js.map