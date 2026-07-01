import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GoalType = 'Lean Bulk' | 'Dirty Bulk' | 'Lean Cut' | 'Fat Loss' | 'Maintenance';

export interface UserData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  goal: GoalType;
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  workoutDays: number;
  sleepHours: number;
  foodPreference: 'Veg' | 'Vegan' | 'Egg' | 'Non-Veg';
  allergies: string[];
  budget: string;
  mealsPerDay: number;
  foodsToAvoid: string;
  favoriteFoods: string;
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
  mealsEaten: string[]; // Array of meal names (e.g. "Breakfast")
}

interface AppState {
  apiKey: string;
  userData: UserData | null;
  metrics: DashboardMetrics | null;
  dietPlan: Meal[];
  dailyLogs: Record<string, DailyLog>; // map of YYYY-MM-DD to log
  waterIntake: number;
  
  setApiKey: (key: string) => void;
  updateUserData: (data: Partial<UserData>) => void;
  calculateMetrics: () => void;
  setDietPlan: (plan: Meal[]) => void;
  
  // Daily Trackers
  addWater: (amount: number) => void;
  resetWater: () => void;
  toggleMeal: (mealName: string, date: string) => void;
  logWeight: (weight: number, date: string) => void;
  
  clearData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dflex_state_v2';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [dietPlan, setDietPlanState] = useState<Meal[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [waterIntake, setWaterIntakeState] = useState<number>(0);

  // Load from local storage
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

  // Save to local storage
  useEffect(() => {
    const stateToSave = { apiKey, userData, metrics, dietPlan, dailyLogs };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [apiKey, userData, metrics, dietPlan, dailyLogs]);

  // Sync current day water to daily log
  useEffect(() => {
    const today = getTodayString();
    setDailyLogs(prev => {
      const todayLog = prev[today] || { date: today, water: 0, weight: userData?.weight || 0, mealsEaten: [] };
      if (todayLog.water === waterIntake) return prev; // no change
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
    const heightInM = userData.height / 100;
    const bmi = userData.weight / (heightInM * heightInM);
    let bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age;
    bmr += userData.gender === 'Male' ? 5 : -161;
    const activityMultipliers: Record<string, number> = {
      Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725, 'Very Active': 1.9,
    };
    const tdee = bmr * (activityMultipliers[userData.activityLevel] || 1.2);
    let targetCalories = tdee;
    if (userData.goal === 'Lean Bulk') targetCalories += 300;
    if (userData.goal === 'Dirty Bulk') targetCalories += 500;
    if (userData.goal === 'Lean Cut') targetCalories -= 300;
    if (userData.goal === 'Fat Loss') targetCalories -= 500;

    let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
    if (userData.goal.includes('Bulk')) { pRatio = 0.25; cRatio = 0.5; fRatio = 0.25; }
    if (userData.goal.includes('Loss') || userData.goal.includes('Cut')) { pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; }

    const protein = (targetCalories * pRatio) / 4;
    const carbs = (targetCalories * cRatio) / 4;
    const fat = (targetCalories * fRatio) / 9;
    const waterGoal = (userData.weight * 35) + (userData.workoutDays > 0 ? 500 : 0);

    setMetrics({
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      waterGoal: Math.round(waterGoal),
    });
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
    // Also update current profile weight if logging for today
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
