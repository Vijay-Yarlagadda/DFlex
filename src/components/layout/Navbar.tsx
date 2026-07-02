import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up');
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/plan') || location.pathname.startsWith('/progress') || location.pathname.startsWith('/coach') || location.pathname.startsWith('/profile');

  if (isAuthPage || isDashboardPage) return null; // We use separate layouts for these

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[var(--color-primary)] p-2 rounded-sm text-black group-hover:scale-105 transition-transform skew-btn">
            <div className="skew-btn-content"><Activity size={24} /></div>
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic">DFlex</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 font-medium text-muted hover:text-foreground transition-colors">
            <a href="#features" className="hover:text-[var(--color-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-[var(--color-primary)] transition-colors">Testimonials</a>
          </div>
          
          <div className="flex items-center gap-4 border-l border-border pl-6">
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 shadow-xl">
          <a href="#features" className="text-lg font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-lg font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
          <div className="h-px bg-border my-2" />
          <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-center">Sign In</Button>
          </Link>
          <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full justify-center">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
