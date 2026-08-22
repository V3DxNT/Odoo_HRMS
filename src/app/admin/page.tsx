"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { initialLeaveRequests, adminMetrics, LeaveRequest } from '@/lib/dashboardMock';

const FlowerLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C55 35 65 45 80 50C65 55 55 65 50 80C45 65 35 55 20 50C35 45 45 35 50 20Z" fill="currentColor" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
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

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    const req = leaveRequests.find(r => r.id === id);
    setActionMessage(`Leave request for ${req?.employeeName} was ${newStatus.toLowerCase()}.`);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const filteredRequests = filterDept === 'ALL' 
    ? leaveRequests 
    : leaveRequests.filter(r => r.department === filterDept);

  const pendingCount = leaveRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-black/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#1d1d1f] text-white rounded-xl">
            <FlowerLogo />
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight block">Dayflow Enterprise</span>
            <span className="text-xs text-[#86868b] font-medium">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/employee')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors text-[#1d1d1f]"
          >
            Switch to Employee View ↗
          </button>
          
          <div className="flex items-center gap-3 border-l border-black/10 pl-4">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" 
              alt="Admin Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-black/10"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold leading-tight">Sarah Jenkins</div>
              <div className="text-xs text-[#86868b]">HR Director</div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="p-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 px-4 py-3 bg-[#1d1d1f] text-white text-sm font-medium rounded-xl shadow-xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
            <p className="text-[#86868b] text-base font-medium">Real-time overview of headcount, attendance, and leave workflows.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live System Active
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bento-card p-6 bg-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Total Headcount</span>
              <span className="p-2 rounded-xl bg-blue-50 text-[#0071e3] text-xs font-bold">👥 Users</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold tracking-tight">{adminMetrics.totalHeadcount}</div>
              <div className="text-xs font-semibold text-green-600 mt-1">{adminMetrics.headcountGrowth}</div>
            </div>
          </div>

          <div className="bento-card p-6 bg-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Attendance Rate</span>
              <span className="p-2 rounded-xl bg-green-50 text-green-600 text-xs font-bold">⏱ Daily</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold tracking-tight">{adminMetrics.attendanceRate}</div>
              <div className="text-xs text-[#86868b] mt-1">{adminMetrics.presentToday} Present / {adminMetrics.onLeaveToday} On Leave</div>
            </div>
          </div>

          <div className="bento-card p-6 bg-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Pending Approvals</span>
              <span className={`p-2 rounded-xl text-xs font-bold ${pendingCount > 0 ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                🔔 Action
              </span>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold tracking-tight">{pendingCount}</div>
              <div className="text-xs text-[#86868b] mt-1">Requires manager sign-off</div>
            </div>
          </div>

          <div className="bento-card p-6 bg-[#1d1d1f] text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Monthly Payroll</span>
              <span className="p-2 rounded-xl bg-white/10 text-white text-xs font-bold">💳 Est.</span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">{adminMetrics.payrollRunThisMonth}</div>
              <div className="text-xs text-white/60 mt-1">Scheduled for 30th Aug</div>
            </div>
          </div>
        </div>

        {/* Gemini AI Anomaly & Summary Bar */}
        <div className="bento-card p-6 bg-gradient-to-r from-blue-900 to-[#1d1d1f] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Gemini HR Intelligence Insight</h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] uppercase font-bold tracking-wider">AI Generated</span>
              </div>
              <p className="text-sm text-white/80 mt-1">
                "Attendance consistency is up 4% in Engineering. 2 upcoming vacation requests overlap on Aug 28th."
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Gemini AI Report Digest generated and saved.")}
            className="z-10 px-5 py-2.5 rounded-xl bg-white text-[#1d1d1f] text-xs font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Run Full AI Audit
          </button>
        </div>

        {/* Leave Requests Management Section */}
        <div className="bento-card p-6 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Leave Approvals Workflow</h2>
              <p className="text-xs text-[#86868b]">Manage and review employee time-off applications.</p>
            </div>
            
            {/* Department Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#f5f5f7] p-1 rounded-xl">
              {['ALL', 'Engineering', 'Design', 'Marketing'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
                  className="p-5 rounded-2xl border border-black/5 bg-[#fbfbfd] hover:border-black/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img src={req.employeeAvatar} alt={req.employeeName} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{req.employeeName}</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded">{req.department}</span>
                        <span className="text-xs text-[#86868b]">• {req.submittedAt}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#0071e3] mt-0.5">
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
                          className="px-4 py-2 bg-[#34c759] text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'REJECTED')}
                          className="px-4 py-2 bg-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
