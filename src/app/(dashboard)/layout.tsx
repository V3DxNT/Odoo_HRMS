'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { HRAssistantDrawer } from '@/components/ui/HRAssistantDrawer';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        // Fallback default demo persona for smooth preview if not logged in
        const isAdminRoute = pathname.startsWith('/admin');
        setUser({
          id: isAdminRoute ? 'usr_admin_1' : 'usr_emp_1',
          fullName: isAdminRoute ? 'Priya Sharma' : 'Arjun Mehta',
          role: isAdminRoute ? 'ADMIN' : 'EMPLOYEE',
          department: isAdminRoute ? 'Human Resources' : 'Engineering',
          designation: isAdminRoute ? 'Head of HR Ops' : 'Senior Frontend Engineer',
          profileImageUrl: isAdminRoute
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        });
      }
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname === '/employee') return 'Good morning, ' + (user?.fullName?.split(' ')[0] || 'Arjun') + ' 👋';
    if (pathname === '/employee/profile') return 'My Profile & Documents';
    if (pathname === '/employee/attendance') return 'Attendance & Work Logs';
    if (pathname === '/employee/leave') return 'Time Off & Leave Management';
    if (pathname === '/employee/payslips') return 'Payslips & Salary Structure';
    if (pathname === '/admin') return 'HR Operations Overview';
    if (pathname === '/admin/employees') return 'Employee Directory';
    if (pathname === '/admin/attendance') return 'Organization Attendance Monitoring';
    if (pathname === '/admin/leave-approvals') return 'Leave Approval Queue';
    if (pathname === '/admin/payroll') return 'Payroll & Compensation Management';
    if (pathname === '/admin/reports') return 'Reports & Analytics Dashboard';
    return 'Dayflow HRMS';
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      {/* Sidebar */}
      <Sidebar role={user?.role || 'EMPLOYEE'} onOpenAi={() => setIsAiOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={getPageTitle()}
          subtitle={user?.department ? `${user.designation || 'Specialist'} • ${user.department}` : undefined}
          userName={user?.fullName || 'Arjun Mehta'}
          userRole={user?.role || 'EMPLOYEE'}
          userAvatar={user?.profileImageUrl}
          onOpenAi={() => setIsAiOpen(true)}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Gemini AI HR Assistant Drawer */}
      <HRAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        userName={user?.fullName}
      />

      {/* Fixed 1-Click Role Switcher Widget */}
      <RoleSwitcher />
    </div>
  );
}
