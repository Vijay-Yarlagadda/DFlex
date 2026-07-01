import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Droplet, User, Activity } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-50 pb-20 md:pb-0 md:flex">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 min-h-screen p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-[#CCFF00] rounded-sm skew-x-[-10deg] flex items-center justify-center">
            <span className="text-black font-black text-xl skew-x-[10deg]">D</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white">DFlex</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
          <NavItem to="/diet" icon={<Utensils size={20} />} label="Diet Plan" />
          <NavItem to="/progress" icon={<Activity size={20} />} label="Progress" />
          <NavItem to="/water" icon={<Droplet size={20} />} label="Water" />
          <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
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
