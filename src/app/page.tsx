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

const CompanyCarousel = () => {
  const companies = [
    { name: "Acme Corp", employees: "1,200+ employees", logo: "🏢", color: "from-blue-500 to-indigo-600" },
    { name: "Stripe Logistics", employees: "4,500+ employees", logo: "💳", color: "from-[#635BFF] to-[#00D4B2]" },
    { name: "Linear Studio", employees: "350+ employees", logo: "📐", color: "from-purple-500 to-pink-500" },
    { name: "Vercel Labs", employees: "800+ employees", logo: "▲", color: "from-[#000000] to-[#333336]" },
    { name: "OpenAI Systems", employees: "2,000+ employees", logo: "🧠", color: "from-[#10a37f] to-emerald-600" },
    { name: "Figma Creative", employees: "1,500+ employees", logo: "🎨", color: "from-[#F24E1E] to-[#A259FF]" },
    { name: "Notion HR", employees: "950+ employees", logo: "📝", color: "from-stone-700 to-stone-900" },
    { name: "Shopify Global", employees: "10,000+ employees", logo: "🛍️", color: "from-[#96bf48] to-green-700" },
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap py-4 group flex relative">
      {/* Marquee effect wrapper */}
      <div className="inline-block animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] flex gap-4 pr-4">
        {companies.concat(companies).map((c, i) => (
          <div 
            key={i} 
            className="w-56 h-20 flex-shrink-0 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 p-4 shadow-sm hover:shadow-md hover:border-black/10 transition-all flex items-center gap-3.5"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-lg font-bold shadow-sm`}>
              {c.logo}
            </div>
            <div className="text-left overflow-hidden">
              <div className="font-bold text-sm text-[#1d1d1f] tracking-tight truncate">{c.name}</div>
              <div className="text-[11px] font-semibold text-[#86868b] tracking-wide mt-0.5">{c.employees}</div>
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

      {/* Sticky Translucent Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2 text-[#1d1d1f] hover:opacity-80 transition-opacity">
            <FlowerLogo />
            <span className="font-semibold text-lg tracking-tight">Dayflow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <div 
              className="relative py-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-[#0071e3] transition-colors flex items-center gap-1 font-medium">
                Platform
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl p-4 flex flex-col gap-2"
                  >
                    <Link href="#features" className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                      <div className="font-semibold text-[#1d1d1f]">Core Features</div>
                      <div className="text-xs text-[#86868b]">Attendance, leave, and more</div>
                    </Link>
                    <Link href="#workflows" className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                      <div className="font-semibold text-[#1d1d1f]">Workflows</div>
                      <div className="text-xs text-[#86868b]">Visual kanban boards</div>
                    </Link>
                    <Link href="#integrations" className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                      <div className="font-semibold text-[#1d1d1f]">Integrations</div>
                      <div className="text-xs text-[#86868b]">Connect with your tools</div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium hover:text-[#0071e3] transition-colors">Sign In</Link>
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

          {/* Company Logos Carousel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <p className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6">Trusted by modern teams & enterprises</p>
            <CompanyCarousel />
          </motion.div>
        </section>

        {/* Jira-Inspired Workflow Section */}
        <section id="workflows" className="scroll-mt-32">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful workflows.<br/>Zero configuration.</h2>
            <p className="text-xl text-[#86868b]">Visualize every HR process just like your engineering boards. Track onboarding, approvals, and performance in real-time.</p>
          </div>

          <div className="bento-card bg-white p-2 md:p-8 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-6 bg-[#f5f5f7] p-6 rounded-2xl min-h-[500px]">
              
              {/* Column 1: Pending */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-black/5 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#86868b] text-sm uppercase tracking-wide">Pending Review (3)</h4>
                  <div className="w-6 h-6 rounded-full bg-[#f5f5f7] flex items-center justify-center text-xs font-bold text-[#86868b]">+</div>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg border border-[#d2d2d7] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">Leave Request</span>
                    <span className="text-xs text-[#86868b]">HR-492</span>
                  </div>
                  <h5 className="font-semibold text-[15px] mb-1">Annual Vacation</h5>
                  <p className="text-sm text-[#86868b] mb-4">Alex M. • 5 Days</p>
                  <div className="flex justify-between items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">AM</div>
                    <div className="text-xs font-medium text-orange-500">Needs Approval</div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg border border-[#d2d2d7] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md">Expense</span>
                    <span className="text-xs text-[#86868b]">HR-491</span>
                  </div>
                  <h5 className="font-semibold text-[15px] mb-1">Q3 Offsite Travel</h5>
                  <p className="text-sm text-[#86868b] mb-4">Sarah J. • $450.00</p>
                  <div className="flex justify-between items-center">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">SJ</div>
                  </div>
                </motion.div>
              </div>

              {/* Column 2: In Progress */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-black/5 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#86868b] text-sm uppercase tracking-wide">In Progress (1)</h4>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg border border-[#0071e3] bg-blue-50/30 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0071e3]" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Onboarding</span>
                    <span className="text-xs text-[#86868b]">HR-503</span>
                  </div>
                  <h5 className="font-semibold text-[15px] mb-1">New Hire: Product Designer</h5>
                  <p className="text-sm text-[#86868b] mb-4">David L. • Starts Monday</p>
                  
                  <div className="w-full bg-[#d2d2d7] rounded-full h-1.5 mb-2">
                    <div className="bg-[#0071e3] h-1.5 rounded-full w-[60%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#86868b]">6/10 Tasks</span>
                    <span className="font-medium text-[#0071e3]">Active</span>
                  </div>
                </motion.div>
              </div>

              {/* Column 3: Done */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-black/5 p-4 flex flex-col gap-3 opacity-70">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#86868b] text-sm uppercase tracking-wide">Completed</h4>
                </div>
                
                <div className="p-4 rounded-lg border border-[#d2d2d7] bg-[#fbfbfd]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Payroll</span>
                    <span className="text-xs text-[#86868b]">HR-480</span>
                  </div>
                  <h5 className="font-semibold text-[15px] mb-1 line-through text-[#86868b]">August Cycle Run</h5>
                  <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium">
                    <span>✓ Processed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enhanced Bento Grid Features */}
        <section id="features" className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need.<br/>Nothing you don't.</h2>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto">An interconnected suite of tools designed to handle the complexity of modern HR without feeling complicated.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Human/Employee Profile Card */}
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

            {/* Smart Attendance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bento-card p-10 flex flex-col bg-[#1d1d1f] text-white"
            >
              <h3 className="text-2xl font-bold tracking-tight mb-2">Smart Time Tracking.</h3>
              <p className="text-[#86868b] font-medium mb-8">IP and Geofence ready.</p>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333336" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#34c759" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" className="drop-shadow-[0_0_10px_rgba(52,199,89,0.5)]" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-white tracking-tighter">7.5<span className="text-lg text-[#86868b]">h</span></span>
                    <span className="text-xs font-semibold text-[#34c759] uppercase tracking-widest mt-1">Logged</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* AI Insights Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-3 bento-card p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden relative bg-[#f5f5f7]"
            >
              <div className="max-w-xl relative z-10">
                <h3 className="text-3xl font-bold tracking-tight mb-4 text-[#0071e3]">Gemini AI Intelligence.</h3>
                <p className="text-[#1d1d1f] text-lg font-medium mb-4">Dayflow analyzes attendance patterns and summarizes leave requests automatically, saving you hours every week.</p>
                <p className="text-[#86868b]">Automatically flags flight-risk employees based on engagement patterns and instantly drafts performance review summaries.</p>
              </div>
              <div className="w-full md:w-[500px] mt-10 md:mt-0 p-6 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl border border-black/5 md:rotate-[-2deg] transform transition-transform hover:rotate-0">
                 <div className="flex gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0071e3] to-purple-500 flex items-center justify-center shadow-inner">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                   </div>
                   <div>
                     <div className="text-sm font-bold">AI Insight Generation</div>
                     <div className="text-xs text-[#86868b]">Analyzing Q3 Performance</div>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 bg-[#f5f5f7] rounded-full w-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-[#0071e3] to-purple-500 w-[75%] animate-pulse" />
                   </div>
                   <p className="text-sm leading-relaxed text-[#1d1d1f] font-medium border-l-2 border-[#0071e3] pl-3 py-1">
                     "Based on the last 3 months, the Engineering team has accumulated 450 hours of untaken PTO. Suggesting mandatory leave blocks to prevent burnout."
                   </p>
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
              The modern HRMS built for speed, design, and intelligence.
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
