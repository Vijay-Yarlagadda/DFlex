import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { GlassCard } from '../ui/card';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)] rounded-full blur-[120px] opacity-20" />
      
      <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
        <Link to="/" className="flex items-center gap-2 group mb-8">
          <div className="bg-[var(--color-primary)] p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">DFlex</span>
        </Link>
        
        <GlassCard className="w-full max-w-md p-8">
          <Outlet />
        </GlassCard>
      </div>
    </div>
  );
};
