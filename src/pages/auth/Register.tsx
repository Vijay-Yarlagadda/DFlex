import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'framer-motion';

export const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Join The Elite</h1>
        <p className="text-muted text-sm font-medium">Create your profile to generate your first AI diet plan.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
          <Input type="text" placeholder="John Doe" className="h-14 bg-black/20" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
          <Input type="email" placeholder="athlete@example.com" className="h-14 bg-black/20" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted">Password</label>
          <Input type="password" placeholder="••••••••" className="h-14 bg-black/20" required />
        </div>
        
        <Button size="lg" className="w-full mt-4" type="submit">Create Account</Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-white border-b border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
};
