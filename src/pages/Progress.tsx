import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Flame, Droplet } from 'lucide-react';

export const Progress = () => {
  const { userData, dailyLogs, metrics } = useAppStore();

  if (!userData || !metrics) {
    return <Navigate to="/assessment" />;
  }

  // Generate last 7 days for the chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const shortDate = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const log = dailyLogs[dateStr] || { weight: userData.weight, water: 0, mealsEaten: [] };
    
    return {
      name: shortDate,
      weight: log.weight || userData.weight,
      water: log.water / 1000, // convert to L
      mealsCount: log.mealsEaten.length
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2 flex items-center gap-3">
          <Activity className="text-[#CCFF00]" size={32} /> Performance Log
        </h1>
        <p className="text-zinc-400">Track your execution and body metrics over time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weight Tracker Chart */}
        <Card className="p-6 bg-zinc-950/50">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#FF3366]" /> Weight Trend
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (kg)"
                  stroke="#FF3366" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FF3366", strokeWidth: 2, stroke: "#000" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Adherence Chart */}
        <Card className="p-6 bg-zinc-950/50">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Flame size={16} className="text-[#CCFF00]" /> Diet Adherence
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272A', opacity: 0.4 }} />
                <Bar 
                  dataKey="mealsCount" 
                  name="Meals Eaten"
                  fill="#CCFF00" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Water Chart */}
        <Card className="p-6 bg-zinc-950/50 lg:col-span-2">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Droplet size={16} className="text-[#00E5FF]" /> Hydration History
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="stepAfter" 
                  dataKey="water" 
                  name="Water (L)"
                  stroke="#00E5FF" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#00E5FF", strokeWidth: 2, stroke: "#000" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
