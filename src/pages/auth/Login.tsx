import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'framer-motion';

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Welcome Back</h1>
        <p className="text-muted text-sm font-medium">Enter your credentials to access your protocol.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
          <Input type="email" placeholder="athlete@example.com" className="h-14 bg-black/20" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">Password</label>
            <Link to="#" className="text-xs text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
          </div>
          <Input type="password" placeholder="••••••••" className="h-14 bg-black/20" required />
        </div>
        
        <Button size="lg" className="w-full mt-4" type="submit">Access Protocol</Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted font-medium">
        New to DFlex?{' '}
        <Link to="/register" className="text-white border-b border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
          Initialize Account
        </Link>
      </div>
    </motion.div>
  );
};
