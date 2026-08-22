"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

const PeopleCarousel = () => {
  const people = [
    {
      name: "Sarah Jenkins",
      role: "HR Director",
      department: "Human Resources",
      avatar: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80",
      tag: "Verified Lead",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      name: "Alex Mercer",
      role: "Sr. Software Engineer",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
      tag: "On-Time 99%",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "Elena Rodriguez",
      role: "HR Manager",
      department: "People Ops",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      tag: "Active HR",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      name: "David Lee",
      role: "Product Designer",
      department: "Product & Design",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      tag: "Design Lead",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    {
      name: "Sophia Chen",
      role: "Product Lead",
      department: "Product",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      tag: "PTO Approved",
      badgeColor: "bg-teal-100 text-teal-700"
    },
    {
      name: "Marcus Vance",
      role: "Growth Marketing",
      department: "Marketing",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      tag: "Checked In",
      badgeColor: "bg-green-100 text-green-700"
    }
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap py-4 group flex relative">
      <div className="inline-block animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] flex gap-4 pr-4">
        {people.concat(people).map((p, i) => (
          <div 
            key={i} 
            className="w-64 h-24 flex-shrink-0 rounded-2xl bg-white/95 backdrop-blur-md border border-black/5 p-4 shadow-sm hover:shadow-md hover:border-black/10 transition-all flex items-center gap-3.5"
          >
            <img 
              src={p.avatar} 
              alt={p.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#0071e3]/20 shadow-sm"
            />
            <div className="text-left overflow-hidden">
              <div className="font-bold text-sm text-[#1d1d1f] tracking-tight truncate">{p.name}</div>
              <div className="text-xs font-medium text-[#86868b] truncate mt-0.5">{p.role}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                  {p.tag}
                </span>
                <span className="text-[10px] text-[#86868b] font-semibold">{p.department}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white pb-24 relative">
      
      {/* Background Image Setup */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <img 
          src="https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=2000&q=80" 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-[0.03] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fbfbfd]" />
      </div>

      {/* Floating Ellipse Gradient Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50">
        <div className="bg-gradient-to-r from-white/95 via-blue-50/80 to-white/95 backdrop-blur-2xl border border-black/10 rounded-full px-8 h-16 flex items-center justify-between shadow-[0_12px_40px_rgba(0,113,227,0.12)] transition-all">
          <Link href="/" className="flex items-center gap-3 text-[#1d1d1f] hover:opacity-80 transition-opacity">
            <FlowerLogo />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-[#1d1d1f] to-[#0071e3] bg-clip-text text-transparent">Dayflow</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm">
            <div 
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-[#0071e3] transition-colors flex items-center gap-1.5 font-semibold text-base">
                Platform
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-2xl border border-black/10 rounded-3xl shadow-2xl p-3 flex flex-col gap-1.5"
                  >
                    <Link href="#features" className="p-3 rounded-2xl hover:bg-blue-50/70 transition-colors">
                      <div className="font-bold text-sm text-[#1d1d1f]">Core Features</div>
                      <div className="text-xs text-[#86868b]">Attendance, leave, and payroll</div>
                    </Link>
                    <Link href="#workflows" className="p-3 rounded-2xl hover:bg-blue-50/70 transition-colors">
                      <div className="font-bold text-sm text-[#1d1d1f]">Workflows</div>
                      <div className="text-xs text-[#86868b]">Visual kanban boards</div>
                    </Link>
                    <Link href="#integrations" className="p-3 rounded-2xl hover:bg-blue-50/70 transition-colors">
                      <div className="font-bold text-sm text-[#1d1d1f]">Integrations</div>
                      <div className="text-xs text-[#86868b]">Connect with your tools</div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="#workflows" className="hover:text-[#0071e3] transition-colors font-semibold text-base">Workflows</Link>
            <Link href="#features" className="hover:text-[#0071e3] transition-colors font-semibold text-base">Features</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0077ED] transition-all shadow-md hover:shadow-blue-500/25">
              Sign In ➔
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-7xl mx-auto space-y-32 relative z-10">
        
        {/* Hero Section */}
        <section className="text-center pt-10 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-700">Work. Better. Together.</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[56px] md:text-[88px] font-bold leading-[1.05] tracking-tight max-w-5xl mx-auto"
          >
            HR that works.<br />
            <span className="text-[#0071e3]">Like magic.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-xl md:text-2xl text-[#86868b] max-w-3xl mx-auto font-medium tracking-tight"
          >
            Manage attendance, streamline leave approvals, and visualize payroll. Dayflow combines enterprise power with an interface your team will actually love to use.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth?tab=register" className="px-10 py-4 rounded-full bg-[#0071e3] text-white font-medium text-lg hover:bg-[#0077ED] transition-colors shadow-lg shadow-blue-500/30">
              Get Started
            </Link>
          </motion.div>

          {/* People Carousel Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <p className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6">Empowering team members & managers worldwide</p>
            <PeopleCarousel />
          </motion.div>
        </section>

        {/* Workflow Section (Enlarged Card) */}
        <section id="workflows" className="scroll-mt-32">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful workflows.<br/>Zero configuration.</h2>
            <p className="text-xl text-[#86868b]">Visualize every HR process just like your engineering boards. Track onboarding, approvals, and performance in real-time.</p>
          </div>

          <div className="bento-card bg-white p-6 md:p-12 overflow-hidden relative shadow-lg">
            <div className="flex flex-col md:flex-row gap-8 bg-[#f5f5f7] p-8 rounded-3xl min-h-[580px]">
              
              {/* Column 1: Pending */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1d1d1f] text-base tracking-wide">Pending Review (3)</h4>
                  <div className="w-7 h-7 rounded-full bg-[#f5f5f7] flex items-center justify-center text-xs font-bold text-[#86868b]">+</div>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl border border-[#d2d2d7] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">Leave Request</span>
                    <span className="text-xs text-[#86868b]">HR-492</span>
                  </div>
                  <h5 className="font-bold text-base mb-1 text-[#1d1d1f]">Annual Vacation</h5>
                  <p className="text-sm text-[#86868b] mb-4">Alex Mercer • 5 Days (Japan Trip)</p>
                  <div className="flex justify-between items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">AM</div>
                    <div className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">Needs Approval</div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl border border-[#d2d2d7] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md">Expense</span>
                    <span className="text-xs text-[#86868b]">HR-491</span>
                  </div>
                  <h5 className="font-bold text-base mb-1 text-[#1d1d1f]">Q3 Offsite Travel</h5>
                  <p className="text-sm text-[#86868b] mb-4">Sarah Jenkins • $450.00</p>
                  <div className="flex justify-between items-center">
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">SJ</div>
                  </div>
                </motion.div>
              </div>

              {/* Column 2: In Progress */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1d1d1f] text-base tracking-wide">In Progress (1)</h4>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl border border-[#0071e3] bg-blue-50/40 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0071e3]" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Onboarding</span>
                    <span className="text-xs text-[#86868b]">HR-503</span>
                  </div>
                  <h5 className="font-bold text-base mb-1 text-[#1d1d1f]">New Hire: Product Designer</h5>
                  <p className="text-sm text-[#86868b] mb-4">David Lee • Starts Monday</p>
                  
                  <div className="w-full bg-[#d2d2d7] rounded-full h-2 mb-3">
                    <div className="bg-[#0071e3] h-2 rounded-full w-[60%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#86868b] font-medium">6/10 Tasks Completed</span>
                    <span className="font-bold text-[#0071e3] bg-blue-100 px-2 py-0.5 rounded">Active</span>
                  </div>
                </motion.div>
              </div>

              {/* Column 3: Done */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-4 opacity-80">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1d1d1f] text-base tracking-wide">Completed</h4>
                </div>
                
                <div className="p-5 rounded-xl border border-[#d2d2d7] bg-[#fbfbfd]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Payroll</span>
                    <span className="text-xs text-[#86868b]">HR-480</span>
                  </div>
                  <h5 className="font-bold text-base mb-1 line-through text-[#86868b]">August Cycle Run</h5>
                  <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-bold">
                    <span>✓ Processed & Verified</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need.<br/>Nothing you don't.</h2>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto">An interconnected suite of tools designed to handle the complexity of modern HR without feeling complicated.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Employee Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bento-card p-10 flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-[#f5f5f7] to-white relative overflow-hidden"
            >
              <div className="z-10 flex-1">
                <h3 className="text-3xl font-bold tracking-tight mb-4">Deep Employee Profiles.</h3>
                <p className="text-[#86868b] text-lg font-medium mb-6">Centralize documents, compensation history, and performance metrics in one beautiful view.</p>
                <ul className="space-y-3">
                  {['Document Vault (SOC2 Compliant)', 'Compensation timelines', 'Asset tracking'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f]">
                      <div className="w-5 h-5 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-64 relative z-10 floating-card rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/50 bg-white p-4">
                 <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="HR Professional" className="w-full h-48 object-cover rounded-xl mb-4" />
                 <div className="text-center">
                   <div className="text-lg font-bold">Sarah Jenkins</div>
                   <div className="text-sm text-[#0071e3] font-medium mb-4">Head of People</div>
                   <div className="grid grid-cols-2 gap-2 text-left">
                     <div className="bg-[#f5f5f7] p-2 rounded-lg">
                       <div className="text-[10px] text-[#86868b] uppercase font-bold">Tenure</div>
                       <div className="text-sm font-semibold">2y 4m</div>
                     </div>
                     <div className="bg-[#f5f5f7] p-2 rounded-lg">
                       <div className="text-[10px] text-[#86868b] uppercase font-bold">Status</div>
                       <div className="text-sm font-semibold text-green-600">Active</div>
                     </div>
                   </div>
                 </div>
              </div>
            </motion.div>

            {/* Smart Time Tracking Card (Visible High-Contrast Widget) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bento-card p-10 flex flex-col bg-[#1d1d1f] text-white justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Smart Time Tracking</h3>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
                    ● Live Sync
                  </span>
                </div>
                <p className="text-gray-400 font-medium text-sm">Automated attendance & geofencing.</p>
              </div>
              
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="w-44 h-44 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#333336" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#34c759" strokeWidth="8" strokeDasharray="264" strokeDashoffset="24" className="drop-shadow-[0_0_12px_rgba(52,199,89,0.6)]" />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">98.4%</span>
                    <span className="text-xs font-bold text-[#34c759] uppercase tracking-wider mt-1">On-Time Rate</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium">Daily Avg Logged</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">8.2 Hours/Day</span>
              </div>
            </motion.div>
            
            {/* Workforce & Compliance Analytics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-3 bento-card p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden relative bg-[#f5f5f7]"
            >
              <div className="max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0071e3] text-xs font-bold mb-4">
                  <span>📊</span> Workforce Analytics
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 text-[#1d1d1f]">Automated Workforce & Compliance.</h3>
                <p className="text-[#86868b] text-lg font-medium mb-4">Dayflow monitors attendance trends, leave balances, and payroll schedules automatically, ensuring complete organizational alignment.</p>
                <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#1d1d1f]">
                  <span className="flex items-center gap-1.5"><span className="text-[#0071e3]">✓</span> Instant Leave Reports</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#0071e3]">✓</span> Audit Trail Logging</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#0071e3]">✓</span> One-Click Export</span>
                </div>
              </div>
              <div className="w-full md:w-[480px] mt-10 md:mt-0 p-6 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-black/5 md:rotate-[-1deg] transform transition-transform hover:rotate-0">
                 <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
                   <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center font-bold text-lg">
                       ⚡
                     </div>
                     <div>
                       <div className="text-sm font-bold text-[#1d1d1f]">Compliance & Audit Digest</div>
                       <div className="text-xs text-[#86868b]">Updated 5 mins ago</div>
                     </div>
                   </div>
                   <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">100% Synced</span>
                 </div>
                 <div className="space-y-3 text-xs">
                   <div className="p-3 bg-[#fbfbfd] rounded-xl border border-black/5 flex justify-between items-center">
                     <span className="font-semibold text-[#1d1d1f]">Q3 Leave Approval Rate</span>
                     <span className="font-bold text-[#0071e3]">94.8% Approved</span>
                   </div>
                   <div className="p-3 bg-[#fbfbfd] rounded-xl border border-black/5 flex justify-between items-center">
                     <span className="font-semibold text-[#1d1d1f]">Monthly Payroll Status</span>
                     <span className="font-bold text-green-600">✓ Audit Clean</span>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Integration Ecosystem */}
        <section id="integrations" className="py-16 text-center border-t border-black/5">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Plays well with others</h2>
          <p className="text-[#86868b] mb-12">Connect Dayflow with the tools your company already uses.</p>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Slack', 'Google Workspace', 'Microsoft Teams', 'Okta', 'Jira', 'GitHub', 'Zoom', 'Notion'].map(integration => (
              <div key={integration} className="px-6 py-4 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow font-semibold text-[#1d1d1f]">
                {integration}
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-black/5 bg-white pt-16 pb-8 px-6 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-[#1d1d1f] mb-4">
              <FlowerLogo />
              <span className="font-semibold text-xl tracking-tight">Dayflow</span>
            </Link>
            <p className="text-[#86868b] max-w-sm">
              The modern HRMS built for speed, design, and simplicity.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-[#86868b]">
              <li><Link href="#features" className="hover:text-[#0071e3]">Features</Link></li>
              <li><Link href="#integrations" className="hover:text-[#0071e3]">Integrations</Link></li>
              <li><Link href="#workflows" className="hover:text-[#0071e3]">Workflows</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-[#86868b]">
              <li><Link href="#" className="hover:text-[#0071e3]">About</Link></li>
              <li><Link href="#" className="hover:text-[#0071e3]">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#0071e3]">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#0071e3]">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-black/5 text-center md:text-left text-[#86868b] text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Dayflow Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#1d1d1f]">Privacy</Link>
            <Link href="#" className="hover:text-[#1d1d1f]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

