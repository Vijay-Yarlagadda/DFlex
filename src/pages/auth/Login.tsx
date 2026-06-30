import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const Login = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted text-sm">Enter your details to access your diet plan.</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="alex@example.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link to="#" className="text-xs text-[var(--color-primary)] hover:underline">Forgot password?</Link>
          </div>
          <Input type="password" placeholder="••••••••" />
        </div>
        
        <Link to="/dashboard">
          <Button className="w-full mt-4">Sign In</Button>
        </Link>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
