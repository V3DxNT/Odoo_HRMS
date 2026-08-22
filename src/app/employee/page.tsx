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

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "I'm currently unable to connect, but your leave balance is 12 days." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const txt = inputMsg;
    setInputMsg('');
    await sendQuery(txt);
  };

  const weeklyHours = [
    { day: "Mon", hours: 8.0, height: "80%" },
    { day: "Tue", hours: 8.5, height: "85%" },
    { day: "Wed", hours: 7.5, height: "75%" },
    { day: "Thu", hours: 8.0, height: "80%" },
    { day: "Fri", hours: 8.0, height: "80%" },
  ];

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

        <div className="flex items-center gap-6">
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

          <button 
            onClick={() => setShowLeaveModal(true)}
            className="px-6 py-3 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0077ED] transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            + Apply for Leave
          </button>
        </div>

        {/* Top Grid: Interactive Check-in & Leave Balance Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Interactive Digital Timer Check-In Card */}
          <div className="bento-card p-8 bg-white flex flex-col items-center justify-center text-center border border-black/5 shadow-sm">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#86868b] mb-4">Daily Shift Clock</span>
            
            <div className="relative mb-6">
              <div className={`w-40 h-40 rounded-full border-[8px] flex flex-col items-center justify-center transition-all ${
                isCheckedIn ? 'border-[#34c759] bg-green-50/30' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <span className="text-3xl font-extrabold tracking-tight text-[#1d1d1f]">{checkInTime}</span>
                <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mt-1">
                  {isCheckedIn ? 'Status: Active' : 'Status: Off Clock'}
                </span>
              </div>
              {isCheckedIn && (
                <span className="absolute bottom-3 right-3 w-4 h-4 bg-[#34c759] border-2 border-white rounded-full animate-ping" />
              )}
            </div>

            <button 
              onClick={toggleCheckIn}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                isCheckedIn 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                  : 'bg-[#34c759] text-white hover:bg-green-600 shadow-md'
              }`}
            >
              {isCheckedIn ? 'Check Out Now' : 'Check In Now'}
            </button>
          </div>

          {/* Leave Balances Grid (2 cols) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bento-card p-6 bg-gradient-to-br from-blue-50/80 via-white to-white flex flex-col justify-between border border-blue-100 shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0071e3]">Vacation Leave</span>
                <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f] mt-3">12 <span className="text-xs font-semibold text-[#86868b]">/ 15 days</span></div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0071e3] h-full rounded-full w-[80%]" />
                </div>
                <div className="text-[11px] font-bold text-[#86868b]">80% Balance Available</div>
              </div>
            </div>

            <div className="bento-card p-6 bg-gradient-to-br from-purple-50/80 via-white to-white flex flex-col justify-between border border-purple-100 shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600">Sick Leave</span>
                <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f] mt-3">5 <span className="text-xs font-semibold text-[#86868b]">/ 7 days</span></div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full w-[71%]" />
                </div>
                <div className="text-[11px] font-bold text-[#86868b]">71% Balance Available</div>
              </div>
            </div>

            <div className="bento-card p-6 bg-gradient-to-br from-amber-50/80 via-white to-white flex flex-col justify-between border border-amber-100 shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">Personal Days</span>
                <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f] mt-3">3 <span className="text-xs font-semibold text-[#86868b]">/ 3 days</span></div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[100%]" />
                </div>
                <div className="text-[11px] font-bold text-[#86868b]">100% Full Allowance</div>
              </div>
            </div>

            {/* Weekly Hours Bar Chart Visual Card */}
            <div className="sm:col-span-3 bento-card p-6 bg-white border border-black/5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-[#1d1d1f]">Weekly Work Hours Log</h3>
                  <p className="text-xs text-[#86868b]">Target: 40.0 hrs / week (Logged: 40.0 hrs)</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  100% On Track
                </span>
              </div>

              {/* Visual Bars */}
              <div className="h-28 flex items-end justify-between gap-4 pt-4 px-4 border-b border-black/5">
                {weeklyHours.map((w, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity">{w.hours}h</span>
                    <div className="w-full bg-[#f5f5f7] h-20 rounded-t-xl overflow-hidden flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-[#0071e3] to-blue-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110" 
                        style={{ height: w.height }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1d1d1f]">{w.day}</span>
                  </div>
                ))}
              </div>
            </div>

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

      {/* Flagship Floating Gemini AI HR Chatbot Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-black/10 overflow-hidden flex flex-col h-[490px]"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#1d1d1f] via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-cyan-400 flex items-center justify-center text-base shadow-md">
                    ✨
                  </div>
                  <div>
                    <div className="font-extrabold text-sm leading-tight text-white">Gemini HR Assistant</div>
                    <div className="text-[10px] font-bold text-blue-300">Live AI Integration Active</div>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white font-bold text-lg px-2 py-1">✕</button>
              </div>

              {/* Quick Suggested Prompts Bar */}
              <div className="p-2.5 bg-[#f5f5f7] border-b border-black/5 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                <button onClick={() => sendQuery("What is my vacation leave balance?")} className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[#0071e3] font-bold border border-black/5 shadow-2xs whitespace-nowrap">
                  🌴 Leave Balance?
                </button>
                <button onClick={() => sendQuery("When is payroll pay date?")} className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[#0071e3] font-bold border border-black/5 shadow-2xs whitespace-nowrap">
                  💳 Pay date?
                </button>
                <button onClick={() => sendQuery("What are shift hours?")} className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[#0071e3] font-bold border border-black/5 shadow-2xs whitespace-nowrap">
                  ⏱ Shift policy?
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbfd]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#0071e3] text-white rounded-br-none font-semibold shadow-sm' 
                        : 'bg-white text-[#1d1d1f] border border-black/5 shadow-sm rounded-bl-none font-medium'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3.5 rounded-2xl border border-black/5 text-xs text-[#0071e3] font-bold animate-pulse flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-ping" />
                      Gemini AI is processing...
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
                  className="flex-1 px-4 py-2.5 bg-[#f5f5f7] rounded-2xl text-xs focus:outline-none focus:bg-white border border-transparent focus:border-[#0071e3] font-semibold"
                />
                <button type="submit" className="px-4 py-2.5 bg-[#0071e3] text-white rounded-2xl text-xs font-extrabold hover:bg-[#0077ED] shadow-sm">
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1d1d1f] to-slate-800 text-white flex items-center justify-center text-2xl shadow-2xl hover:scale-105 transition-all border-2 border-white/30"
          title="Open Gemini HR Assistant"
        >
          ✨
        </button>
      </div>

    </div>
  );
}
