import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore, type GoalType } from '../lib/store';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Target, Scale, LogOut, Settings2 } from 'lucide-react';

export const Profile = () => {
  const { userData, updateUserData, clearData } = useAppStore();
  const navigate = useNavigate();
  
  const [weight, setWeight] = useState(userData?.weight || 0);
  const [goal, setGoal] = useState<GoalType>(userData?.goal || 'Maintenance');

  if (!userData) {
    return <Navigate to="/assessment" />;
  }
  const handleSave = () => {
    updateUserData({
      weight,
      goal,
    });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    clearData();
    navigate('/');
  };

  const retest = () => {
    navigate('/assessment');
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
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{userData.name}</h2>
            <p className="text-zinc-400 text-sm">{userData.gender} • {userData.height}{userData.heightUnit}</p>
          </div>
          <Button variant="outline" size="sm" onClick={retest}>
            <Settings2 size={16} className="mr-2" /> Retake Assessment
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2 uppercase">
              <Scale size={16} /> Current Weight ({userData.weightUnit})
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
              <option>Body Recomposition</option>
            </select>
          </div>
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
