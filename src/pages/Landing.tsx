import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Apple, Zap, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/layout/Navbar';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-primary)] blur-[200px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[var(--color-secondary)] blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest inline-block mb-6 border border-[var(--color-primary)]/20 skew-btn">
              <span className="skew-btn-content">No Excuses. Just Results.</span>
            </span>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-none">
              FUEL YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                INNER BEAST.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted max-w-2xl mx-auto mb-10 font-medium">
              Elite AI-generated meal plans designed to crush your macros, maximize muscle gain, and obliterate fat. Engineered for peak performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/assessment">
                <Button size="lg" className="w-full sm:w-auto">
                  START FORGING <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                SEE THE PROGRAM
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card/80 border-t border-border relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-50" />
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter">ENGINEERED FOR ATHLETES</h2>
            <p className="text-muted max-w-2xl mx-auto font-medium">Precision nutrition meets relentless execution. Here is how we build champions.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Apple, title: "Precision Macros", desc: "No guesswork. Exact calories, protein, and carbs tailored to your aggressive goals." },
              { icon: Zap, title: "Dynamic Swaps", desc: "Craving something else? Instantly swap meals while hitting the exact same macros." },
              { icon: Activity, title: "Ironclad Tracking", desc: "Visualize your shred. Chart your weight, macros, and performance." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 glass border-l-4 border-l-[var(--color-primary)] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-bl-full transition-transform group-hover:scale-150" />
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6 skew-btn">
                  <div className="skew-btn-content"><feature.icon size={28} /></div>
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto max-w-7xl px-6 text-center text-muted font-bold tracking-widest text-xs uppercase">
          <p>© 2026 DFlex. NO EXCUSES.</p>
        </div>
      </footer>
    </div>
  );
};
