import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/card';
import { Flame, Target, Droplet, Dumbbell, Footprints, Info, Moon, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { userData, metrics, dailyLogs, waterIntake, addWater, updateSteps } = useAppStore();
  const navigate = useNavigate();
  const [stepInput, setStepInput] = useState('');

  if (!userData) {
    return <Navigate to="/onboarding" />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[todayStr];
  const currentSteps = todayLog?.currentSteps || 0;
  
  // Extract max steps goal
  const stepsGoalStr = userData.averageDailySteps || "3000-6000";
  const maxSteps = stepsGoalStr.includes('+') ? parseInt(stepsGoalStr.replace('+', '')) : parseInt(stepsGoalStr.split('-')[1]);
  
  const handleStepsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stepInput && !isNaN(parseInt(stepInput))) {
      updateSteps(parseInt(stepInput));
      setStepInput('');
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obesity";
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            Overview
          </h1>
          <p className="text-zinc-400">Welcome back, {userData.name}. Let's crush today's goals.</p>
        </div>
        
        {!metrics && (
          <button onClick={() => navigate('/assessment')} className="inline-flex items-center justify-center px-6 py-3 bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all">
            <Target className="mr-2" size={18} /> Generate Diet Plan
          </button>
        )}
      </header>

      {!metrics ? (
        <Card className="p-12 border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-6">
            <Target size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase text-white mb-3">No Active Plan</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            You have completed your basic profile, but you haven't generated an AI-optimized nutrition protocol yet.
          </p>
          <button onClick={() => navigate('/assessment')} className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-lg transition-colors">
            Start Assessment
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Cards: Goal & Calories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-[#CCFF00]/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3 text-[#CCFF00]">
                    <Target size={24} />
                    <span className="font-bold uppercase tracking-wider text-sm">Current Goal</span>
                  </div>
                </div>
                <div className="text-3xl font-black uppercase text-white mb-2">{userData.goal}</div>
                <div className="text-zinc-400 text-sm">Activity Level: {userData.activityLevel}</div>
              </Card>

              <Card className="p-6 relative overflow-hidden bg-zinc-950 border-zinc-800">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF3366]/10 blur-[50px] rounded-full" />
                <div className="flex items-center gap-3 text-[#FF3366] mb-6">
                  <Flame size={24} />
                  <span className="font-bold uppercase tracking-wider text-sm">Target Calories</span>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-white">{metrics.dailyCalories}</span>
                  <span className="text-zinc-500 font-bold">kcal</span>
                </div>
              </Card>
            </div>

            {/* Macros */}
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Macro Targets</h3>
              <div className="grid grid-cols-3 gap-4">
                <MacroCard title="Protein" value={metrics.protein} unit="g" color="#CCFF00" />
                <MacroCard title="Carbs" value={metrics.carbs} unit="g" color="#00E5FF" />
                <MacroCard title="Fat" value={metrics.fat} unit="g" color="#FF3366" />
              </div>
            </Card>

            {/* Trackers: Water & Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Water Tracker */}
              <Card className="p-6 bg-zinc-950 border-zinc-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 text-[#00E5FF] mb-4">
                  <Droplet size={20} />
                  <span className="font-bold uppercase tracking-widest text-sm">Water Intake</span>
                </div>
                
                <div className="relative w-32 h-32 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" className="stroke-zinc-900" strokeWidth="12" fill="none" />
                    <motion.circle 
                      cx="64" cy="64" r="56" 
                      className="stroke-[#00E5FF]" 
                      strokeWidth="12" fill="none" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 351" }}
                      animate={{ strokeDasharray: `${Math.min((waterIntake / (metrics.waterGoal/1000)) * 351, 351)} 351` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{waterIntake.toFixed(1)}</span>
                    <span className="text-xs text-zinc-500 font-bold uppercase">of {metrics.waterGoal/1000}L</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => addWater(0.25)} className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm font-bold transition-colors">
                    +250ml
                  </button>
                  <button onClick={() => addWater(0.5)} className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm font-bold transition-colors">
                    +500ml
                  </button>
                </div>
              </Card>

              {/* Steps Tracker */}
              <Card className="p-6 bg-zinc-950 border-zinc-800 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-[#CCFF00] mb-4">
                  <Footprints size={20} />
                  <span className="font-bold uppercase tracking-widest text-sm">Daily Steps</span>
                </div>

                <div className="w-full mb-6 relative pt-4">
                  <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase mb-2">
                    <span>{currentSteps}</span>
                    <span>{maxSteps}</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#CCFF00]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((currentSteps / maxSteps) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-zinc-400 font-medium mb-6">
                  {currentSteps >= maxSteps ? "Excellent! You achieved your daily goal." : `Walk ${maxSteps - currentSteps} more steps to reach your goal.`}
                </p>

                <form onSubmit={handleStepsSubmit} className="flex gap-2 w-full">
                  <input 
                    type="number" 
                    placeholder="Update steps..." 
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                  <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors">
                    Update
                  </button>
                </form>
              </Card>
            </div>

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Body Metrics Summary */}
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Body Baseline</h3>
              <div className="space-y-4">
                <MetricRow label="Current BMI" value={metrics.bmi} unit="" />
                <MetricRow label="BMI Category" value={getBMICategory(metrics.bmi)} unit="" />
                <MetricRow label="BMR (Resting)" value={metrics.bmr} unit="kcal" />
                <MetricRow label="TDEE (Total)" value={metrics.tdee} unit="kcal" />
              </div>
            </Card>

            {/* Health Insights */}
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={16} /> Health Insights
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1 bg-zinc-900 rounded-md text-[#00E5FF]"><Droplet size={14} /></div>
                  <div>
                    <span className="font-bold text-white block">Hydration</span>
                    <span className="text-zinc-500">Target {metrics.waterGoal/1000}L daily for optimal metabolism.</span>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1 bg-zinc-900 rounded-md text-[#CCFF00]"><Dumbbell size={14} /></div>
                  <div>
                    <span className="font-bold text-white block">Protein Target</span>
                    <span className="text-zinc-500">Hit {metrics.protein}g to support your {userData.goal.toLowerCase()} goal.</span>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1 bg-zinc-900 rounded-md text-[#FF3366]"><Moon size={14} /></div>
                  <div>
                    <span className="font-bold text-white block">Sleep Duration</span>
                    <span className="text-zinc-500">Aim for {userData.sleepDuration} to maximize recovery.</span>
                  </div>
                </li>
              </ul>
            </Card>

            {/* AI Suggestions */}
            <Card className="p-6 bg-zinc-950 border-zinc-800 border-t-2 border-t-[#CCFF00]">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#CCFF00]" /> AI Assistant
              </h3>
              <p className="text-xs text-zinc-400 mb-4">Quick actions to refine your current protocol.</p>
              <div className="space-y-2">
                <SuggestionButton text="Replace Paneer with Chicken" onClick={() => navigate('/generating')} />
                <SuggestionButton text="High Protein Version" onClick={() => navigate('/generating')} />
                <SuggestionButton text="Vegetarian Version" onClick={() => navigate('/generating')} />
                <button 
                  onClick={() => navigate('/generating')}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  <RefreshCw size={14} /> Regenerate Diet
                </button>
              </div>
            </Card>

          </div>

        </div>
      )}
    </div>
  );
};

const MacroCard = ({ title, value, unit, color }: { title: string, value: number, unit: string, color: string }) => (
  <div className="bg-zinc-900/50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-zinc-800/50">
    <div className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-2">{title}</div>
    <div className="flex items-baseline gap-1" style={{ color }}>
      <span className="text-2xl md:text-3xl font-black">{value}</span>
      <span className="text-xs font-bold opacity-70">{unit}</span>
    </div>
  </div>
);

const MetricRow = ({ label, value, unit = "" }: { label: string, value: string | number, unit?: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-zinc-900/50 last:border-0">
    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</span>
    <div className="text-white font-bold text-sm flex items-baseline gap-1">
      {value} <span className="text-zinc-500 text-xs">{unit}</span>
    </div>
  </div>
);

const SuggestionButton = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors border border-zinc-800 hover:border-zinc-700 flex items-center gap-2"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
    {text}
  </button>
);
