import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

export const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Training" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="relative z-20 max-w-lg p-12 text-center">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">
            <span className="text-[var(--color-primary)]">Forging</span> Greatness
          </h2>
          <p className="text-xl text-zinc-300 font-medium">
            Join the elite. Get AI-powered nutrition protocols designed for serious athletes.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-20">
        <div className="p-6 flex justify-between items-center border-b border-border/50 lg:border-none">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>

          <Link to="/" className="flex items-center gap-2 group lg:hidden">
            <div className="bg-[var(--color-primary)] p-1.5 rounded-sm text-black skew-btn">
              <div className="skew-btn-content"><Activity size={20} /></div>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">DFlex</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
