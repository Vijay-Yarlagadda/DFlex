import { NavLink } from 'react-router-dom';
import { Home, Utensils, Droplet, User, Activity } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuthContext();
  return (
    <div className="min-h-screen bg-black text-zinc-50 pb-20 md:pb-0 md:flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#CCFF00] rounded-sm skew-x-[-10deg] flex items-center justify-center">
            <span className="text-black font-black text-sm skew-x-[10deg]">D</span>
          </div>
          <span className="text-lg font-black tracking-tighter uppercase text-white">DFlex</span>
        </div>
        <button onClick={logout} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 min-h-screen">
        <div className="flex items-center gap-2 p-6">
          <div className="w-8 h-8 bg-[#CCFF00] rounded-sm skew-x-[-10deg] flex items-center justify-center">
            <span className="text-black font-black text-xl skew-x-[10deg]">D</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white">DFlex</span>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 mt-4">
          <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
          <NavItem to="/diet" icon={<Utensils size={20} />} label="Diet Plan" />
          <NavItem to="/progress" icon={<Activity size={20} />} label="Progress" />
          <NavItem to="/water" icon={<Droplet size={20} />} label="Water" />
          <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-900">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800 transition-colors text-zinc-300 font-bold text-sm"
          >
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white">
              {user?.name?.charAt(0) || <User size={16} />}
            </div>
            <span>{user?.name || 'User'}</span>
            <LogOut size={16} className="ml-auto text-zinc-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav (hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-900 flex justify-around items-center p-3 z-50 pb-safe">
        <MobileNavItem to="/dashboard" icon={<Home size={24} />} />
        <MobileNavItem to="/diet" icon={<Utensils size={24} />} />
        <MobileNavItem to="/progress" icon={<Activity size={24} />} />
        <MobileNavItem to="/water" icon={<Droplet size={24} />} />
        <MobileNavItem to="/profile" icon={<User size={24} />} />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-bold ${
        isActive 
          ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon }: { to: string, icon: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-2 rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-[#CCFF00]/20 text-[#CCFF00]' 
          : 'text-zinc-500 hover:text-zinc-300'
      }`
    }
  >
    {icon}
  </NavLink>
);
