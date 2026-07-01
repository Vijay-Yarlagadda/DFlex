import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Activity, Flame, Target, Droplet, Dumbbell } from 'lucide-react';

export const Dashboard = () => {
  const { userData, metrics } = useAppStore();

  if (!userData || !metrics) {
    return <Navigate to="/assessment" />;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          Overview
        </h1>
        <p className="text-zinc-400">Welcome back, {userData.name}. Here are your optimized metrics.</p>
      </header>

      {/* Primary Goal & Calories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-[#CCFF00]/20 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-[#CCFF00] mb-4">
            <Target size={24} />
            <span className="font-bold uppercase tracking-wider text-sm">Current Goal</span>
          </div>
          <div className="text-4xl font-black uppercase text-white mb-2">{userData.goal}</div>
          <div className="text-zinc-400 text-sm">Based on your activity level: {userData.activityLevel}</div>
        </Card>

        <Card className="p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF3366]/10 blur-[50px] rounded-full" />
          <div className="flex items-center gap-3 text-[#FF3366] mb-4">
            <Flame size={24} />
            <span className="font-bold uppercase tracking-wider text-sm">Daily Target</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{metrics.dailyCalories}</span>
            <span className="text-zinc-500 font-bold">kcal</span>
          </div>
        </Card>
      </div>

      {/* Macros */}
      <h2 className="text-xl font-black uppercase tracking-tight text-white mt-8 mb-4">Macro Distribution</h2>
      <div className="grid grid-cols-3 gap-4">
        <MacroCard title="Protein" value={metrics.protein} unit="g" color="#CCFF00" />
        <MacroCard title="Carbs" value={metrics.carbs} unit="g" color="#00E5FF" />
        <MacroCard title="Fat" value={metrics.fat} unit="g" color="#FF3366" />
      </div>

      {/* Secondary Metrics */}
      <h2 className="text-xl font-black uppercase tracking-tight text-white mt-8 mb-4">Body Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox label="BMI" value={metrics.bmi} />
        <MetricBox label="BMR" value={metrics.bmr} unit="kcal" />
        <MetricBox label="TDEE" value={metrics.tdee} unit="kcal" />
        <MetricBox label="Water" value={metrics.waterGoal / 1000} unit="L" />
      </div>
    </div>
  );
};

const MacroCard = ({ title, value, unit, color }: { title: string, value: number, unit: string, color: string }) => (
  <Card className="p-4 flex flex-col items-center justify-center text-center">
    <div className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-2">{title}</div>
    <div className="flex items-baseline gap-1" style={{ color }}>
      <span className="text-2xl md:text-3xl font-black">{value}</span>
      <span className="text-xs font-bold opacity-70">{unit}</span>
    </div>
  </Card>
);

const MetricBox = ({ label, value, unit = "" }: { label: string, value: string | number, unit?: string }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col">
    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
    <div className="text-white font-black text-xl flex items-baseline gap-1">
      {value} <span className="text-zinc-500 text-xs">{unit}</span>
    </div>
  </div>
);
