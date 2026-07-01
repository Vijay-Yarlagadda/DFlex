import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore, type GoalType, type UserData } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Target, Scale, Utensils, LogOut, Key } from 'lucide-react';

export const Profile = () => {
  const { userData, updateUserData, clearData, calculateMetrics } = useAppStore();
  const navigate = useNavigate();
  
  if (!userData) {
    return <Navigate to="/assessment" />;
  }

  const [weight, setWeight] = useState(userData.weight);
  const [goal, setGoal] = useState<GoalType>(userData.goal);
  const [foodPref, setFoodPref] = useState(userData.foodPreference);
  const { apiKey, setApiKey } = useAppStore();
  const [apiInput, setApiInput] = useState(apiKey || '');

  const handleSave = () => {
    setApiKey(apiInput);
    updateUserData({
      weight,
      goal,
      foodPreference: foodPref as UserData['foodPreference']
    });
    calculateMetrics();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    clearData();
    navigate('/');
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 pb-24">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            Profile
          </h1>
          <p className="text-zinc-400">Manage your metrics and preferences.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </header>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <div className="w-16 h-16 bg-[#CCFF00]/20 rounded-full flex items-center justify-center border border-[#CCFF00]/50 text-[#CCFF00]">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{userData.name}</h2>
            <p className="text-zinc-400 text-sm">{userData.age} yrs • {userData.gender} • {userData.height} cm</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2 uppercase">
              <Scale size={16} /> Current Weight (kg)
            </label>
            <input 
              type="number" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2 uppercase">
              <Target size={16} /> Primary Goal
            </label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
              value={goal}
              onChange={e => setGoal(e.target.value as GoalType)}
            >
              <option>Lean Bulk</option>
              <option>Dirty Bulk</option>
              <option>Lean Cut</option>
              <option>Fat Loss</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2 uppercase">
              <Utensils size={16} /> Food Preference
            </label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
              value={foodPref}
              onChange={e => setFoodPref(e.target.value as UserData['foodPreference'])}
            >
              <option>Veg</option>
              <option>Vegan</option>
              <option>Egg</option>
              <option>Non-Veg</option>
            </select>
          </div>
        </div>

          <div className="pt-6 border-t border-zinc-800">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
              <Key size={16} className="text-[#00E5FF]" /> AI Configuration
            </h3>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase">
              Gemini API Key
            </label>
            <input 
              type="password" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] mb-4 text-sm font-mono"
              value={apiInput}
              onChange={e => setApiInput(e.target.value)}
              placeholder="AI_xxxxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-zinc-500 text-xs mb-6">
              Your API key is stored securely in your browser's local storage and is never sent to our servers. Leave blank to use the offline algorithm.
            </p>
          </div>

        <div className="pt-6 border-t border-zinc-800">
          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
