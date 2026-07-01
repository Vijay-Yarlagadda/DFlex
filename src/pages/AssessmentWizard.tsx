import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, Activity, Target, Utensils, 
  HeartPulse, Sparkles, Dumbbell, Home, Bike, Footprints
} from 'lucide-react';
import { useAppStore, type UserData, type GoalType, type PreferenceLevel, computeMetrics } from '../lib/store';
import { Button } from '../components/ui/Button';

// --- DATA CONSTANTS ---
const TRAINING_TYPES = ['Gym', 'Home Workout', 'CrossFit', 'Running', 'Cycling', 'Yoga', 'Sports', 'No Exercise'];
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Athlete'];
const BUDGETS = ['₹100', '₹200', '₹300', '₹500', '₹700+'];
const DIET_TYPES = ['Veg', 'Non-Veg', 'Both'];
const CUISINES = ['South Indian', 'North Indian', 'Mixed Indian', 'International'];

const GOALS = [
  { id: 'Lean Bulk', title: 'Lean Bulk', desc: 'Build muscle with minimal fat gain.', icon: Dumbbell },
  { id: 'Dirty Bulk', title: 'Dirty Bulk', desc: 'Maximize mass and strength rapidly.', icon: Target },
  { id: 'Lean Cut', title: 'Lean Cut', desc: 'Preserve muscle while shedding fat.', icon: Activity },
  { id: 'Fat Loss', title: 'Fat Loss', desc: 'Aggressive calorie deficit for weight loss.', icon: HeartPulse },
  { id: 'Maintenance', title: 'Maintenance', desc: 'Maintain current body composition.', icon: Home },
  { id: 'Body Recomposition', title: 'Body Recomposition', desc: 'Build muscle and lose fat simultaneously.', icon: Sparkles },
];

const FOODS = {
  Protein: ['Chicken', 'Eggs', 'Paneer', 'Milk', 'Curd', 'Greek Yogurt', 'Tofu', 'Soy Chunks', 'Dal (Lentils)', 'Chickpeas', 'Rajma', 'Sprouts', 'Mutton', 'Fish'],
  Carbohydrates: ['White Rice', 'Brown Rice', 'Roti / Chapati', 'Oats', 'Potato', 'Sweet Potato', 'Poha', 'Upma', 'Bread', 'Millets', 'Quinoa'],
  Fats: ['Peanut Butter', 'Peanuts', 'Ghee', 'Butter', 'Cheese', 'Olive Oil', 'Almonds', 'Walnuts', 'Mixed Seeds', 'Avocado'],
  Fruits: ['Banana', 'Apple', 'Orange', 'Mango', 'Papaya', 'Watermelon', 'Guava', 'Grapes', 'Pomegranate'],
  Vegetables: ['Spinach', 'Broccoli', 'Carrot', 'Beans', 'Cabbage', 'Cauliflower', 'Capsicum', 'Tomato', 'Cucumber', 'Mushroom', 'Onion']
};

const ALLERGIES = ['Milk', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy', 'Gluten', 'Seafood', 'None'];
const CONDITIONS = ['Diabetes', 'Hypertension', 'Thyroid', 'PCOS', 'High Cholesterol', 'None'];
const SUPPLEMENTS = ['Whey Protein', 'Creatine', 'Multivitamin', 'Omega 3', 'None'];
const WATER_GOALS = ['1L', '2L', '3L', '4L', '5L'];
const SLEEP_DURATIONS = ['Less than 5 hrs', '6 hrs', '7 hrs', '8 hrs', '9+ hrs'];
const SMOKING_HABITS = ['Never', 'Occasionally', 'Regularly'];
const ALCOHOL_HABITS = ['Never', 'Occasionally', 'Weekly', 'Frequently'];
const COOKING_TIMES = ['15 min', '30 min', '45 min', '60+ min'];
const SPICE_LEVELS = ['Low', 'Medium', 'High'];

export const AssessmentWizard = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAppStore();
  const [step, setStep] = useState(1);

  // Default State
  const [data, setData] = useState<UserData>({
    name: '', age: 25, gender: 'Male',
    height: 175, heightUnit: 'cm',
    weight: 70, weightUnit: 'kg',
    trainingType: 'Gym', activityLevel: 'Moderately Active',
    workoutDays: 4, mealsPerDay: 4, budget: '₹300',
    goal: 'Lean Cut',
    dietType: 'Non-Veg', cuisinePreference: 'Mixed Indian',
    foodPreferences: {}, supplements: ['None'],
    allergies: ['None'], medicalConditions: ['None'],
    waterIntakeGoal: '3L', sleepDuration: '7 hrs',
    smoking: 'Never', alcohol: 'Never',
    cookingTime: '30 min', spicePreference: 'Medium'
  });

  const nextStep = () => {
    if (step === 1 && (!data.name || !data.age || !data.height || !data.weight)) {
      alert("Please fill out all basic details.");
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    updateUserData(data);
    navigate('/generating');
  };

  const update = (field: keyof UserData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'allergies' | 'medicalConditions' | 'supplements', item: string) => {
    setData(prev => {
      const arr = prev[field];
      if (item === 'None') return { ...prev, [field]: ['None'] };
      
      let newArr = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
      newArr = newArr.filter(i => i !== 'None');
      if (newArr.length === 0) newArr = ['None'];
      
      return { ...prev, [field]: newArr };
    });
  };

  const renderProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
        <span>Step {step} of 5</span>
        <span>{Math.round((step / 5) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`flex-1 h-full rounded-full transition-colors duration-500 ${i <= step ? 'bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]' : 'bg-transparent'}`} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00E5FF]/30 pb-24">
      <div className="max-w-3xl mx-auto p-6 md:p-8 pt-12">
        {renderProgress()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && <Step1 data={data} update={update} />}
            {step === 2 && <Step2 data={data} update={update} />}
            {step === 3 && <Step3 data={data} update={update} />}
            {step === 4 && <Step4 data={data} update={update} toggle={toggleArrayItem} />}
            {step === 5 && <Step5 data={data} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft size={18} className="mr-2" /> Back
            </Button>
          ) : <div />}
          
          {step < 5 ? (
            <Button onClick={nextStep} className="bg-white text-black hover:bg-zinc-200">
              Continue <ChevronRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-[#CCFF00] text-black hover:bg-[#b3ff00] shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              <Sparkles size={18} className="mr-2" /> Generate My AI Diet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STEP COMPONENTS
// ==========================================

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const PillSelect = ({ options, value, onChange }: { options: string[], value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          value === opt 
            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const MultiPillSelect = ({ options, value, onToggle }: { options: string[], value: string[], onToggle: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const isSelected = value.includes(opt);
      return (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            isSelected 
              ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
          }`}
        >
          {isSelected && <Check size={14} className="inline mr-1" />}
          {opt}
        </button>
      )
    })}
  </div>
);

const Step1 = ({ data, update }: any) => (
  <div className="space-y-10">
    <div>
      <h2 className="text-3xl font-black mb-2 tracking-tight">Basic Profile</h2>
      <p className="text-zinc-400 text-lg">Let's establish your baseline metrics.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputGroup label="Name">
        <input 
          type="text" 
          value={data.name} 
          onChange={e => update('name', e.target.value)}
          placeholder="John Doe"
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
        />
      </InputGroup>

      <InputGroup label="Age">
        <input 
          type="number" 
          value={data.age || ''} 
          onChange={e => update('age', parseInt(e.target.value))}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
        />
      </InputGroup>
    </div>

    <InputGroup label="Gender">
      <div className="flex gap-4">
        {['Male', 'Female', 'Other'].map(g => (
          <label key={g} className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${data.gender === g ? 'bg-white text-black border-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
            <input type="radio" name="gender" className="hidden" checked={data.gender === g} onChange={() => update('gender', g)} />
            <span className="font-bold">{g}</span>
          </label>
        ))}
      </div>
    </InputGroup>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputGroup label="Height">
        <div className="flex gap-2">
          <input 
            type="number" 
            value={data.height || ''} 
            onChange={e => update('height', parseFloat(e.target.value))}
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
          />
          <select 
            value={data.heightUnit} 
            onChange={e => update('heightUnit', e.target.value)}
            className="w-24 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white"
          >
            <option value="cm">cm</option>
            <option value="ft">ft/in</option>
          </select>
        </div>
      </InputGroup>

      <InputGroup label="Weight">
        <div className="flex gap-2">
          <input 
            type="number" 
            value={data.weight || ''} 
            onChange={e => update('weight', parseFloat(e.target.value))}
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
          />
          <select 
            value={data.weightUnit} 
            onChange={e => update('weightUnit', e.target.value)}
            className="w-24 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </InputGroup>
    </div>

    <InputGroup label="Primary Training Type">
      <PillSelect options={TRAINING_TYPES} value={data.trainingType} onChange={v => update('trainingType', v)} />
    </InputGroup>

    <InputGroup label="Activity Level (Outside Training)">
      <PillSelect options={ACTIVITY_LEVELS} value={data.activityLevel} onChange={v => update('activityLevel', v)} />
    </InputGroup>

    <InputGroup label="Workout Days Per Week">
      <div className="flex gap-2">
        {[0,1,2,3,4,5,6,7].map(d => (
          <button
            key={d}
            onClick={() => update('workoutDays', d)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${data.workoutDays === d ? 'bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            {d}
          </button>
        ))}
      </div>
    </InputGroup>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputGroup label="Meals Per Day">
        <PillSelect options={['3','4','5','6']} value={data.mealsPerDay.toString()} onChange={v => update('mealsPerDay', parseInt(v))} />
      </InputGroup>
      <InputGroup label="Daily Food Budget">
        <PillSelect options={BUDGETS} value={data.budget} onChange={v => update('budget', v)} />
      </InputGroup>
    </div>
  </div>
);

const Step2 = ({ data, update }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-black mb-2 tracking-tight">Fitness Goal</h2>
      <p className="text-zinc-400 text-lg">What is your primary objective?</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {GOALS.map(goal => {
        const isSelected = data.goal === goal.id;
        const Icon = goal.icon;
        return (
          <div 
            key={goal.id}
            onClick={() => update('goal', goal.id)}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden group ${
              isSelected 
                ? 'bg-zinc-900 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700'
            }`}
          >
            {isSelected && <div className="absolute inset-0 bg-white/5 opacity-100" />}
            <div className="relative z-10 flex items-start gap-4">
              <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 group-hover:text-white'}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{goal.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{goal.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const Step3 = ({ data, update }: any) => {
  const setFoodPref = (food: string, level: PreferenceLevel) => {
    update('foodPreferences', { ...data.foodPreferences, [food]: level });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">Food Preferences</h2>
        <p className="text-zinc-400 text-lg">Let's tailor the AI to your exact tastes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Diet Type">
          <PillSelect options={DIET_TYPES} value={data.dietType} onChange={v => update('dietType', v)} />
        </InputGroup>
        <InputGroup label="Cuisine Preference">
          <PillSelect options={CUISINES} value={data.cuisinePreference} onChange={v => update('cuisinePreference', v)} />
        </InputGroup>
      </div>

      <div className="space-y-8 pt-8 border-t border-zinc-900">
        <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 mb-6 flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
          <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Rate your foods</span>
          <span className="text-zinc-500 text-xs">Select your preference for each item to tune the AI.</span>
        </div>

        {Object.entries(FOODS).map(([category, foods]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-black text-white border-b border-zinc-800 pb-2">{category}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {foods.map(food => {
                const current = data.foodPreferences[food] || 'Neutral';
                return (
                  <div key={food} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-colors gap-3">
                    <span className="text-sm font-bold text-zinc-300">{food}</span>
                    <div className="flex bg-zinc-900 rounded-lg p-1 w-full sm:w-auto">
                      {[
                        { val: 'Love', label: 'Prefer', activeClass: 'bg-[#CCFF00] text-black font-bold shadow-sm' },
                        { val: 'Neutral', label: 'Neutral', activeClass: 'bg-zinc-700 text-white font-bold shadow-sm' },
                        { val: 'Avoid', label: 'Avoid', activeClass: 'bg-[#FF3366] text-white font-bold shadow-sm' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setFoodPref(food, opt.val as PreferenceLevel)}
                          className={`flex-1 sm:w-20 py-1.5 text-xs rounded-md transition-all duration-200 text-center ${
                            current === opt.val ? opt.activeClass : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step4 = ({ data, update, toggle }: any) => (
  <div className="space-y-10">
    <div>
      <h2 className="text-3xl font-black mb-2 tracking-tight">Health & Lifestyle</h2>
      <p className="text-zinc-400 text-lg">Final details for perfect optimization.</p>
    </div>

    <div className="space-y-8">
      <InputGroup label="Food Allergies (Multiple)">
        <MultiPillSelect options={ALLERGIES} value={data.allergies} onToggle={v => toggle('allergies', v)} />
      </InputGroup>

      <InputGroup label="Medical Conditions (Multiple)">
        <MultiPillSelect options={CONDITIONS} value={data.medicalConditions} onToggle={v => toggle('medicalConditions', v)} />
      </InputGroup>
      
      <InputGroup label="Supplements Taken (Multiple)">
        <MultiPillSelect options={SUPPLEMENTS} value={data.supplements} onToggle={v => toggle('supplements', v)} />
      </InputGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
        <InputGroup label="Water Intake Goal">
          <PillSelect options={WATER_GOALS} value={data.waterIntakeGoal} onChange={v => update('waterIntakeGoal', v)} />
        </InputGroup>
        <InputGroup label="Sleep Duration">
          <PillSelect options={SLEEP_DURATIONS} value={data.sleepDuration} onChange={v => update('sleepDuration', v)} />
        </InputGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Smoking">
          <PillSelect options={SMOKING_HABITS} value={data.smoking} onChange={v => update('smoking', v)} />
        </InputGroup>
        <InputGroup label="Alcohol">
          <PillSelect options={ALCOHOL_HABITS} value={data.alcohol} onChange={v => update('alcohol', v)} />
        </InputGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Available Cooking Time">
          <PillSelect options={COOKING_TIMES} value={data.cookingTime} onChange={v => update('cookingTime', v)} />
        </InputGroup>
        <InputGroup label="Spice Preference">
          <PillSelect options={SPICE_LEVELS} value={data.spicePreference} onChange={v => update('spicePreference', v)} />
        </InputGroup>
      </div>
    </div>
  </div>
);

const Step5 = ({ data }: { data: UserData }) => {
  const metrics = computeMetrics(data);
  const lovedCount = Object.values(data.foodPreferences).filter(v => v === 'Love').length;
  const avoidedCount = Object.values(data.foodPreferences).filter(v => v === 'Avoid').length;

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] mb-6">
          <Sparkles size={32} />
        </div>
        <h2 className="text-4xl font-black mb-3 tracking-tight">Your Profile is Ready</h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto">Review your calculated baseline before we generate your custom AI nutrition protocol.</p>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{data.name}</h3>
            <p className="text-zinc-400">{data.age} yrs • {data.gender} • {data.height}{data.heightUnit} • {data.weight}{data.weightUnit}</p>
          </div>
          <div className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm uppercase tracking-wider">
            {data.goal}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Target Calories</p>
            <p className="text-3xl font-black text-white">{metrics.dailyCalories}</p>
          </div>
          <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Protein</p>
            <p className="text-3xl font-black text-[#CCFF00]">{metrics.protein}g</p>
          </div>
          <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Carbs</p>
            <p className="text-3xl font-black text-[#00E5FF]">{metrics.carbs}g</p>
          </div>
          <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Fat</p>
            <p className="text-3xl font-black text-[#FF3366]">{metrics.fat}g</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">Diet</p>
            <p className="text-zinc-300">{data.dietType} ({data.cuisinePreference})</p>
          </div>
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">Activity</p>
            <p className="text-zinc-300">{data.activityLevel}</p>
          </div>
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">Budget</p>
            <p className="text-zinc-300">{data.budget} / day</p>
          </div>
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">BMI & BMR</p>
            <p className="text-zinc-300">{metrics.bmi} BMI • {metrics.bmr} kcal</p>
          </div>
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">Loved Foods</p>
            <p className="text-zinc-300">{lovedCount} Items</p>
          </div>
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1 text-xs">Avoided Foods</p>
            <p className="text-zinc-300">{avoidedCount} Items</p>
          </div>
        </div>
      </div>
    </div>
  );
};
