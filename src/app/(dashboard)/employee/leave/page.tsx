'use client';

import { useState, useEffect } from 'react';
import { Plus, CalendarDays, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LeaveApplyModal } from '@/components/ui/LeaveApplyModal';
import { LeaveRequest, LeaveBalance } from '@/lib/types';

export default function EmployeeLeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance>({
    PAID: { total: 18, used: 0, remaining: 18 },
    SICK: { total: 12, used: 0, remaining: 12 },
    UNPAID: { total: 30, used: 0, remaining: 30 },
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leave');
      const data = await res.json();
      if (data.leaves) setLeaves(data.leaves);
      if (data.balance) setBalance(data.balance);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Balance Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-textPrimary">Leave Entitlements & Time Off</h2>
          <p className="text-xs text-textMuted">Apply for time off and track approval decisions in real time.</p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Time Off</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-card border border-borderSubtle shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-textMuted uppercase">
            <span>Paid Leave</span>
            <span className="text-emerald-700 font-bold">Annual</span>
          </div>
          <div className="text-3xl font-extrabold text-textPrimary mt-2 font-mono">{balance.PAID.remaining}</div>
          <p className="text-xs text-stone-500 mt-1">Days remaining (out of {balance.PAID.total})</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-borderSubtle shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-textMuted uppercase">
            <span>Sick Leave</span>
            <span className="text-amber-700 font-bold">Medical</span>
          </div>
          <div className="text-3xl font-extrabold text-textPrimary mt-2 font-mono">{balance.SICK.remaining}</div>
          <p className="text-xs text-stone-500 mt-1">Days remaining (out of {balance.SICK.total})</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-borderSubtle shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-textMuted uppercase">
            <span>Unpaid Leave</span>
            <span className="text-stone-500 font-bold">Optional</span>
          </div>
          <div className="text-3xl font-extrabold text-textPrimary mt-2 font-mono">{balance.UNPAID.remaining}</div>
          <p className="text-xs text-stone-500 mt-1">Days remaining (out of {balance.UNPAID.total})</p>
        </div>
      </div>

      {/* Leave Application History Table */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle">
          <h3 className="text-sm font-bold text-textPrimary">Time Off Request History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderSubtle bg-stone-50 text-textMuted uppercase font-semibold">
                <th className="p-3.5 pl-5">Type</th>
                <th className="p-3.5">Dates</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Remarks</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-textMuted">No leave requests submitted yet.</td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-textPrimary">{l.type} Leave</td>
                    <td className="p-3.5 font-medium text-stone-700">{l.startDate} to {l.endDate}</td>
                    <td className="p-3.5 font-mono font-bold text-stone-800">{l.daysCount} {l.daysCount === 1 ? 'day' : 'days'}</td>
                    <td className="p-3.5 text-stone-600 max-w-xs truncate">{l.remarks || '—'}</td>
                    <td className="p-3.5 pr-5">
                      <Badge status={l.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={fetchLeaves}
        leaveBalance={balance}
      />
    </div>
  );
}
