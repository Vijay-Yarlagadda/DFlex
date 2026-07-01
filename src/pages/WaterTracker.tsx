import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Button } from '../components/ui/Button';
import { Plus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const WaterTracker = () => {
  const { userData, metrics, waterIntake, addWater, resetWater } = useAppStore();

  if (!userData || !metrics) {
    return <Navigate to="/assessment" />;
  }

  const goal = metrics.waterGoal;
  const progress = (waterIntake / goal) * 100;
  const remaining = Math.max(0, goal - waterIntake);

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          Hydration
        </h1>
        <p className="text-zinc-400">Track your daily water intake.</p>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="relative mb-12"
      >
        <ProgressRing progress={progress} size={280} strokeWidth={16} color="#00E5FF">
          <div className="text-center">
            <motion.div 
              key={waterIntake}
              initial={{ scale: 1.2, color: "#fff" }}
              animate={{ scale: 1, color: "#00E5FF" }}
              className="text-5xl font-black mb-1"
            >
              {waterIntake}
              <span className="text-xl text-zinc-500 font-bold tracking-widest uppercase ml-1">ml</span>
            </motion.div>
            <div className="text-zinc-400 font-bold uppercase tracking-wider text-xs">
              of {goal} ml
            </div>
          </div>
        </ProgressRing>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Button 
          variant="outline" 
          onClick={() => addWater(250)}
          className="border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10"
        >
          <Plus size={18} className="mr-2" />
          Glass (250ml)
        </Button>
        <Button 
          onClick={() => addWater(500)}
          className="bg-[#00E5FF] hover:bg-[#00b8cc] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
        >
          <Plus size={18} className="mr-2" />
          Bottle (500ml)
        </Button>
      </div>

      <div className="mt-12 flex items-center justify-between w-full border-t border-zinc-900 pt-6">
        <div className="text-zinc-500 font-bold text-sm">
          Remaining: <span className="text-white">{remaining} ml</span>
        </div>
        <button 
          onClick={resetWater}
          className="text-zinc-600 hover:text-white flex items-center gap-1 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};
