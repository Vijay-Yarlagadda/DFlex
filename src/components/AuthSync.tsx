import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useAppStore } from '../lib/store';
import { WaveBackground } from './layout/WaveBackground';

export const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { userData, updateUserData, setMetrics, setDietPlan } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncProfile = async () => {
      try {
        const token = await getToken();
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            updateUserData(data.user);
          }
          if (data.diet) {
            setDietPlan(data.diet);
          }
          if (data.metrics) {
            setMetrics(data.metrics);
          }
        }
      } catch (e) {
        console.error("Failed to sync profile from backend", e);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    if (isLoaded && isSignedIn) {
      if (!userData) {
        syncProfile();
      } else {
        setIsSyncing(false);
      }
    } else if (isLoaded && !isSignedIn) {
      setIsSyncing(false);
    }

    return () => { isMounted = false };
  }, [isLoaded, isSignedIn, userData, getToken, updateUserData, setDietPlan, setMetrics]);

  if (isSyncing || !isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        <WaveBackground />
        <div className="z-10 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-t-2 border-r-2 border-[#CCFF00] rounded-full animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 border-b-2 border-l-2 border-[#00E5FF] rounded-full opacity-70 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
          </div>
          <p className="text-zinc-400 font-bold tracking-widest uppercase text-sm">Syncing Profile...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};
