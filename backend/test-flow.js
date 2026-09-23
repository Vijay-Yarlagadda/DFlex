const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
// Or we can test the production one:
const PROD_API_URL = 'https://dflex-backend.onrender.com/api';

const targetUrl = PROD_API_URL;

async function runTests() {
  console.log(`🚀 Starting Test Run against ${targetUrl}...`);
  
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'password123';
  let token = '';

  try {
    // 1. Test Registration
    console.log(`\n[1/4] Testing Registration...`);
    const regRes = await axios.post(`${targetUrl}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    });
    console.log(`✅ Registration successful! (Status: ${regRes.status})`);

    // 2. Test Login
    console.log(`\n[2/4] Testing Login...`);
    const loginRes = await axios.post(`${targetUrl}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    token = loginRes.data.data.token;
    console.log(`✅ Login successful! Token received. (Status: ${loginRes.status})`);

    // 3. Test Profile Fetch
    console.log(`\n[3/4] Testing Profile Fetch (Authenticated)...`);
    const profileRes = await axios.get(`${targetUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Profile fetch successful! Hello, ${profileRes.data.data.user.name}. (Status: ${profileRes.status})`);

    // 4. Test Diet Generation
    console.log(`\n[4/4] Testing AI Diet Generation (This takes 5-10 seconds)...`);
    const dietData = {
      age: 25,
      gender: "Male",
      height: 180,
      weight: 75,
      heightUnit: "cm",
      weightUnit: "kg",
      activityLevel: "Moderately Active",
      workoutDays: 4,
      goal: "Muscle Gain",
      budget: "$15-$20",
      dietType: "Non-Veg",
      cuisine: "Continental",
      foodLikes: "Chicken, Rice, Eggs",
      foodAvoids: "Fish",
      allergies: "None",
      mealsPerDay: 4,
      cookingTime: "30-60 mins",
      waterGoal: "3-4 Liters",
      medicalConditions: "None",
      averageDailySteps: "8000",
      stressLevel: "Low"
    };

    const dietRes = await axios.post(`${targetUrl}/diet/generate`, dietData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Diet Generation successful! (Status: ${dietRes.status})`);
    console.log(`🍽️ Sample Breakfast:`, dietRes.data.diet.breakfast?.food || dietRes.data.diet.Breakfast?.food || "Found");

    console.log(`\n🎉 ALL TESTS PASSED SUCCESSFULLY! The backend is incredibly stable.`);

  } catch (error) {
    console.error(`\n❌ TEST FAILED!`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();
