"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { initialLeaveRequests, adminMetrics, LeaveRequest } from '@/lib/dashboardMock';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    router.push('/auth');
  };

  const exportToCSV = () => {
    const headers = ["Employee Name", "Department", "Leave Type", "Days", "Status", "Start Date", "End Date", "Reason"];
    const rows = leaveRequests.map(r => [
      `"${r.employeeName}"`,
      `"${r.department}"`,
      `"${r.type}"`,
      r.days,
      `"${r.status}"`,
      `"${r.startDate}"`,
      `"${r.endDate}"`,
      `"${r.reason.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dayflow_HR_Leave_Payroll_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setActionMessage("✓ CSV HR Report generated and downloaded successfully!");
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleAction = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/leave/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        const req = leaveRequests.find(r => r.id === id);
        setActionMessage(`Leave request for ${req?.employeeName} was ${newStatus.toLowerCase()}.`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = filterDept === 'ALL' 
    ? leaveRequests 
    : leaveRequests.filter(r => r.department === filterDept);

  const pendingCount = leaveRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans">
      
      {/* Enlarged Floating Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-black/10 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#1d1d1f] text-white rounded-2xl shadow-md flex items-center justify-center">
            <FlowerLogo />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#1d1d1f] block leading-tight">Dayflow</span>
            <span className="text-xs text-[#0071e3] font-extrabold uppercase tracking-wider">Admin & HR Management Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl bg-green-500 text-white hover:bg-green-600 transition-all shadow-md hover:shadow-green-500/25 active:scale-95"
          >
            <span className="text-sm">📥</span> Export CSV Report
          </button>
          
          <div 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 border-l border-black/10 pl-5 cursor-pointer hover:opacity-85 transition-opacity"
            title="View Profile"
          >
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" 
              alt="Admin Avatar" 
              className="w-11 h-11 rounded-full object-cover border-2 border-[#0071e3] shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <div className="text-base font-extrabold text-[#1d1d1f] leading-tight">Sarah Jenkins</div>
              <div className="text-xs font-semibold text-[#86868b]">HR Director</div>
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

      {/* Toast Notification */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 px-5 py-3.5 bg-[#1d1d1f] text-white text-sm font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-ping" />
            {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">Executive Overview</h1>
            <p className="text-[#86868b] text-base font-medium mt-1">Real-time statistics, department analytics, and workflow approvals.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-full flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
              Live Workspace Synchronized
            </span>
          </div>
        </div>

        {/* Executive Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Headcount */}
          <div className="bento-card p-6 bg-white flex flex-col justify-between border border-black/5 hover:border-black/10 transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#86868b]">Active Headcount</span>
              <span className="p-2 rounded-xl bg-blue-50 text-[#0071e3] text-xs font-bold">👥 Staff</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f]">{adminMetrics.totalHeadcount}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">↑ 12% MoM</span>
                <span className="text-xs text-[#86868b] font-semibold">142 Active / 6 Onboarding</span>
              </div>
            </div>
          </div>

          {/* Daily Attendance Rate with Circular Pie/Donut Chart */}
          <div className="bento-card p-6 bg-white flex flex-col justify-between border border-black/5 hover:border-black/10 transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#86868b]">Daily Attendance</span>
              <span className="p-2 rounded-xl bg-green-50 text-green-600 text-xs font-bold">⏱ 96.4%</span>
            </div>
            
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-[#1d1d1f]">{adminMetrics.attendanceRate}</div>
                <div className="text-xs text-[#86868b] mt-1 font-semibold">{adminMetrics.presentToday} Present • {adminMetrics.onLeaveToday} Off</div>
              </div>

              {/* Completion Pie Chart SVG */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-orange-200"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#34c759]"
                    strokeDasharray="96.4, 100"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-extrabold text-[#1d1d1f]">96%</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bento-card p-6 bg-white flex flex-col justify-between border border-black/5 hover:border-black/10 transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#86868b]">Pending Approvals</span>
              <span className={`p-2 rounded-xl text-xs font-bold ${pendingCount > 0 ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-gray-100 text-gray-500'}`}>
                🔔 {pendingCount} Pending
              </span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f]">{pendingCount}</div>
              <div className="text-xs text-orange-600 font-bold mt-2">Requires HR Manager sign-off</div>
            </div>
          </div>

          {/* High-Contrast Monthly Payroll Card */}
          <div className="bento-card p-6 bg-gradient-to-br from-[#1d1d1f] via-slate-900 to-indigo-950 text-white flex flex-col justify-between shadow-2xl border border-white/10">
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Monthly Payroll Run</span>
              <span className="px-2.5 py-1 rounded-xl bg-[#0071e3] text-white text-xs font-bold">💳 Est.</span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">{adminMetrics.payrollRunThisMonth}</div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#34c759] h-full rounded-full w-[88%]" />
              </div>
              <div className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1.5">
                <span>✓</span> Scheduled for Aug 30 • 100% Direct Deposit
              </div>
            </div>
          </div>

        </div>

        {/* Department Workforce Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Department Headcount Breakdown Bar */}
          <div className="lg:col-span-2 bento-card p-6 bg-white border border-black/5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#1d1d1f]">Department Workforce Distribution</h3>
                <p className="text-xs text-[#86868b]">Live breakdown across engineering, design, marketing, and HR.</p>
              </div>
              <span className="text-xs font-bold text-[#0071e3] bg-blue-50 px-3 py-1 rounded-xl">4 Departments</span>
            </div>

            {/* Segmented Color Bar */}
            <div className="w-full h-4 rounded-xl flex overflow-hidden gap-1">
              <div className="bg-[#0071e3] h-full w-[45%]" title="Engineering (45%)" />
              <div className="bg-[#a259ff] h-full w-[25%]" title="Product Design (25%)" />
              <div className="bg-[#ff9500] h-full w-[20%]" title="Marketing & Sales (20%)" />
              <div className="bg-[#34c759] h-full w-[10%]" title="HR & Operations (10%)" />
            </div>

            {/* Legend Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-[#f5f5f7] rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0071e3]" />
                  <span className="text-xs font-bold text-[#1d1d1f]">Engineering</span>
                </div>
                <div className="text-lg font-extrabold mt-1 text-[#1d1d1f]">67 <span className="text-xs font-medium text-[#86868b]">(45%)</span></div>
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#a259ff]" />
                  <span className="text-xs font-bold text-[#1d1d1f]">Design</span>
                </div>
                <div className="text-lg font-extrabold mt-1 text-[#1d1d1f]">37 <span className="text-xs font-medium text-[#86868b]">(25%)</span></div>
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff9500]" />
                  <span className="text-xs font-bold text-[#1d1d1f]">Marketing</span>
                </div>
                <div className="text-lg font-extrabold mt-1 text-[#1d1d1f]">30 <span className="text-xs font-medium text-[#86868b]">(20%)</span></div>
              </div>

              <div className="p-3 bg-[#f5f5f7] rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#34c759]" />
                  <span className="text-xs font-bold text-[#1d1d1f]">HR & Ops</span>
                </div>
                <div className="text-lg font-extrabold mt-1 text-[#1d1d1f]">14 <span className="text-xs font-medium text-[#86868b]">(10%)</span></div>
              </div>
            </div>
          </div>

          {/* Premium Flagship Gemini AI Box */}
          <div className="bento-card p-6 bg-gradient-to-br from-[#0a0f1d] via-[#12192c] to-[#0071e3]/30 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl border border-blue-500/30 group">
            {/* Shimmer overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-700" />
            
            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-cyan-400 flex items-center justify-center text-lg shadow-lg">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight text-white">Gemini HR Audit Intelligence</h3>
                    <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Active AI Layer</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-200 text-[10px] uppercase font-extrabold tracking-wider border border-blue-400/30">
                  Live Sync
                </span>
              </div>
              
              <p className="text-xs text-white/90 leading-relaxed pt-1 font-medium bg-white/5 p-3.5 rounded-2xl border border-white/10">
                "Attendance consistency is up 4% in Engineering. 2 upcoming vacation requests overlap on Aug 28th. No anomalies detected in payroll logs."
              </p>
            </div>

            <div className="pt-4 z-10 space-y-2">
              <button 
                onClick={() => setActionMessage("✓ Gemini AI Full Audit completed: No policy anomalies detected.")}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0071e3] to-blue-500 text-white text-xs font-extrabold hover:brightness-110 transition-all shadow-lg shadow-blue-500/30"
              >
                Run Gemini AI Audit Digest
              </button>
            </div>
          </div>

        </div>

        {/* Leave Requests Management Section */}
        <div className="bento-card p-6 bg-white space-y-6 border border-black/5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Leave Approvals Workflow</h2>
              <p className="text-xs text-[#86868b]">Review employee time-off applications with live AI remarks summary.</p>
            </div>
            
            {/* Department Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#f5f5f7] p-1.5 rounded-2xl border border-black/5">
              {['ALL', 'Engineering', 'Design', 'Marketing'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    filterDept === dept 
                      ? 'bg-white text-[#1d1d1f] shadow-sm' 
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-10 text-[#86868b] text-sm">No leave requests found for this filter.</div>
            ) : (
              filteredRequests.map((req) => (
                <motion.div 
                  key={req.id}
                  layout
                  className="p-5 rounded-2xl border border-black/5 bg-[#fbfbfd] hover:border-black/10 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img src={req.employeeAvatar} alt={req.employeeName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#1d1d1f]">{req.employeeName}</span>
                        <span className="px-2.5 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded-full">{req.department}</span>
                        <span className="text-xs text-[#86868b]">• {req.submittedAt}</span>
                      </div>
                      <div className="text-sm font-bold text-[#0071e3] mt-0.5">
                        {req.type} — {req.days} Day{req.days > 1 ? 's' : ''} ({req.startDate} to {req.endDate})
                      </div>
                      <p className="text-xs text-[#86868b] mt-1 font-medium italic">"{req.reason}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === 'PENDING' ? (
                      <>
                        <button 
                          onClick={() => handleAction(req.id, 'APPROVED')}
                          className="px-5 py-2.5 bg-[#34c759] text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                        >
                          Approve Request
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'REJECTED')}
                          className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
