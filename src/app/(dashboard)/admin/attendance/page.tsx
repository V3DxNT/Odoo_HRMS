'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AttendanceRecord } from '@/lib/types';

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filterDept, setFilterDept] = useState('ALL');

  useEffect(() => {
    const fetchAtt = async () => {
      try {
        const res = await fetch('/api/attendance');
        const data = await res.json();
        if (data.records) setAttendance(data.records);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAtt();
  }, []);

  const filtered = attendance.filter((a) => {
    if (filterDept === 'ALL') return true;
    return (a.userDepartment || 'Engineering').toLowerCase() === filterDept.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-card border border-borderSubtle">
        <div className="flex items-center gap-2 text-xs font-semibold text-textSecondary">
          <Filter className="w-4 h-4 text-stone-400" />
          <span>Department Filter:</span>
          {['ALL', 'Engineering', 'Human Resources', 'Design', 'Marketing'].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filterDept === d ? 'bg-accent text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Organization Attendance Log Table */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-accent" />
            Company-Wide Attendance Board ({filtered.length} entries)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderSubtle bg-stone-50 text-textMuted uppercase font-semibold">
                <th className="p-3.5 pl-5">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Check-In</th>
                <th className="p-3.5">Check-Out</th>
                <th className="p-3.5">Logged Hours</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-textPrimary">{a.userName || 'Employee'}</td>
                  <td className="p-3.5 text-stone-600 font-medium">{a.userDepartment || 'Engineering'}</td>
                  <td className="p-3.5 font-mono text-stone-700">{a.date}</td>
                  <td className="p-3.5 font-mono text-stone-700">
                    {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="p-3.5 font-mono text-stone-700">
                    {a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-stone-800">
                    {a.workHours ? `${a.workHours} hrs` : 'In Progress'}
                  </td>
                  <td className="p-3.5 pr-5">
                    <Badge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
