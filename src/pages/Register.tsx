import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Dumbbell } from 'lucide-react';
import { WaveBackground } from '../components/layout/WaveBackground';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.success) {
        toast.success('Account created successfully! Please log in.');
        navigate('/sign-in');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <WaveBackground />
      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <Dumbbell className="h-10 w-10 text-primary-500" style={{ color: '#CCFF00' }} />
        </div>
        <h2 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tight">Create Account</h2>
        <p className="text-zinc-400 text-center mb-8">Join DFlex and transform your life</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
            <input 
              {...register('name')}
              type="text"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-zinc-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-[#CCFF00] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
