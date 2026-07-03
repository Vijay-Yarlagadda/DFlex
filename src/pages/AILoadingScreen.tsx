import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { useAuth } from '@clerk/clerk-react';

const loadingSteps = [
  "Calculating BMI...",
  "Calculating BMR...",
  "Calculating TDEE...",
  "Calculating Daily Calories...",
  "Analysing Food Preferences...",
  "Finding Suitable Foods...",
  "Building Personalized Meal Plan...",
  "Optimizing Nutrition...",
  "Preparing Your Diet Plan..."
];

export const AILoadingScreen = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { userData, setMetrics, setDietPlan } = useAppStore();

  useEffect(() => {
    if (!userData) return;

    let isMounted = true;
    
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    const fetchDiet = async () => {
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/generate-diet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
        
        if (!res.ok) {
          throw new Error('Failed to generate diet');
        }
        
        const json = await res.json();
        
        if (isMounted) {
          setMetrics(json.metrics);
          setDietPlan(json.diet);
          navigate('/diet'); 
        }
      } catch (err) {
        console.error(err);
        if (isMounted) navigate('/diet'); // Or an error screen
      }
    };

    fetchDiet();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userData, navigate, setDietPlan, getToken]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-[#00E5FF]/20 blur-[120px] rounded-full"
      />

      <div className="z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-[#CCFF00] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-b-2 border-l-2 border-[#00E5FF] rounded-full opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">AI</span>
          </div>
        </div>

        <div className="h-8 flex items-center justify-center overflow-hidden w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-zinc-300 font-bold tracking-widest uppercase text-sm text-center px-4 flex items-center gap-2"
            >
              <span className="text-[#CCFF00]">✓</span> {loadingSteps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
