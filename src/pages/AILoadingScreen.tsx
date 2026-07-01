import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { generateDietWithAI } from '../lib/ai';

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
  const navigate = useNavigate();
  const { apiKey, userData, metrics, calculateMetrics, setDietPlan } = useAppStore();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  useEffect(() => {
    if (!userData || !metrics) return;

    let isMounted = true;
    
    // Cycle text every 1.5 seconds to ensure they see most of the steps
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    const fetchDiet = async () => {
      const plan = await generateDietWithAI(apiKey, userData, metrics);
      if (isMounted) {
        setDietPlan(plan);
        navigate('/diet'); 
      }
    };

    fetchDiet();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiKey, userData, metrics, navigate, setDietPlan]);

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
