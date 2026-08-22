'use client';

import { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const exportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Employee ID,Name,Department,Role,Attendance Rate,Leaves Taken,Monthly Salary\n' +
        'EMP-1001,Priya Sharma,Human Resources,Head of HR,98%,1 day,₹153000\n' +
        'EMP-1002,Arjun Mehta,Engineering,Senior Engineer,96%,2 days,₹130000\n' +
        'EMP-1003,Sarah Jenkins,Design,Lead Designer,94%,5 days,₹141000\n' +
        'EMP-1004,Alex Rivera,Marketing,Growth Manager,100%,0 days,₹115000\n';

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'Dayflow_HR_Report_August_2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-textPrimary">Organization HR Reports & Analytics</h2>
          <p className="text-xs text-textMuted">Overview of headcount growth, attendance efficiency, and leave utilization.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={downloading}
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* KPI Snapshots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Overall Attendance Rate" value="96.2%" change="+1.4% vs last mo" changeType="positive" icon={CalendarCheck} />
        <StatCard title="Average Time to Approve Leave" value="4.2 hours" change="Target < 24h" changeType="positive" icon={TrendingUp} />
        <StatCard title="Active Headcount" value="4 Employees" change="1 Pending Invite" changeType="neutral" icon={Users} />
      </div>

      {/* Department Breakdown */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2 border-b border-borderSubtle pb-3">
          <BarChart3 className="w-4 h-4 text-accent" />
          Departmental Attendance & Utilization
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-textPrimary mb-1">
              <span>Engineering (1 Employee)</span>
              <span className="font-mono text-accent">96.5% Attendance</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-accent h-full" style={{ width: '96.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-textPrimary mb-1">
              <span>Human Resources (1 Employee)</span>
              <span className="font-mono text-emerald-700">98.0% Attendance</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: '98.0%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-textPrimary mb-1">
              <span>Design (1 Employee)</span>
              <span className="font-mono text-amber-700">94.0% Attendance</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full" style={{ width: '94.0%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
