'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  CheckSquare,
  FileSpreadsheet,
  Plus,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Shield,
  Loader2,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { LeaveRequest, AttendanceRecord, User } from '@/lib/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [uRes, lRes, aRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leave'),
        fetch('/api/attendance'),
      ]);

      const uData = await uRes.json();
      const lData = await lRes.json();
      const aData = await aRes.json();

      if (uData.users) setUsers(uData.users);
      if (lData.leaves) setLeaves(lData.leaves);
      if (aData.records) setAttendance(aData.records);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');
  const todayPresent = attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length;
  const attendanceRate = users.length > 0 ? Math.round((todayPresent / users.length) * 100) : 96;

  const handleApproveReject = async (leaveId: string, approved: boolean) => {
    setProcessingId(leaveId);
    try {
      await fetch(`/api/leave/${leaveId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, comment: approved ? 'Approved by HR Admin' : 'Rejected by HR Admin' }),
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Headcount"
          value={users.length || 4}
          change="+1 this month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          change={`${todayPresent} present`}
          changeType="positive"
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length}
          change="Requires HR Review"
          changeType={pendingLeaves.length > 0 ? 'negative' : 'neutral'}
          icon={CheckSquare}
        />
        <StatCard
          title="Monthly Payroll"
          value="₹4,24,000"
          change="Disbursed 31st"
          changeType="neutral"
          icon={FileSpreadsheet}
        />
      </div>

      {/* Pending Approvals Queue featuring Gemini AI Summarizer */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-accent" />
              Pending Leave Approval Queue
            </h3>
            <p className="text-xs text-textMuted mt-0.5">Reviews auto-summarized by Gemini AI for rapid decision making</p>
          </div>
          <Link href="/admin/leave-approvals" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
            <span>View Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-borderSubtle">
          {pendingLeaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-textMuted">No pending leave approvals right now. All caught up! 🎉</div>
          ) : (
            pendingLeaves.map((leave) => (
              <div key={leave.id} className="p-5 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-textPrimary text-sm">{leave.userName}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600 font-medium">{leave.userDepartment}</span>
                    <Badge status={leave.type} />
                  </div>

                  <div className="text-stone-600 font-medium">
                    Duration: <span className="font-bold text-textPrimary">{leave.startDate} to {leave.endDate}</span> ({leave.daysCount} {leave.daysCount === 1 ? 'day' : 'days'})
                  </div>

                  {/* AI Summary Tag */}
                  {leave.aiSummary && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-900 text-xs mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="font-semibold text-[11px] text-accent uppercase tracking-wider shrink-0">AI Summary:</span>
                      <span className="italic">{leave.aiSummary}</span>
                    </div>
                  )}

                  {leave.remarks && <p className="text-stone-500 text-[11px] mt-1">Full Remarks: "{leave.remarks}"</p>}
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleApproveReject(leave.id, false)}
                    disabled={processingId === leave.id}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg border border-rose-200 text-xs flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApproveReject(leave.id, true)}
                    disabled={processingId === leave.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs text-xs flex items-center gap-1 transition-colors"
                  >
                    {processingId === leave.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Staff Roster Overview */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <h3 className="text-sm font-bold text-textPrimary">Employee Roster Summary</h3>
          <Link href="/admin/employees" className="text-xs text-accent font-semibold hover:underline">
            Manage Directory →
          </Link>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {users.map((u) => (
            <div key={u.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-3">
              <img
                src={u.profile?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={u.profile?.fullName || u.email}
                className="w-9 h-9 rounded-full object-cover border border-stone-200"
              />
              <div className="min-w-0">
                <div className="font-bold text-textPrimary truncate">{u.profile?.fullName || u.email}</div>
                <div className="text-[11px] text-stone-500 truncate">{u.profile?.designation || u.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
