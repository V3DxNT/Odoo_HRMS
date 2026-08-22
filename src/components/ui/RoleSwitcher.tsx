'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSwitch = async (targetRole: 'ADMIN' | 'EMPLOYEE') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        if (targetRole === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/employee');
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 bg-textPrimary text-white rounded-full shadow-2xl border border-white/20 text-xs font-medium backdrop-blur-md">
      <div className="px-2.5 py-1 text-[11px] text-zinc-400 border-r border-zinc-700/60 hidden sm:block">
        Demo Persona: <span className="text-white font-semibold">{currentUser?.fullName || 'Guest'}</span> ({currentUser?.role || 'None'})
      </div>

      <button
        onClick={() => handleSwitch('EMPLOYEE')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
          currentUser?.role === 'EMPLOYEE'
            ? 'bg-accent text-white font-semibold shadow-sm'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Arjun (Employee)</span>
      </button>

      <button
        onClick={() => handleSwitch('ADMIN')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
          currentUser?.role === 'ADMIN'
            ? 'bg-accent text-white font-semibold shadow-sm'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Priya (HR Admin)</span>
      </button>

      {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400 mr-1" />}
    </div>
  );
}
