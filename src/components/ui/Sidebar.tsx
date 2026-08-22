'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  Users,
  CheckSquare,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: 'HR' | 'EMPLOYEE';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const employeeNav = [
    { label: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { label: 'My Profile', href: '/employee/profile', icon: UserCheck },
    { label: 'Attendance', href: '/employee/attendance', icon: CalendarCheck },
    { label: 'Time Off / Leave', href: '/employee/leave', icon: CalendarDays },
    { label: 'Payslips', href: '/employee/payslips', icon: FileSpreadsheet },
  ];

  const hrNav = [
    { label: 'Overview', href: '/hr', icon: LayoutDashboard },
    { label: 'Employee Directory', href: '/hr/employees', icon: Users },
    { label: 'Company Attendance', href: '/hr/attendance', icon: CalendarCheck },
    { label: 'Leave Approvals', href: '/hr/leave-approvals', icon: CheckSquare },
    { label: 'Payroll & Compensation', href: '/hr/payroll', icon: FileSpreadsheet },
    { label: 'Reports & Analytics', href: '/hr/reports', icon: BarChart3 },
  ];

  const navItems = role === 'HR' ? hrNav : employeeNav;

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    window.location.href = '/sign-in';
  };

  return (
    <aside className="w-64 bg-white border-r border-borderSubtle flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent text-white font-black text-lg flex items-center justify-center tracking-tighter shadow-sm group-hover:bg-accentHover transition-colors">
            D
          </div>
          <div>
            <span className="text-base font-bold text-textPrimary tracking-tight">Dayflow</span>
            <span className="text-[10px] block text-textMuted font-mono uppercase tracking-widest">HR System</span>
          </div>
        </Link>
        <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 uppercase">
          {role}
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-textMuted uppercase tracking-wider">
          {role === 'HR' ? 'HR Management' : 'Workspace'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent font-semibold border-l-2 border-accent'
                  : 'text-textSecondary hover:bg-bgElevated hover:text-textPrimary'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-stone-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-borderSubtle">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

