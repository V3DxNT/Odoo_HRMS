"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const FlowerLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C55 35 65 45 80 50C65 55 55 65 50 80C45 65 35 55 20 50C35 45 45 35 50 20Z" fill="currentColor" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'register') {
        setIsLogin(false);
      }
    }
  }, []);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in');
      } else {
        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/employee');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] p-4 sm:p-8">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#1d1d1f] hover:opacity-80 transition-opacity z-50">
        <FlowerLogo />
        <span className="font-semibold tracking-tight">Dayflow</span>
      </Link>

      <div className="relative w-full max-w-5xl h-[700px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden flex">
        
        {/* Register Container (Left) */}
        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${isLogin ? 'opacity-0 z-10 translate-x-10 pointer-events-none' : 'opacity-100 z-20 translate-x-0'}`}>
          <h2 className="text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">Create Workspace.</h2>
          <p className="text-[#86868b] mb-10 text-lg">Sign up to modernize your HR operations.</p>
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">First Name</label>
                <input type="text" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Last Name</label>
                <input type="text" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Work Email</label>
              <input type="email" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" placeholder="name@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Password</label>
              <input type="password" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" placeholder="••••••••" />
            </div>
            <button type="button" className="w-full mt-4 py-3.5 rounded-xl bg-[#0071e3] text-white font-medium text-lg hover:bg-[#0077ED] transition-colors shadow-[0_4px_12px_rgba(0,113,227,0.3)]">
              Create Account
            </button>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <p className="text-[#86868b]">Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#0071e3] font-medium">Sign in</button></p>
          </div>
        </div>

        {/* Login Container (Right) */}
        <div className={`absolute top-0 right-0 h-full w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-0 z-10 -translate-x-10 pointer-events-none' : 'opacity-100 z-20 translate-x-0'}`}>
          <h2 className="text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">Welcome back.</h2>
          <p className="text-[#86868b] mb-10 text-lg">Enter your details to sign in to your account.</p>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Quick Demo Selectors */}
          <div className="mb-6 p-3 bg-[#f5f5f7] rounded-xl border border-black/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] block mb-2">⚡ Quick Presentation Login:</span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
                  const passInput = document.querySelector<HTMLInputElement>('input[name="password"]');
                  if (emailInput && passInput) {
                    emailInput.value = 'admin@company.com';
                    passInput.value = 'password123';
                  }
                }}
                className="flex-1 py-1.5 px-2 bg-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-colors"
              >
                🔑 Admin
              </button>
              <button 
                type="button"
                onClick={() => {
                  const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
                  const passInput = document.querySelector<HTMLInputElement>('input[name="password"]');
                  if (emailInput && passInput) {
                    emailInput.value = 'hr@company.com';
                    passInput.value = 'password123';
                  }
                }}
                className="flex-1 py-1.5 px-2 bg-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-colors"
              >
                🏢 HR Manager
              </button>
              <button 
                type="button"
                onClick={() => {
                  const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
                  const passInput = document.querySelector<HTMLInputElement>('input[name="password"]');
                  if (emailInput && passInput) {
                    emailInput.value = 'employee@company.com';
                    passInput.value = 'password123';
                  }
                }}
                className="flex-1 py-1.5 px-2 bg-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-50 hover:text-[#0071e3] transition-colors"
              >
                👤 Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Email address</label>
              <input name="email" type="email" required defaultValue="admin@company.com" className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" placeholder="name@company.com" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                 <label className="block text-sm font-medium text-[#1d1d1f]">Password</label>
                 <Link href="#" className="text-xs font-medium text-[#0071e3] hover:underline">Forgot password?</Link>
              </div>
              <input name="password" type="password" required defaultValue="password123" className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all" placeholder="••••••••" />
            </div>
            <button disabled={loading} type="submit" className="w-full mt-4 py-3.5 rounded-xl bg-[#0071e3] text-white font-medium text-lg hover:bg-[#0077ED] transition-colors shadow-[0_4px_12px_rgba(0,113,227,0.3)] disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center md:hidden">
            <p className="text-[#86868b]">Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#0071e3] font-medium">Register</button></p>
          </div>
        </div>

        {/* Sliding Image Overlay */}
        <div className={`hidden md:block absolute top-0 w-1/2 h-full z-30 transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-[#0071e3] overflow-hidden">
             {/* The Image */}
             <motion.img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                alt="HR Professionals" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
                animate={{ scale: isLogin ? 1 : 1.1 }}
             />
             <div className="absolute inset-0 bg-black/20" />
             
             {/* Text Content in the overlay */}
             <div className={`absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center transition-all duration-700 ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
               <h3 className="text-4xl font-bold mb-4">Hello, Friend!</h3>
               <p className="text-lg text-white/80 mb-8">Enter your personal details and start your journey with us.</p>
               <button onClick={() => setIsLogin(true)} className="px-12 py-3 rounded-full border border-white font-semibold hover:bg-white hover:text-[#0071e3] transition-colors">
                 Sign In
               </button>
             </div>
             
             <div className={`absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}`}>
               <h3 className="text-4xl font-bold mb-4">New Here?</h3>
               <p className="text-lg text-white/80 mb-8">Sign up and discover a great amount of new opportunities!</p>
               <button onClick={() => setIsLogin(false)} className="px-12 py-3 rounded-full border border-white font-semibold hover:bg-white hover:text-[#0071e3] transition-colors">
                 Register
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
