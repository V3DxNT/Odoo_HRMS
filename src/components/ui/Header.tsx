'use client';

import { useState, useEffect } from 'react';
import { Bell, User as UserIcon, Check } from 'lucide-react';
import { NotificationRecord } from '@/lib/types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export function Header({ title, subtitle, userName, userRole, userAvatar }: HeaderProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      // silence
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      // silence
    }
  };

  return (
    <header className="h-16 bg-white border-b border-borderSubtle px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base font-bold text-textPrimary tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-textMuted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-borderSubtle rounded-card shadow-xl p-3 z-50 animate-in fade-in zoom-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-borderSubtle mb-2">
                <span className="text-xs font-bold text-textPrimary">Notifications</span>
                <span className="text-[10px] text-textMuted">{unreadCount} unread</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-textMuted text-center py-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                        n.read ? 'bg-white border-transparent text-stone-500' : 'bg-stone-50 border-stone-200 text-stone-800 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-stone-200" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">
              {userName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-textPrimary block leading-tight">{userName}</span>
            <span className="text-[10px] text-textMuted block leading-none capitalize">{userRole?.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

