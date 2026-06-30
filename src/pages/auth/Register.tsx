import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const Register = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
        <p className="text-muted text-sm">Start your fitness journey today.</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input type="text" placeholder="Alex" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="alex@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="••••••••" />
        </div>
        
        <Link to="/dashboard">
          <Button className="w-full mt-4">Create Account</Button>
        </Link>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
