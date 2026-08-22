import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="bg-bgSurface p-5 rounded-card border border-borderSubtle transition-all duration-200 hover:border-stone-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-textSecondary uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-bgElevated text-textSecondary">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-textPrimary tabular-nums tracking-tight">{value}</div>
        {(change || subtitle) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={`font-semibold ${
                  changeType === 'positive' ? 'text-emerald-700' : changeType === 'negative' ? 'text-rose-700' : 'text-textMuted'
                }`}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="text-textMuted">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
