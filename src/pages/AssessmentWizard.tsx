import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type UserData } from '../lib/store';
import { Button } from '../components/ui/Button';

const steps = [
  { id: 'personal', title: 'Personal Details' },
  { id: 'goal', title: 'Your Goal' },
  { id: 'lifestyle', title: 'Lifestyle' },
  { id: 'diet', title: 'Diet Preferences' },
  { id: 'extras', title: 'Fine Tuning' },
];

export const AssessmentWizard = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    age: 25,
    gender: 'Male',
    height: 175,
    weight: 70,
    goal: 'Maintenance',
    activityLevel: 'Moderate',
    workoutDays: 3,
    sleepHours: 7,
    foodPreference: 'Non-Veg',
    allergies: [],
    budget: '₹300',
    mealsPerDay: 4,
    foodsToAvoid: '',
    favoriteFoods: ''
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      updateUserData(formData as UserData);
      navigate('/generating');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None') {
      handleChange('allergies', ['None']);
      return;
    }
    const current = formData.allergies || [];
    const updated = current.includes(allergy)
      ? current.filter(a => a !== allergy)
      : [...current.filter(a => a !== 'None'), allergy];
    handleChange('allergies', updated);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-12 pb-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFF00]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF3366]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto z-10 flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span className="text-[#CCFF00]">{steps[currentStep].title}</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black uppercase mb-8">Tell us about yourself</h2>
                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Age</label>
                      <input 
                        type="number" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.age}
                        onChange={e => handleChange('age', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Gender</label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.gender}
                        onChange={e => handleChange('gender', e.target.value)}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Height (cm)</label>
                      <input 
                        type="number" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.height}
                        onChange={e => handleChange('height', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Weight (kg)</label>
                      <input 
                        type="number" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.weight}
                        onChange={e => handleChange('weight', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black uppercase mb-8">What's your primary goal?</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {['Lean Bulk', 'Dirty Bulk', 'Lean Cut', 'Fat Loss', 'Maintenance'].map((goal) => (
                      <button
                        key={goal}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.goal === goal 
                            ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' 
                            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                        }`}
                        onClick={() => handleChange('goal', goal)}
                      >
                        <div className="font-bold uppercase tracking-wide">{goal}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black uppercase mb-8">How active are you?</h2>
                  
                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Daily Activity</label>
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] mb-6"
                      value={formData.activityLevel}
                      onChange={e => handleChange('activityLevel', e.target.value)}
                    >
                      <option>Sedentary</option>
                      <option>Light</option>
                      <option>Moderate</option>
                      <option>Active</option>
                      <option>Very Active</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Workout Days/Week</label>
                      <input 
                        type="number" 
                        min="0" max="7"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.workoutDays}
                        onChange={e => handleChange('workoutDays', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Sleep (Hours)</label>
                      <input 
                        type="number" 
                        min="0" max="24"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.sleepHours}
                        onChange={e => handleChange('sleepHours', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 h-full overflow-y-auto pb-20">
                  <h2 className="text-3xl font-black uppercase mb-4">Dietary Preferences</h2>
                  
                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-3 uppercase">Food Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Veg', 'Vegan', 'Egg', 'Non-Veg'].map((type) => (
                        <button
                          key={type}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.foodPreference === type 
                              ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' 
                              : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                          }`}
                          onClick={() => handleChange('foodPreference', type)}
                        >
                          <div className="font-bold uppercase text-sm">{type}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-3 uppercase mt-6">Allergies</label>
                    <div className="flex flex-wrap gap-2">
                      {['Milk', 'Nuts', 'Soy', 'Gluten', 'Eggs', 'Seafood', 'None'].map((allergy) => (
                        <button
                          key={allergy}
                          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                            formData.allergies?.includes(allergy)
                              ? 'border-[#FF3366] bg-[#FF3366]/20 text-[#FF3366]' 
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                          }`}
                          onClick={() => toggleAllergy(allergy)}
                        >
                          {allergy}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black uppercase mb-8">Fine Tuning</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Budget/Day</label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.budget}
                        onChange={e => handleChange('budget', e.target.value)}
                      >
                        <option>₹100</option>
                        <option>₹200</option>
                        <option>₹300</option>
                        <option>₹500+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Meals/Day</label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                        value={formData.mealsPerDay}
                        onChange={e => handleChange('mealsPerDay', parseInt(e.target.value))}
                      >
                        {[3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Meals</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Foods to Avoid (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                      value={formData.foodsToAvoid}
                      onChange={e => handleChange('foodsToAvoid', e.target.value)}
                      placeholder="e.g. Broccoli, Mushrooms"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase">Favorite Foods (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                      value={formData.favoriteFoods}
                      onChange={e => handleChange('favoriteFoods', e.target.value)}
                      placeholder="e.g. Chicken, Rice, Paneer"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-4 border-t border-zinc-900 z-20 bg-black">
          <Button variant="ghost" className="flex-1" onClick={handleBack}>
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button className="flex-1" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Generate Plan' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
