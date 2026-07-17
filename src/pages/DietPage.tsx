import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore, type Meal } from '../lib/store';
import { Card } from '../components/ui/Card';
import { RefreshCw, Settings2, UtensilsCrossed, CheckCircle2, Circle, ShoppingCart, Info, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export const DietPage = () => {
  const { userData, metrics, dietPlan, dailyLogs, toggleMeal } = useAppStore();
  const navigate = useNavigate();

  if (!userData || !metrics) {
    return <Navigate to="/assessment" />;
  }

  if (!dietPlan) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 text-center mt-20">
        <h2 className="text-2xl font-black text-white mb-4">No Diet Plan Generated Yet</h2>
        <p className="text-zinc-400 mb-8">You need to generate your personalized AI protocol.</p>
        <button 
          onClick={() => navigate('/generating')}
          className="inline-flex items-center justify-center px-8 py-4 bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
        >
          Generate My AI Diet
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[today] || { mealsEaten: [] };
  const eatenMeals = todayLog.mealsEaten || [];
  
  const mealEntries: {name: string, meal: Meal}[] = [
    { name: 'Breakfast', meal: dietPlan.breakfast },
    { name: 'Morning Snack', meal: dietPlan.morningSnack as Meal },
    { name: 'Lunch', meal: dietPlan.lunch },
    { name: 'Evening Snack', meal: dietPlan.eveningSnack as Meal },
    { name: 'Dinner', meal: dietPlan.dinner }
  ].filter(entry => entry.meal && entry.meal.food); // Filter out empty meals

  const progressPercent = mealEntries.length > 0 ? (eatenMeals.length / mealEntries.length) * 100 : 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            AI Protocol
          </h1>
          <p className="text-zinc-400">Your personalized AI-generated nutrition plan.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/profile')} className="px-4 py-2 border border-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors flex items-center text-sm font-bold">
            <Settings2 size={16} className="mr-2" />
            Config
          </button>
          <button onClick={() => navigate('/generating')} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors flex items-center text-sm font-bold">
            <RefreshCw size={16} className="mr-2" />
            Regenerate
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <Card className="p-6 bg-zinc-950/50 border-zinc-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Daily Adherence</h3>
            <p className="text-zinc-500 text-xs">Complete your protocol for maximum results.</p>
          </div>
          <div className="text-2xl font-black text-[#00E5FF]">{Math.round(progressPercent)}%</div>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </Card>

      <div className="space-y-4">
        {mealEntries.map((entry, index) => {
          const { name, meal } = entry;
          const isEaten = eatenMeals.includes(name);
          
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 md:p-6 transition-all duration-300 border-l-4 cursor-pointer group ${
                  isEaten 
                    ? 'border-l-[#00E5FF] bg-[#00E5FF]/5' 
                    : 'border-l-[#CCFF00] hover:bg-zinc-900'
                }`}
                onClick={() => toggleMeal(name, today)}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  {/* Left Section: Checkbox & Info */}
                  <div className="flex-1 flex gap-4 items-start">
                    <button className={`mt-1 flex-shrink-0 transition-colors ${isEaten ? 'text-[#00E5FF]' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {isEaten ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div>
                      <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">
                        <UtensilsCrossed size={14} />
                        <span className={isEaten ? 'text-[#00E5FF]' : ''}>{name}</span>
                      </div>
                      <h3 className={`text-xl font-bold mb-1 transition-colors ${isEaten ? 'text-zinc-300 line-through' : 'text-white'}`}>
                        {meal.food}
                      </h3>
                      <p className="text-zinc-500 text-sm font-medium">{meal.qty}</p>
                    </div>
                  </div>
                  
                  {/* Right Section: Macros */}
                  <div className={`grid grid-cols-4 gap-4 w-full md:w-auto p-4 rounded-lg border transition-colors ${
                    isEaten ? 'bg-black/40 border-[#00E5FF]/20' : 'bg-zinc-950/50 border-zinc-800/50'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span className={`font-black text-lg ${isEaten ? 'text-zinc-500' : 'text-[#CCFF00]'}`}>{meal.calories}</span>
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Kcal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-bold text-lg ${isEaten ? 'text-zinc-500' : 'text-white'}`}>{meal.protein}</span>
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Pro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-bold text-lg ${isEaten ? 'text-zinc-500' : 'text-white'}`}>{meal.carbs}</span>
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Carb</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-bold text-lg ${isEaten ? 'text-zinc-500' : 'text-white'}`}>{meal.fat}</span>
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Fat</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6 bg-zinc-950 border-zinc-800">
          <h3 className="text-sm font-bold text-[#CCFF00] uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShoppingCart size={16} /> Shopping Suggestions
          </h3>
          <ul className="space-y-2">
            {dietPlan.shoppingSuggestions?.map((tip, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-zinc-600 mt-1">•</span> {tip}
              </li>
            ))}
            {(!dietPlan.shoppingSuggestions || dietPlan.shoppingSuggestions.length === 0) && (
              <li className="text-sm text-zinc-500">No suggestions available.</li>
            )}
          </ul>
        </Card>
        
        <Card className="p-6 bg-zinc-950 border-zinc-800">
          <h3 className="text-sm font-bold text-[#00E5FF] uppercase tracking-widest mb-4 flex items-center gap-2">
            <Lightbulb size={16} /> Healthy Alternatives
          </h3>
          <ul className="space-y-2">
            {dietPlan.healthyAlternatives?.map((alt, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-zinc-600 mt-1">•</span> {alt}
              </li>
            ))}
            {(!dietPlan.healthyAlternatives || dietPlan.healthyAlternatives.length === 0) && (
              <li className="text-sm text-zinc-500">No alternatives available.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="p-6 bg-zinc-950 border-zinc-800">
        <h3 className="text-sm font-bold text-[#FF3366] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Info size={16} /> Nutrition Tips
        </h3>
        <ul className="space-y-2">
          {dietPlan.nutritionTips?.map((tip, i) => (
            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
              <span className="text-zinc-600 mt-1">•</span> {tip}
            </li>
          ))}
          {(!dietPlan.nutritionTips || dietPlan.nutritionTips.length === 0) && (
            <li className="text-sm text-zinc-500">No tips available.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};
