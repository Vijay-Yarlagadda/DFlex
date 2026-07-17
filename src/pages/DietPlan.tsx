import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Share, Download, RefreshCw, Info, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const mealPlan = [
  {
    type: 'Breakfast',
    time: '8:00 AM',
    calories: 450,
    macros: { protein: 30, carbs: 45, fat: 15 },
    items: [
      { name: 'Oatmeal with berries', amount: '1 bowl' },
      { name: 'Greek Yogurt', amount: '150g' },
      { name: 'Almonds', amount: '15g' }
    ]
  },
  {
    type: 'Lunch',
    time: '1:00 PM',
    calories: 550,
    macros: { protein: 45, carbs: 50, fat: 20 },
    items: [
      { name: 'Grilled Chicken Breast', amount: '150g' },
      { name: 'Quinoa', amount: '100g' },
      { name: 'Steamed Broccoli', amount: '1 cup' }
    ]
  },
  {
    type: 'Dinner',
    time: '7:30 PM',
    calories: 600,
    macros: { protein: 50, carbs: 40, fat: 25 },
    items: [
      { name: 'Baked Salmon', amount: '150g' },
      { name: 'Sweet Potato', amount: '1 medium' },
      { name: 'Asparagus', amount: '10 spears' }
    ]
  }
];

export const DietPlan = () => {
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your AI Diet Plan</h1>
          <p className="text-muted flex items-center gap-2">
            <Info size={16} /> Based on your goal: <strong>Lose Weight (0.5kg/week)</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share size={16} /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} /> PDF
          </Button>
          <Button size="sm" className="gap-2">
            <RefreshCw size={16} /> Regenerate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card glass className="p-4 text-center">
          <p className="text-sm text-muted mb-1">Target Calories</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">2,100</p>
        </Card>
        <Card glass className="p-4 text-center">
          <p className="text-sm text-muted mb-1">Protein</p>
          <p className="text-2xl font-bold text-blue-500">160g</p>
        </Card>
        <Card glass className="p-4 text-center">
          <p className="text-sm text-muted mb-1">Cost Estimate</p>
          <p className="text-2xl font-bold text-emerald-500">$12/day</p>
        </Card>
      </div>

      <div className="space-y-6">
        {mealPlan.map((meal, index) => (
          <motion.div
            key={meal.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-border bg-card/50">
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils size={20} className="text-[var(--color-primary)]" />
                    <h3 className="text-xl font-bold">{meal.type}</h3>
                  </div>
                  <p className="text-sm font-medium text-muted mb-6">{meal.time}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Calories</span>
                      <span className="font-semibold">{meal.calories} kcal</span>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-medium pt-2">
                      <span className="text-blue-500">{meal.macros.protein}g P</span>
                      <span className="text-emerald-500">{meal.macros.carbs}g C</span>
                      <span className="text-red-500">{meal.macros.fat}g F</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:w-2/3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Foods</h4>
                  <ul className="space-y-3">
                    {meal.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted bg-background px-2 py-1 rounded-md">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-muted text-xs">
                      Swap Meal
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
