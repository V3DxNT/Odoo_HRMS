"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockEmployeeAttendance, AttendanceRecord } from '@/lib/dashboardMock';

const FlowerLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#0071e3">
      <circle cx="50" cy="22" r="16" opacity="0.9" />
      <circle cx="70" cy="30" r="16" opacity="0.9" />
      <circle cx="78" cy="50" r="16" opacity="0.9" />
      <circle cx="70" cy="70" r="16" opacity="0.9" />
      <circle cx="50" cy="78" r="16" opacity="0.9" />
      <circle cx="30" cy="70" r="16" opacity="0.9" />
      <circle cx="22" cy="50" r="16" opacity="0.9" />
      <circle cx="30" cy="30" r="16" opacity="0.9" />
    </g>
    <circle cx="50" cy="50" r="14" fill="#ffffff" />
    <circle cx="50" cy="50" r="8" fill="#0071e3" />
  </svg>
);

interface EmployeeLeaveItem {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  reason: string;
  rejectionReason?: string;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>("09:00 AM");
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(mockEmployeeAttendance);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [leaveSuccess, setLeaveSuccess] = useState<string | null>(null);

  // Employee's leave request history with rejection reasons support
  const [myLeaves, setMyLeaves] = useState<EmployeeLeaveItem[]>([
    {
      id: "LV-201",
      type: "Vacation Leave",
      startDate: "2026-08-25",
      endDate: "2026-08-29",
      days: 5,
      status: "PENDING",
      reason: "Annual family vacation."
    },
    {
      id: "LV-198",
      type: "Sick Leave",
      startDate: "2026-08-10",
      endDate: "2026-08-11",
      days: 2,
      status: "REJECTED",
      reason: "Urgent dental procedure.",
      rejectionReason: "Insufficient advance notice during key release week. Please reschedule with team lead."
    },
    {
      id: "LV-180",
      type: "Personal Leave",
      startDate: "2026-07-15",
      endDate: "2026-07-15",
      days: 1,
      status: "APPROVED",
      reason: "Family event assistance."
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: "N-1",
      title: "Leave Application Rejected",
      message: "Your Sick Leave request for Aug 10 - Aug 11 was rejected. Reason: Insufficient advance notice during key release week.",
      time: "2 days ago",
      type: "REJECTED",
      unread: true
    },
    {
      id: "N-2",
      title: "Personal Leave Approved",
      message: "Your Personal Leave request for Jul 15 was approved by Sarah Jenkins.",
      time: "1 month ago",
      type: "APPROVED",
      unread: false
    }
  ]);

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    router.push('/auth');
  };

  const toggleCheckIn = async () => {
    if (isCheckedIn) {
      const res = await fetch('/api/attendance/check-out', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsCheckedIn(false);
        setAttendanceLogs(prev => prev.map(log => log.date === "Today" ? { ...log, checkOut: data.checkOut, hoursLogged: data.hoursLogged } : log));
      }
    } else {
      const res = await fetch('/api/attendance/check-in', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsCheckedIn(true);
        setCheckInTime(data.checkIn);
      }
    }
  };

  const handleApplyLeave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const remarks = formData.get('remarks') as string;

    const res = await fetch('/api/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, startDate, endDate, remarks, employeeName: 'David Lee' })
    });

    const data = await res.json();

    if (data.success) {
      const newLeaveItem: EmployeeLeaveItem = {
        id: `LV-${Date.now().toString().slice(-3)}`,
        type: `${type} Leave`,
        startDate,
        endDate,
        days: 1,
        status: 'PENDING',
        reason: remarks
      };
      setMyLeaves(prev => [newLeaveItem, ...prev]);
      setShowLeaveModal(false);
      setLeaveSuccess("Your leave request has been submitted to Sarah Jenkins for approval!");
      setTimeout(() => setLeaveSuccess(null), 4000);
    }
  };

  const weeklyHours = [
    { day: "Mon", hours: 8.0, height: "80%" },
    { day: "Tue", hours: 8.5, height: "85%" },
    { day: "Wed", hours: 7.5, height: "75%" },
    { day: "Thu", hours: 8.0, height: "80%" },
    { day: "Fri", hours: 8.0, height: "80%" },
  ];

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans">
      
      {/* Enlarged Floating Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-black/10 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#0071e3] text-white rounded-2xl shadow-md flex items-center justify-center">
            <FlowerLogo />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#1d1d1f] block leading-tight">Dayflow</span>
            <span className="text-xs text-[#0071e3] font-extrabold uppercase tracking-wider">Employee Hub & Self-Service</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-2xl bg-white border border-black/10 hover:bg-gray-50 transition-colors relative"
              title="Notifications"
            >
              🔔
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-black/10 p-5 space-y-4 z-50"
                >
                  <div className="flex items-center justify-between border-b border-black/5 pb-3">
                    <h4 className="font-bold text-sm text-[#1d1d1f]">Notifications ({notifications.length})</h4>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-xs font-semibold text-[#0071e3] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                          n.type === 'REJECTED' 
                            ? 'bg-red-50/60 border-red-200 text-red-900' 
                            : 'bg-[#fbfbfd] border-black/5 text-[#1d1d1f]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{n.title}</span>
                          <span className="text-[10px] text-[#86868b]">{n.time}</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 border-l border-black/10 pl-5 cursor-pointer hover:opacity-85 transition-opacity"
            title="View Profile"
          >
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" 
              alt="Employee Avatar" 
              className="w-11 h-11 rounded-full object-cover border-2 border-[#0071e3] shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <div className="text-base font-extrabold text-[#1d1d1f] leading-tight">David Lee</div>
              <div className="text-xs font-semibold text-[#86868b]">Product Designer</div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Success Banner */}
      <AnimatePresence>
        {leaveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 px-5 py-3.5 bg-[#34c759] text-white text-sm font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            ✓ {leaveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">Good day, David 👋</h1>
            <p className="text-[#86868b] text-base font-medium mt-1">Here is your daily attendance, leave balances, and weekly work log.</p>
          </div>
        </div>

        {/* Leave Requests & Rejection Reasons Section */}
        <div className="bento-card p-6 bg-white space-y-4 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">My Leave Requests & Status</h2>
              <p className="text-xs text-[#86868b]">Track leave applications, approvals, and rejection feedback from HR.</p>
            </div>
            <button 
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 bg-blue-50 text-[#0071e3] font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
            >
              + New Request
            </button>
          </div>

          <div className="space-y-3">
            {myLeaves.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-2xl border border-black/5 bg-[#fbfbfd] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-[#1d1d1f]">{item.type}</span>
                    <span className="text-xs text-[#86868b]">({item.startDate} to {item.endDate} • {item.days} day{item.days > 1 ? 's' : ''})</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200' :
                    item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#86868b] font-medium">Remarks: "{item.reason}"</p>

                {/* Display Rejection Reason if Rejected */}
                {item.status === 'REJECTED' && item.rejectionReason && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-semibold space-y-0.5">
                    <div className="font-extrabold uppercase tracking-wider text-red-600 text-[10px]">
                      Rejection Reason from HR:
                    </div>
                    <div>"{item.rejectionReason}"</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attendance History Log Table */}
        <div className="bento-card p-6 bg-white space-y-4 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Recent Attendance Log</h2>
            <span className="text-xs text-[#86868b] font-medium">Last 5 Workdays</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-xs text-[#86868b] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Check In</th>
                  <th className="py-3.5 px-4">Check Out</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f5f5f7]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{log.date}</td>
                    <td className="py-3.5 px-4 text-[#86868b] font-medium">{log.checkIn}</td>
                    <td className="py-3.5 px-4 text-[#86868b] font-medium">{log.checkOut || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        log.status === 'PRESENT' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{log.hoursLogged} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border border-black/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1d1d1f]">Apply for Leave</h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-[#86868b] hover:text-[#1d1d1f] text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Leave Type</label>
                  <select name="type" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all font-semibold">
                    <option value="Vacation">Vacation Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Personal">Personal Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Start Date</label>
                    <input name="startDate" type="date" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-[#0071e3] transition-all font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">End Date</label>
                    <input name="endDate" type="date" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-[#0071e3] transition-all font-semibold" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Reason / Remarks</label>
                  <textarea name="remarks" rows={3} required placeholder="Briefly describe why you are requesting leave..." className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all font-medium" />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowLeaveModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#86868b] hover:bg-[#f5f5f7]">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0077ED] shadow-md">Submit Application</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
