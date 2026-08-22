import React from 'react';
import { clsx } from 'clsx';
import { LeaveStatus, AttendanceStatus, UserStatus } from '@/lib/types';

interface BadgeProps {
  status: LeaveStatus | AttendanceStatus | UserStatus | string;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  let style = 'bg-stone-100 text-stone-700 border-stone-200';

  const normalized = status.toUpperCase();

  if (normalized === 'APPROVED' || normalized === 'PRESENT' || normalized === 'ACTIVE') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
  } else if (normalized === 'PENDING' || normalized === 'HALF_DAY' || normalized === 'INVITED') {
    style = 'bg-amber-50 text-amber-800 border-amber-200/60';
  } else if (normalized === 'REJECTED' || normalized === 'ABSENT' || normalized === 'SUSPENDED') {
    style = 'bg-rose-50 text-rose-800 border-rose-200/60';
  } else if (normalized === 'LEAVE' || normalized === 'PAID') {
    style = 'bg-blue-50 text-blue-800 border-blue-200/60';
  }

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', style, className)}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
