import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { generateDietWithAI } from '../lib/ai';

const loadingSteps = [
  "Analyzing metabolism profile...",
  "Calculating optimal macros...",
  "Querying AI for personalized recipes...",
  "Finalizing your DFlex protocol..."
];

export const AILoadingScreen = () => {
  const navigate = useNavigate();
  const { apiKey, userData, metrics, calculateMetrics, setDietPlan } = useAppStore();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Generate the metrics as soon as we mount
    calculateMetrics();
  }, [calculateMetrics]);

  useEffect(() => {
    if (!userData || !metrics) return;

    let isMounted = true;
    
    // Cycle text
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    // Call AI
    const fetchDiet = async () => {
      const plan = await generateDietWithAI(apiKey, userData, metrics);
      if (isMounted) {
        setDietPlan(plan);
        navigate('/diet'); // Go directly to diet page so they can see the generated AI plan
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
      {/* Background FX */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-[#00E5FF]/20 blur-[100px] rounded-full"
      />

      <div className="z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-32 h-32 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-4 border-[#CCFF00] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-b-4 border-[#00E5FF] rounded-full opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black skew-x-[10deg]">AI</span>
          </div>
        </div>

        {/* Text */}
        <div className="h-8 flex items-center justify-center">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[#CCFF00] font-bold tracking-widest uppercase text-sm text-center px-4"
          >
            {loadingSteps[stepIndex]}
          </motion.p>
        </div>
      </div>
    </div>
  );
};
