import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { WaveBackground } from '../components/layout/WaveBackground';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { updateUserData } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg'
  });

  useEffect(() => {
    if (user && user.firstName && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.fullName || user.firstName || '' }));
    }
  }, [user]);

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.height || !formData.weight) {
      alert("Please fill out all details to continue.");
      return;
    }

    updateUserData({
      name: formData.name,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      dob: formData.dob,
      height: parseFloat(formData.height),
      heightUnit: formData.heightUnit as 'cm' | 'ft',
      weight: parseFloat(formData.weight),
      weightUnit: formData.weightUnit as 'kg' | 'lbs',
    });

    navigate('/dashboard');
  };

  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <WaveBackground />
      <div className="w-full max-w-xl bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF3366]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-center">Welcome to DFlex</h1>
          <p className="text-zinc-400 text-base mb-8 font-medium text-center">Let's set up your basic athlete profile.</p>

          <form onSubmit={handleFinish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Full Name">
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => update('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                  required
                />
              </InputGroup>

              <InputGroup label="Date of Birth">
                <input 
                  type="date" 
                  style={{ colorScheme: 'dark' }}
                  value={formData.dob} 
                  onChange={e => update('dob', e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                  required
                />
              </InputGroup>
            </div>

            <InputGroup label="Biological Sex">
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${formData.gender === g ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                    <input type="radio" name="gender" className="hidden" checked={formData.gender === g} onChange={() => update('gender', g)} />
                    <span className="font-bold">{g}</span>
                  </label>
                ))}
              </div>
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Height">
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.height} 
                    onChange={e => update('height', e.target.value)}
                    className="flex-1 min-w-0 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                    placeholder="e.g. 175"
                    required
                  />
                  <select 
                    value={formData.heightUnit} 
                    onChange={e => update('heightUnit', e.target.value)}
                    className="w-20 bg-zinc-900/80 border border-zinc-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="cm">cm</option>
                    <option value="ft">ft/in</option>
                  </select>
                </div>
              </InputGroup>

              <InputGroup label="Current Weight">
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.weight} 
                    onChange={e => update('weight', e.target.value)}
                    className="flex-1 min-w-0 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                    placeholder="e.g. 70"
                    required
                  />
                  <select 
                    value={formData.weightUnit} 
                    onChange={e => update('weightUnit', e.target.value)}
                    className="w-20 bg-zinc-900/80 border border-zinc-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </InputGroup>
            </div>

            <Button type="submit" size="lg" className="w-full mt-6 bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              Enter Dashboard <ArrowRight className="ml-2" size={20} />
            </Button>
            
          </form>
        </div>
      </div>
    </div>
  );
};
