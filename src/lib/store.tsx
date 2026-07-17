import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GoalType = 'Lean Bulk' | 'Dirty Bulk' | 'Lean Cut' | 'Fat Loss' | 'Maintenance' | 'Body Recomposition';
export type PreferenceLevel = 'Love' | 'Like' | 'Neutral' | 'Avoid';

export interface UserData {
  // Basic Profile
  name: string;
  dob: string;
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
  averageDailySteps: string;
  stressLevel: string;
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
  food: string;
  qty: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlanData {
  breakfast: Meal;
  morningSnack?: Meal;
  lunch: Meal;
  eveningSnack?: Meal;
  dinner: Meal;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  shoppingSuggestions: string[];
  healthyAlternatives: string[];
  nutritionTips: string[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  water: number;
  weight: number;
  currentSteps: number;
  mealsEaten: string[]; 
}

interface AppState {
  userData: UserData | null;
  metrics: DashboardMetrics | null;
  dietPlan: DietPlanData | null;
  dailyLogs: Record<string, DailyLog>; 
  waterIntake: number;
  
  updateUserData: (data: Partial<UserData>) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setDietPlan: (plan: DietPlanData | null) => void;
  
  addWater: (amount: number) => void;
  resetWater: () => void;
  updateSteps: (steps: number) => void;
  toggleMeal: (mealName: string, date: string) => void;
  logWeight: (weight: number, date: string) => void;
  
  clearData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Changed key to v3 to force cache clear for the new massive data structure
const LOCAL_STORAGE_KEY = 'dflex_state_v3'; 

const getTodayString = () => new Date().toISOString().split('T')[0];

// The backend now performs all calculations.
// This file only stores the resulting metrics.

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [dietPlan, setDietPlanState] = useState<DietPlanData | null>(null);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [waterIntake, setWaterIntakeState] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
    const stateToSave = { userData, metrics, dietPlan, dailyLogs };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [userData, metrics, dietPlan, dailyLogs]);

  useEffect(() => {
    const today = getTodayString();
    setDailyLogs(prev => {
      const todayLog = prev[today] || { date: today, water: 0, weight: userData?.weight || 0, currentSteps: 0, mealsEaten: [] };
      if (todayLog.water === waterIntake) return prev; 
      return {
        ...prev,
        [today]: { ...todayLog, water: waterIntake }
      };
    });
  }, [waterIntake, userData?.weight]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => {
      if (!prev) return data as UserData;
      return { ...prev, ...data };
    });
  };



  const setDietPlan = (plan: DietPlanData | null) => setDietPlanState(plan);

  const addWater = (amount: number) => setWaterIntakeState(prev => prev + amount);
  const resetWater = () => setWaterIntakeState(0);

  const updateSteps = (steps: number) => {
    const today = getTodayString();
    setDailyLogs(prev => {
      const log = prev[today] || { date: today, water: waterIntake, weight: userData?.weight || 0, currentSteps: 0, mealsEaten: [] };
      return {
        ...prev,
        [today]: { ...log, currentSteps: steps }
      };
    });
  };

  const toggleMeal = (mealName: string, date: string) => {
    setDailyLogs(prev => {
      const log = prev[date] || { date, water: waterIntake, weight: userData?.weight || 0, currentSteps: 0, mealsEaten: [] };
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
      const log = prev[date] || { date, water: waterIntake, weight, currentSteps: 0, mealsEaten: [] };
      return { ...prev, [date]: { ...log, weight } };
    });
    if (date === getTodayString() && userData) {
      updateUserData({ weight });
    }
  };

  const clearData = () => {
    setUserData(null);
    setMetrics(null);
    setDietPlanState(null);
    setDailyLogs({});
    setWaterIntakeState(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{
      userData, metrics, dietPlan, dailyLogs, waterIntake,
      updateUserData, setMetrics, setDietPlan,
      addWater, resetWater, updateSteps, toggleMeal, logWeight, clearData
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
