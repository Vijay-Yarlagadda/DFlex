const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAXXXXXXX'); // wait, the user hasn't set GEMINI_API_KEY locally.

async function run() {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      console.log(`Model ${m} worked!`);
    } catch (e) {
      console.error(`Model ${m} failed:`, e.message);
    }
  }
}
run();
