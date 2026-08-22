"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FlowerLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#0071e3">
      <circle cx="50" cy="22" r="16" opacity="0.9" />
      <circle cx="70" cy="30" r="16" opacity="0.9" />
      <circle cx="78" cy="50" r="16" opacity="0.9" />
      <circle cx="70" cy="70" r="16" opacity="0.9" />
      <circle cx="50" cy="78" r="16" opacity="0.9" />
      <circle cx="30" cy="70" r="16" opacity="0.9" />
      <circle cx="22" cy="50" r="16" opacity="0.9" />
      <circle cx="30" cy="30" r="16" opacity="0.9" />
    </g>
    <circle cx="50" cy="50" r="14" fill="#ffffff" />
    <circle cx="50" cy="50" r="8" fill="#0071e3" />
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password123');
  const [registerRole, setRegisterRole] = useState<'HR' | 'EMPLOYEE' | 'ADMIN'>('HR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'register') {
        setIsLogin(false);
      }
    }
  }, []);

  const performSignIn = async (signInEmail: string, signInPass: string) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in');
      } else {
        // Full page navigation ensures middleware & cookies sync cleanly
        window.location.href = data.user.role === 'ADMIN' ? '/admin' : '/employee';
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSignIn(email, password);
  };

  const handleQuickSelect = (selectedEmail: string, selectedPass: string) => {
    setEmail(selectedEmail);
    setPassword(selectedPass);
    performSignIn(selectedEmail, selectedPass);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] p-4 sm:p-8 font-sans">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#1d1d1f] hover:opacity-80 transition-opacity z-50">
        <FlowerLogo />
        <span className="font-semibold tracking-tight">Dayflow</span>
      </Link>

      <div className="relative w-full max-w-5xl h-[720px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden flex">
        
        {/* Register Container (Left) */}
        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${isLogin ? 'opacity-0 z-10 translate-x-10 pointer-events-none' : 'opacity-100 z-20 translate-x-0'}`}>
          <h2 className="text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">Create Workspace.</h2>
          <p className="text-[#86868b] mb-6 text-base">Sign up to modernize your HR operations.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">First Name</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">Last Name</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">Work Email</label>
              <input type="email" required className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm" placeholder="name@company.com" />
            </div>

            {/* Select Role Option: HR, Employee, or Admin */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">
                Select Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('HR')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    registerRole === 'HR'
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/5 hover:bg-gray-200'
                  }`}
                >
                  🏢 HR
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('EMPLOYEE')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    registerRole === 'EMPLOYEE'
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/5 hover:bg-gray-200'
                  }`}
                >
                  👤 Employee
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('ADMIN')}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    registerRole === 'ADMIN'
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/5 hover:bg-gray-200'
                  }`}
                >
                  🔑 Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm" placeholder="••••••••" />
            </div>

            <button 
              type="button" 
              onClick={() => {
                if (registerRole === 'EMPLOYEE') {
                  window.location.href = '/employee';
                } else {
                  window.location.href = `/onboarding?role=${registerRole}`;
                }
              }}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#0071e3] text-white font-semibold text-base hover:bg-[#0077ED] transition-colors shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
            >
              Create Account as {registerRole === 'HR' ? 'HR Manager' : registerRole === 'EMPLOYEE' ? 'Employee' : 'Admin'}
            </button>
          </div>
          
          <div className="mt-6 text-center md:hidden">
            <p className="text-[#86868b]">Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#0071e3] font-medium">Sign in</button></p>
          </div>
        </div>

        {/* Login Container (Right) */}
        <div className={`absolute top-0 right-0 h-full w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-0 z-10 -translate-x-10 pointer-events-none' : 'opacity-100 z-20 translate-x-0'}`}>
          <h2 className="text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">Welcome back.</h2>
          <p className="text-[#86868b] mb-6 text-lg">Enter your details to sign in to your account.</p>
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          <div className="mb-6 p-3 bg-[#f5f5f7] rounded-2xl border border-black/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] block mb-2">⚡ One-Tap Login:</span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => handleQuickSelect('admin@company.com', 'password123')}
                className="flex-1 py-2 px-2 bg-white text-xs font-bold text-[#1d1d1f] rounded-xl shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-all border border-black/5"
              >
                🔑 Admin
              </button>
              <button 
                type="button"
                onClick={() => handleQuickSelect('hr@company.com', 'password123')}
                className="flex-1 py-2 px-2 bg-white text-xs font-bold text-[#1d1d1f] rounded-xl shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-all border border-black/5"
              >
                🏢 HR Manager
              </button>
              <button 
                type="button"
                onClick={() => handleQuickSelect('employee@company.com', 'password123')}
                className="flex-1 py-2 px-2 bg-white text-xs font-bold text-[#1d1d1f] rounded-xl shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-all border border-black/5"
              >
                👤 Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">Email address</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm font-medium" 
                placeholder="name@company.com" 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b]">Password</label>
                 <Link href="#" className="text-xs font-semibold text-[#0071e3] hover:underline">Forgot password?</Link>
              </div>
              <input 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all text-sm font-medium" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full mt-2 py-3.5 rounded-xl bg-[#0071e3] text-white font-semibold text-base hover:bg-[#0077ED] transition-all shadow-[0_4px_12px_rgba(0,113,227,0.3)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dayflow'}
            </button>
          </form>
          
          <div className="mt-6 text-center md:hidden">
            <p className="text-[#86868b] text-sm">Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#0071e3] font-medium">Register</button></p>
          </div>
        </div>

        {/* Sliding Image Overlay */}
        <div className={`hidden md:block absolute top-0 w-1/2 h-full z-30 transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-[#0071e3] overflow-hidden">
             <motion.img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                alt="HR Professionals" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
                animate={{ scale: isLogin ? 1 : 1.1 }}
             />
             <div className="absolute inset-0 bg-black/30" />
             
             <div className={`absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center transition-all duration-700 ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
               <h3 className="text-4xl font-bold mb-4">Welcome back!</h3>
               <p className="text-lg text-white/80 mb-8">Access your personalized HR dashboard and workspace tools.</p>
               <button onClick={() => setIsLogin(true)} className="px-12 py-3 rounded-full border-2 border-white font-semibold hover:bg-white hover:text-[#0071e3] transition-colors">
                 Sign In
               </button>
             </div>
             
             <div className={`absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}`}>
               <h3 className="text-4xl font-bold mb-4">Modern HR Suite.</h3>
               <p className="text-lg text-white/80 mb-8">Join thousands of teams streamlining attendance, leaves, and payroll.</p>
               <button onClick={() => setIsLogin(false)} className="px-12 py-3 rounded-full border-2 border-white font-semibold hover:bg-white hover:text-[#0071e3] transition-colors">
                 Create Account
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
