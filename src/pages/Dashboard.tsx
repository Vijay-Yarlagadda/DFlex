import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Flame, Droplets, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { name: 'Mon', calories: 2100 },
  { name: 'Tue', calories: 2250 },
  { name: 'Wed', calories: 2150 },
  { name: 'Thu', calories: 2300 },
  { name: 'Fri', calories: 2400 },
  { name: 'Sat', calories: 2000 },
  { name: 'Sun', calories: 2100 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, Alex! 👋</h1>
          <p className="text-muted">Here's your progress for today.</p>
        </div>
        <Button>Log Meal</Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Calories', value: '2,150', target: '2,400 kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Protein', value: '140g', target: '160g', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Carbs', value: '210g', target: '250g', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Water', value: '2.5L', target: '3.5L', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className="text-xs text-muted">/ {stat.target}</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-current ${stat.color.replace('text-', 'bg-')}`} 
                  style={{ width: '75%' }} 
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Calorie Intake (This Week)</h3>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="calories" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Next Meal */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Up Next</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-background">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Lunch</span>
                <span className="text-xs text-muted">1:00 PM</span>
              </div>
              <h4 className="font-medium mb-1">Grilled Chicken Salad</h4>
              <p className="text-sm text-muted mb-4">Mixed greens, 150g chicken breast, olive oil dressing.</p>
              <div className="flex gap-4 text-xs font-medium text-muted">
                <span>🔥 450 kcal</span>
                <span>🍗 45g P</span>
                <span>🍞 15g C</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Full Diet Plan</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
