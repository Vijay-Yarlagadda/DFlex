import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GoalType = 'Lean Bulk' | 'Dirty Bulk' | 'Lean Cut' | 'Fat Loss' | 'Maintenance' | 'Body Recomposition';
export type PreferenceLevel = 'Love' | 'Like' | 'Neutral' | 'Avoid';

export interface UserData {
  // Basic Profile
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  heightUnit: 'cm' | 'ft';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  trainingType: string;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Athlete';
  workoutDays: number;
  mealsPerDay: number;
  budget: string;

  // Goal
  goal: GoalType;

  // Food Preferences
  dietType: 'Veg' | 'Non-Veg' | 'Both';
  cuisinePreference: string;
  foodPreferences: Record<string, PreferenceLevel>;
  supplements: string[];

  // Health & Lifestyle
  allergies: string[];
  medicalConditions: string[];
  waterIntakeGoal: string;
  sleepDuration: string;
  smoking: string;
  alcohol: string;
  cookingTime: string;
  spicePreference: string;
}

export interface DashboardMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterGoal: number;
}

export interface Meal {
  name: string;
  food: string;
  qty: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  water: number;
  weight: number;
  mealsEaten: string[]; 
}

interface AppState {
  apiKey: string;
  userData: UserData | null;
  metrics: DashboardMetrics | null;
  dietPlan: Meal[];
  dailyLogs: Record<string, DailyLog>; 
  waterIntake: number;
  
  setApiKey: (key: string) => void;
  updateUserData: (data: Partial<UserData>) => void;
  calculateMetrics: () => void;
  setDietPlan: (plan: Meal[]) => void;
  
  addWater: (amount: number) => void;
  resetWater: () => void;
  toggleMeal: (mealName: string, date: string) => void;
  logWeight: (weight: number, date: string) => void;
  
  clearData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Changed key to v3 to force cache clear for the new massive data structure
const LOCAL_STORAGE_KEY = 'dflex_state_v3'; 

const getTodayString = () => new Date().toISOString().split('T')[0];

// Pure function to calculate metrics (used by store AND Review step)
export const computeMetrics = (user: UserData): DashboardMetrics => {
  // Normalize units
  const weightInKg = user.weightUnit === 'lbs' ? user.weight * 0.453592 : user.weight;
  let heightInCm = user.height;
  if (user.heightUnit === 'ft') {
    // For simplicity, if they entered 5.11 we treat it as 5 feet 11 inches
    const ft = Math.floor(user.height);
    const inches = Math.round((user.height - ft) * 100); 
    heightInCm = (ft * 30.48) + (inches * 2.54);
  }

  const heightInM = heightInCm / 100;
  const bmi = weightInKg / (heightInM * heightInM);
  
  let bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * user.age;
  bmr += user.gender === 'Male' ? 5 : -161;
  
  const activityMultipliers: Record<string, number> = {
    'Sedentary': 1.2, 
    'Lightly Active': 1.375, 
    'Moderately Active': 1.55, 
    'Very Active': 1.725, 
    'Athlete': 1.9,
  };
  const tdee = bmr * (activityMultipliers[user.activityLevel] || 1.2);
  
  let targetCalories = tdee;
  if (user.goal === 'Lean Bulk') targetCalories += 300;
  if (user.goal === 'Dirty Bulk') targetCalories += 500;
  if (user.goal === 'Lean Cut') targetCalories -= 300;
  if (user.goal === 'Fat Loss') targetCalories -= 500;
  // Maintenance and Body Recomposition stay roughly at TDEE

  let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
  if (user.goal.includes('Bulk')) { pRatio = 0.25; cRatio = 0.5; fRatio = 0.25; }
  if (user.goal.includes('Loss') || user.goal.includes('Cut') || user.goal === 'Body Recomposition') { 
    pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; 
  }

  const protein = (targetCalories * pRatio) / 4;
  const carbs = (targetCalories * cRatio) / 4;
  const fat = (targetCalories * fRatio) / 9;
  const waterGoal = (weightInKg * 35) + (user.workoutDays > 0 ? 500 : 0);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    waterGoal: Math.round(waterGoal),
  };
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [dietPlan, setDietPlanState] = useState<Meal[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [waterIntake, setWaterIntakeState] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey) setApiKeyState(parsed.apiKey);
        if (parsed.userData) setUserData(parsed.userData);
        if (parsed.metrics) setMetrics(parsed.metrics);
        if (parsed.dietPlan) setDietPlanState(parsed.dietPlan);
        if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
        
        const today = getTodayString();
        if (parsed.dailyLogs && parsed.dailyLogs[today]) {
          setWaterIntakeState(parsed.dailyLogs[today].water || 0);
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = { apiKey, userData, metrics, dietPlan, dailyLogs };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [apiKey, userData, metrics, dietPlan, dailyLogs]);

  useEffect(() => {
    const today = getTodayString();
    setDailyLogs(prev => {
      const todayLog = prev[today] || { date: today, water: 0, weight: userData?.weight || 0, mealsEaten: [] };
      if (todayLog.water === waterIntake) return prev; 
      return {
        ...prev,
        [today]: { ...todayLog, water: waterIntake }
      };
    });
  }, [waterIntake, userData?.weight]);

  const setApiKey = (key: string) => setApiKeyState(key);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => {
      if (!prev) return data as UserData;
      return { ...prev, ...data };
    });
  };

  const calculateMetrics = () => {
    if (!userData) return;
    setMetrics(computeMetrics(userData));
  };

  const setDietPlan = (plan: Meal[]) => setDietPlanState(plan);

  const addWater = (amount: number) => setWaterIntakeState(prev => prev + amount);
  const resetWater = () => setWaterIntakeState(0);

  const toggleMeal = (mealName: string, date: string) => {
    setDailyLogs(prev => {
      const log = prev[date] || { date, water: waterIntake, weight: userData?.weight || 0, mealsEaten: [] };
      const hasEaten = log.mealsEaten.includes(mealName);
      return {
        ...prev,
        [date]: {
          ...log,
          mealsEaten: hasEaten 
            ? log.mealsEaten.filter(m => m !== mealName)
            : [...log.mealsEaten, mealName]
        }
      };
    });
  };

  const logWeight = (weight: number, date: string) => {
    setDailyLogs(prev => {
      const log = prev[date] || { date, water: waterIntake, weight, mealsEaten: [] };
      return { ...prev, [date]: { ...log, weight } };
    });
    if (date === getTodayString() && userData) {
      updateUserData({ weight });
      calculateMetrics();
    }
  };

  const clearData = () => {
    setApiKey('');
    setUserData(null);
    setMetrics(null);
    setDietPlanState([]);
    setDailyLogs({});
    setWaterIntakeState(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{
      apiKey, userData, metrics, dietPlan, dailyLogs, waterIntake,
      setApiKey, updateUserData, calculateMetrics, setDietPlan,
      addWater, resetWater, toggleMeal, logWeight, clearData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
