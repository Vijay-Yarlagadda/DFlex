import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CCFF00]/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center px-4 max-w-4xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-[#CCFF00] rounded-sm skew-x-[-10deg] flex items-center justify-center">
            <span className="text-black font-black text-4xl skew-x-[10deg]">D</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
          Redefine <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#00E5FF]">
            Your Physics
          </span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
          The ultimate AI-driven nutrition & training engine. Build your body with precision.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            className="text-lg md:text-xl px-12"
            onClick={() => navigate('/assessment')}
          >
            Start Your Nutrition Journey
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
    </div>
  );
};
