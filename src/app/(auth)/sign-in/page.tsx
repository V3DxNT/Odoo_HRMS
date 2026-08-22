'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to sign in');
      }

      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'ADMIN' | 'EMPLOYEE') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/employee');
        }
      }
    } catch (e) {
      setError('Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-textPrimary">Sign in to Dayflow</h2>
        <p className="text-xs text-textMuted mt-1">Enter your organizational credentials</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Instant Demo Buttons */}
      <div className="mb-6 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
        <div className="text-[11px] font-semibold text-textMuted uppercase text-center">Instant 1-Click Demo Login</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('EMPLOYEE')}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            <span>Arjun (Employee)</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('ADMIN')}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Priya (HR Admin)</span>
          </button>
        </div>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-borderSubtle" /></div>
        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-textMuted font-medium">or custom credentials</span></div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="arjun@dayflow.hr"
            className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent text-textPrimary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent text-textPrimary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Dashboard</span>}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-textMuted">
        New hire with an invite link?{' '}
        <Link href="/onboarding" className="text-accent font-semibold hover:underline">
          Complete Onboarding Flow
        </Link>
      </div>
    </div>
  );
}
