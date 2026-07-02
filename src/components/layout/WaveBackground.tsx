import React from 'react';
import { motion } from 'framer-motion';

export const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#09090B] pointer-events-none flex items-center justify-center -z-10">
      {/* Background glow to mimic Clerk's dark depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#CCFF00]/5 blur-[120px] rounded-full" />
      
      <svg 
        className="absolute w-full min-w-[1440px] h-full opacity-70" 
        viewBox="0 0 1440 800" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#CCFF00" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Base dim line 1 */}
        <path 
          d="M 0,300 L 400,300 C 550,300 600,500 720,500 C 840,500 890,300 1040,300 L 1440,300" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="1" 
        />
        
        {/* Animated glowing beam 1 */}
        <motion.path 
          d="M 0,300 L 400,300 C 550,300 600,500 720,500 C 840,500 890,300 1040,300 L 1440,300" 
          stroke="url(#line-gradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 0.3, pathOffset: [1, -0.3] }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Dim base line 2 */}
        <path 
          d="M 0,360 L 350,360 C 500,360 550,560 720,560 C 890,560 940,360 1090,360 L 1440,360" 
          stroke="rgba(255,255,255,0.03)" 
          strokeWidth="1" 
        />

        {/* Animated glowing beam 2 */}
        <motion.path 
          d="M 0,360 L 350,360 C 500,360 550,560 720,560 C 890,560 940,360 1090,360 L 1440,360" 
          stroke="url(#line-gradient)" 
          strokeWidth="1.5" 
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 0.2, pathOffset: [0, 1.2] }}
          transition={{
            duration: 12,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Dim base line 3 (Subtle offset) */}
        <path 
          d="M 0,420 L 450,420 C 600,420 650,620 720,620 C 790,620 840,420 1040,420 L 1440,420" 
          stroke="rgba(255,255,255,0.02)" 
          strokeWidth="1" 
        />

        {/* Animated glowing beam 3 */}
        <motion.path 
          d="M 0,420 L 450,420 C 600,420 650,620 720,620 C 790,620 840,420 1040,420 L 1440,420" 
          stroke="url(#line-gradient)" 
          strokeWidth="1" 
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 0.5 }}
          animate={{ pathLength: 0.15, pathOffset: [0.5, -0.5] }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </svg>
      
      {/* Noise overlay for that premium texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};
