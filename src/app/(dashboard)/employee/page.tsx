'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  CalendarDays,
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LeaveApplyModal } from '@/components/ui/LeaveApplyModal';
import { AttendanceRecord, LeaveRequest, LeaveBalance } from '@/lib/types';

export default function EmployeeDashboard() {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance>({
    PAID: { total: 18, used: 0, remaining: 18 },
    SICK: { total: 12, used: 0, remaining: 12 },
    UNPAID: { total: 30, used: 0, remaining: 30 },
  });
  const [isCheckInLoading, setIsCheckInLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Attendance
      const attRes = await fetch('/api/attendance');
      const attData = await attRes.json();
      if (attData.todayRecord) {
        setTodayRecord(attData.todayRecord);
      }

      // Fetch Leaves
      const leaveRes = await fetch('/api/leave');
      const leaveData = await leaveRes.json();
      if (leaveData.leaves) setLeaves(leaveData.leaves);
      if (leaveData.balance) setBalance(leaveData.balance);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckInToggle = async () => {
    setIsCheckInLoading(true);
    const endpoint = todayRecord?.checkIn && !todayRecord.checkOut ? '/api/attendance/check-out' : '/api/attendance/check-in';

    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.record) {
        setTodayRecord(data.record);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckInLoading(false);
    }
  };

  const isCheckedIn = !!(todayRecord?.checkIn && !todayRecord.checkOut);
  const isCheckedOut = !!(todayRecord?.checkIn && todayRecord?.checkOut);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Check-in Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check-In Card (Prominent Action) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-card border border-borderSubtle shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Today's Attendance</span>
              <h2 className="text-xl font-bold text-textPrimary mt-1">
                {isCheckedOut
                  ? 'Shift Completed'
                  : isCheckedIn
                  ? 'Currently Checked In'
                  : 'Ready to start your day?'}
              </h2>
              <p className="text-xs text-textSecondary mt-1">
                {isCheckedIn
                  ? `Checked in at ${new Date(todayRecord.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : isCheckedOut
                  ? `Worked ${todayRecord?.workHours || 8} hours today (${new Date(todayRecord!.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(todayRecord!.checkOut!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                  : 'Standard hours: 9:00 AM – 6:00 PM'}
              </p>
            </div>
            <div className="p-3 bg-bgElevated rounded-xl">
              <Clock className="w-6 h-6 text-accent" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-borderSubtle">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-textMuted">Status:</span>
              <Badge status={isCheckedIn ? 'PRESENT' : isCheckedOut ? 'PRESENT' : 'ABSENT'} />
            </div>

            <button
              onClick={handleCheckInToggle}
              disabled={isCheckInLoading || isCheckedOut}
              className={`px-6 py-3 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2 ${
                isCheckedOut
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : isCheckedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-accent hover:bg-accentHover text-white'
              }`}
            >
              {isCheckInLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isCheckedOut ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>
                {isCheckedOut
                  ? 'Check-out Completed'
                  : isCheckedIn
                  ? 'Check Out'
                  : 'Check In Now'}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Leave Balance Summary */}
        <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Leave Balances</span>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-textPrimary">Paid Leave</span>
                  <span className="text-stone-600 font-mono">{balance.PAID.remaining} / 18 left</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(balance.PAID.remaining / 18) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-textPrimary">Sick Leave</span>
                  <span className="text-stone-600 font-mono">{balance.SICK.remaining} / 12 left</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${(balance.SICK.remaining / 12) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-borderSubtle">
            <Link href="/employee/leave" className="text-xs font-medium text-textMuted hover:text-textPrimary flex items-center gap-1">
              <span>View full leave history</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Time-Off Requests */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <h3 className="text-sm font-bold text-textPrimary">Recent Leave Requests & Status</h3>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-3 py-1.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Apply Time Off
          </button>
        </div>

        <div className="divide-y divide-borderSubtle">
          {leaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-textMuted">No leave requests logged yet.</div>
          ) : (
            leaves.map((leave) => (
              <div key={leave.id} className="p-4 hover:bg-stone-50/60 transition-colors flex items-center justify-between text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mt-0.5">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-textPrimary">
                      {leave.type} Leave ({leave.daysCount} {leave.daysCount === 1 ? 'day' : 'days'})
                    </div>
                    <div className="text-stone-500 mt-0.5">
                      {leave.startDate} to {leave.endDate}
                    </div>
                    {leave.remarks && <p className="text-textMuted text-[11px] mt-1 italic">"{leave.remarks}"</p>}
                    {leave.reviewComment && (
                      <div className="text-[11px] text-stone-600 mt-1 font-medium bg-stone-100 px-2 py-0.5 rounded inline-block">
                        HR Note: {leave.reviewComment}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Badge status={leave.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leave Application Modal */}
      <LeaveApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={fetchData}
        leaveBalance={balance}
      />
    </div>
  );
}
