"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockEmployeeAttendance, AttendanceRecord } from '@/lib/dashboardMock';

const FlowerLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C55 35 65 45 80 50C65 55 55 65 50 80C45 65 35 55 20 50C35 45 45 35 50 20Z" fill="currentColor" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
);

export default function EmployeeDashboard() {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>("09:00 AM");
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(mockEmployeeAttendance);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [leaveSuccess, setLeaveSuccess] = useState<string | null>(null);
  
  // AI Chatbot State
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello David! I am your Gemini HR Assistant. How can I help you with leave balances, policies, or payroll today?' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

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
      setShowLeaveModal(false);
      setLeaveSuccess("Your leave request has been submitted to Sarah Jenkins for approval!");
      setTimeout(() => setLeaveSuccess(null), 4000);
    }
  };

  const handleSendChat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "I'm currently unable to connect, but your leave balance is 12 days." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-black/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#0071e3] text-white rounded-xl">
            <FlowerLogo />
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight block">Dayflow Workspace</span>
            <span className="text-xs text-[#86868b] font-medium">Employee Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors text-[#1d1d1f]"
          >
            Switch to Admin View ↗
          </button>
          
          <div className="flex items-center gap-3 border-l border-black/10 pl-4">
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" 
              alt="Employee Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-black/10"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold leading-tight">David Lee</div>
              <div className="text-xs text-[#86868b]">Product Designer</div>
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

      {/* Success Banner */}
      <AnimatePresence>
        {leaveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 px-4 py-3 bg-[#34c759] text-white text-sm font-medium rounded-xl shadow-xl flex items-center gap-2"
          >
            ✓ {leaveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Good day, David 👋</h1>
            <p className="text-[#86868b] text-base font-medium">Here's your workday summary and leave balances.</p>
          </div>

          <button 
            onClick={() => setShowLeaveModal(true)}
            className="px-5 py-3 rounded-full bg-[#0071e3] text-white font-semibold text-sm hover:bg-[#0077ED] transition-colors shadow-lg shadow-blue-500/20"
          >
            + Apply for Leave
          </button>
        </div>

        {/* Top Grid: Check-in Widget & Leave Balances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Interactive Check-In Card */}
          <div className="bento-card p-8 bg-white flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-4">Daily Attendance</span>
            
            <div className="relative mb-6">
              <div className={`w-36 h-36 rounded-full border-[8px] flex flex-col items-center justify-center transition-colors ${
                isCheckedIn ? 'border-[#34c759]' : 'border-gray-200'
              }`}>
                <span className="text-3xl font-bold tracking-tight">{checkInTime}</span>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest mt-1">
                  {isCheckedIn ? 'Checked In' : 'Checked Out'}
                </span>
              </div>
              {isCheckedIn && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-[#34c759] border-2 border-white rounded-full animate-ping" />
              )}
            </div>

            <button 
              onClick={toggleCheckIn}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                isCheckedIn 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-[#34c759] text-white hover:bg-green-600 shadow-md'
              }`}
            >
              {isCheckedIn ? 'Check Out Now' : 'Check In Now'}
            </button>
          </div>

          {/* Leave Balances Grid (2 cols) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bento-card p-6 bg-gradient-to-br from-blue-50 to-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3]">Vacation Leave</span>
                <div className="text-4xl font-bold tracking-tight mt-4">12 <span className="text-sm font-normal text-[#86868b]">days</span></div>
              </div>
              <div className="text-xs font-semibold text-[#86868b] mt-4">15 days total / year</div>
            </div>

            <div className="bento-card p-6 bg-gradient-to-br from-purple-50 to-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Sick Leave</span>
                <div className="text-4xl font-bold tracking-tight mt-4">5 <span className="text-sm font-normal text-[#86868b]">days</span></div>
              </div>
              <div className="text-xs font-semibold text-[#86868b] mt-4">7 days total / year</div>
            </div>

            <div className="bento-card p-6 bg-gradient-to-br from-amber-50 to-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Personal Days</span>
                <div className="text-4xl font-bold tracking-tight mt-4">3 <span className="text-sm font-normal text-[#86868b]">days</span></div>
              </div>
              <div className="text-xs font-semibold text-[#86868b] mt-4">3 days total / year</div>
            </div>

            {/* Quick Profile Summary inside the grid */}
            <div className="sm:col-span-3 bento-card p-6 bg-[#1d1d1f] text-white flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/60">Current Designation</div>
                <div className="text-lg font-bold">Product Designer — Engineering Dept</div>
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white">
                Employee ID: #EMP-802
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance History Table */}
        <div className="bento-card p-6 bg-white space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Recent Attendance Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-xs text-[#86868b] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f5f5f7]/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">{log.date}</td>
                    <td className="py-3.5 px-4 text-[#86868b]">{log.checkIn}</td>
                    <td className="py-3.5 px-4 text-[#86868b]">{log.checkOut || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        log.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{log.hoursLogged} hrs</td>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold tracking-tight">Apply for Leave</h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-[#86868b] hover:text-[#1d1d1f] text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Leave Type</label>
                  <select name="type" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all">
                    <option value="Vacation">Vacation Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Personal">Personal Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Start Date</label>
                    <input name="startDate" type="date" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-[#0071e3] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">End Date</label>
                    <input name="endDate" type="date" required className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-[#0071e3] transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Reason / Remarks</label>
                  <textarea name="remarks" rows={3} required placeholder="Briefly describe why you are requesting leave..." className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all" />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowLeaveModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-[#86868b] hover:bg-[#f5f5f7]">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#0071e3] text-white font-semibold text-sm hover:bg-[#0077ED] shadow-md">Submit Application</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Gemini AI HR Chatbot Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col h-[450px]"
            >
              {/* Chat Header */}
              <div className="bg-[#1d1d1f] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-sm">✨</span>
                  <div>
                    <div className="font-bold text-sm leading-tight">Gemini HR Assistant</div>
                    <div className="text-[10px] text-blue-300">Powered by Gemini AI</div>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white font-bold text-lg">✕</button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbfd]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#0071e3] text-white rounded-br-none' 
                        : 'bg-white text-[#1d1d1f] border border-black/5 shadow-sm rounded-bl-none font-medium'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl border border-black/5 text-xs text-[#86868b] animate-pulse">
                      Gemini is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-black/5 flex gap-2">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask policy, leave, or payroll..."
                  className="flex-1 px-3 py-2 bg-[#f5f5f7] rounded-xl text-xs focus:outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
                />
                <button type="submit" className="px-3 py-2 bg-[#0071e3] text-white rounded-xl text-xs font-bold hover:bg-[#0077ED]">
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xl shadow-2xl hover:scale-105 transition-all border-2 border-white/20"
          title="Open Gemini HR Assistant"
        >
          ✨
        </button>
      </div>

    </div>
  );
}
