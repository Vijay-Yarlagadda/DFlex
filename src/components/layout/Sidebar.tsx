import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Apple, LineChart, MessageSquare, Settings, User } from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Diet Plan', path: '/plan', icon: Apple },
  { name: 'Progress', path: '/progress', icon: LineChart },
  { name: 'AI Coach', path: '/coach', icon: MessageSquare },
];

const bottomItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  const renderLink = (item: any) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20'
            : 'text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <item.icon size={20} className={isActive ? 'text-white' : ''} />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-[var(--color-primary)] p-2 rounded-sm text-black group-hover:scale-105 transition-transform skew-btn">
            <div className="skew-btn-content"><Activity size={24} /></div>
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic">DFlex</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-4">Menu</p>
        {navItems.map(renderLink)}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        {bottomItems.map(renderLink)}
      </div>
    </aside>
  );
};
