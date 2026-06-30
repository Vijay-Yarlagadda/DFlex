import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const goals = ['Cut (Lose Fat)', 'Maintain', 'Bulk (Gain Muscle)'];
const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extreme Athlete'];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step: generate plan and redirect
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="bg-[var(--color-primary)] p-1.5 rounded-sm text-black skew-btn">
            <div className="skew-btn-content"><Activity size={20} /></div>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">DFlex</span>
        </div>
        <div className="text-sm font-bold text-muted uppercase tracking-widest">
          Step {step} of 3
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-xl">
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mb-12">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleNext} className="space-y-8">
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Physical Metrics</h2>
                      <p className="text-muted font-medium">We need this to calculate your BMI and BMR accurately.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Age</label>
                        <Input type="number" placeholder="25" className="h-14 bg-card" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Gender</label>
                        <select className="flex h-14 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Height (cm)</label>
                        <Input type="number" placeholder="180" className="h-14 bg-card" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Weight (kg)</label>
                        <Input type="number" placeholder="80" className="h-14 bg-card" required />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Lifestyle & Goals</h2>
                      <p className="text-muted font-medium">Tell us about your activity levels and primary objective.</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Primary Goal</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {goals.map(g => (
                            <button key={g} type="button" className="p-4 rounded-lg border-2 border-border bg-card text-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-bold transition-all focus:border-[var(--color-primary)] focus:text-[var(--color-primary)] focus:bg-[var(--color-primary)]/10">
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Activity Level</label>
                        <select className="flex h-14 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all">
                          {activityLevels.map(lvl => <option key={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Diet Preferences</h2>
                      <p className="text-muted font-medium">Fine-tune the AI to your exact eating habits.</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Diet Type</label>
                        <select className="flex h-14 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all">
                          <option>Standard (No restrictions)</option>
                          <option>Vegetarian</option>
                          <option>Vegan</option>
                          <option>Keto</option>
                          <option>Paleo</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Allergies / Dislikes (Optional)</label>
                        <Input type="text" placeholder="e.g. Peanuts, Shellfish, Mushrooms" className="h-14 bg-card" />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">Meals per day</label>
                          <select className="flex h-14 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all">
                            <option>3 Meals</option>
                            <option>4 Meals</option>
                            <option>5 Meals</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">Daily Budget</label>
                          <select className="flex h-14 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all">
                            <option>Low ($10-$15)</option>
                            <option>Medium ($15-$25)</option>
                            <option>High ($25+)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-border/50">
                  {step > 1 ? (
                    <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                      <ArrowLeft size={18} className="mr-2" /> Back
                    </Button>
                  ) : (
                    <div /> // Spacer
                  )}
                  <Button type="submit" size="lg">
                    {step === 3 ? 'GENERATE PROTOCOL' : 'CONTINUE'} 
                    {step < 3 && <ArrowRight size={18} className="ml-2" />}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
