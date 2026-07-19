import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Dumbbell } from 'lucide-react';
import { WaveBackground } from '../components/layout/WaveBackground';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { login, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.success) {
        toast.success('Logged in successfully!');
        login(response.data.data.token, response.data.data.user);
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        <h2 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tight">Welcome Back</h2>
        <p className="text-zinc-400 text-center mb-8">Sign in to your DFlex account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-950 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  if (credentialResponse.credential) {
                    await loginWithGoogle(credentialResponse.credential);
                    toast.success("Logged in with Google successfully!");
                    navigate('/dashboard');
                  }
                } catch (err: any) {
                  toast.error(err.response?.data?.message || 'Google login failed');
                }
              }}
              onError={() => {
                toast.error('Google login failed');
              }}
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
              size="large"
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/sign-up" className="font-bold text-[#CCFF00] hover:text-[#B3E600]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
