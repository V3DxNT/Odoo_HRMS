'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  CalendarDays,
  FileText,
  Shield,
  Zap,
  Users,
  Bot,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bgPrimary selection:bg-accent selection:text-white">
      {/* Navigation */}
      <header className="border-b border-borderSubtle bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent text-white font-black text-lg flex items-center justify-center tracking-tighter shadow-sm">
              D
            </div>
            <span className="text-base font-bold text-textPrimary tracking-tight">Dayflow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-textSecondary">
            <a href="#features" className="hover:text-textPrimary transition-colors">Features</a>
            <a href="#showcase" className="hover:text-textPrimary transition-colors">Product</a>
            <a href="#comparison" className="hover:text-textPrimary transition-colors">Why Dayflow</a>
            <a href="#ai" className="hover:text-textPrimary transition-colors">AI Assistant</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-xs font-semibold text-textSecondary hover:text-textPrimary px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/employee"
              className="text-xs font-semibold bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6 border border-accent/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen HRMS Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-textPrimary max-w-3xl mx-auto leading-tight">
            Every workday, <br className="hidden sm:inline" />
            <span className="text-accent">perfectly aligned.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-textSecondary max-w-2xl mx-auto leading-relaxed">
            The quiet, modern homepage of your company's workday. Check in, apply for leave, view payslips, and manage team HR operations in seconds — not minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/employee"
              className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accentHover text-white text-sm font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-100 text-stone-700 border border-borderSubtle text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              Test Onboarding Flow
            </Link>
          </div>
        </motion.div>

        {/* Hero Dashboard Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-borderSubtle shadow-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-borderSubtle pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-textMuted font-mono ml-2">dayflow.hr / employee / dashboard</span>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
              ● Live System
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60">
              <div className="text-xs font-semibold text-textMuted uppercase">Attendance Today</div>
              <div className="text-xl font-bold text-textPrimary mt-1">Checked In (09:05 AM)</div>
              <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Present • On Time
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60">
              <div className="text-xs font-semibold text-textMuted uppercase">Paid Leave Balance</div>
              <div className="text-xl font-bold text-textPrimary mt-1">18 Days Remaining</div>
              <div className="mt-2 text-xs text-accent font-medium">100% Entitlement Available</div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60">
              <div className="text-xs font-semibold text-textMuted uppercase">Latest Payslip</div>
              <div className="text-xl font-bold text-textPrimary mt-1">July 2026</div>
              <div className="mt-2 text-xs text-textSecondary font-mono">Net Pay: ₹1,30,000</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Strip */}
      <section className="py-10 bg-white border-y border-borderSubtle">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-textPrimary tabular-nums">99.5%</div>
            <div className="text-xs text-textMuted mt-1">System Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-textPrimary tabular-nums">&lt; 30s</div>
            <div className="text-xs text-textMuted mt-1">Check-in Completion</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-textPrimary tabular-nums">&lt; 24h</div>
            <div className="text-xs text-textMuted mt-1">Leave Approval Decision</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-textPrimary tabular-nums">100%</div>
            <div className="text-xs text-textMuted mt-1">Audit Trail Transparency</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary">Built for speed, clarity, and peace of mind</h2>
          <p className="text-sm text-textSecondary mt-2">Every feature designed to minimize clicks and eliminate administrative overhead.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-textPrimary">1-Tap Attendance</h3>
            <p className="text-xs text-textSecondary mt-2 leading-relaxed">
              Instant daily check-in with automatic timestamp logging, status indicators, and total working hours calculation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-textPrimary">Zero-Friction Leave</h3>
            <p className="text-xs text-textSecondary mt-2 leading-relaxed">
              Apply for paid, sick, or unpaid leave in seconds. Admins receive AI-summarized justification remarks for instant decision making.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs hover:border-stone-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-textPrimary">Payroll Clarity</h3>
            <p className="text-xs text-textSecondary mt-2 leading-relaxed">
              Full visibility into base pay, allowances, and tax deductions. Instant PDF payslip downloads with versioned admin audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-16 bg-white border-y border-borderSubtle">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-textPrimary text-center mb-10">Why Dayflow vs. Legacy HR Tools</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-borderSubtle bg-stone-50">
                  <th className="p-4 font-bold text-textPrimary">Dimension</th>
                  <th className="p-4 font-semibold text-stone-500">Legacy Enterprise (Workday)</th>
                  <th className="p-4 font-semibold text-stone-500">Dated Mid-Market (BambooHR)</th>
                  <th className="p-4 font-bold text-accent bg-accent/5">Dayflow HRMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                <tr>
                  <td className="p-4 font-semibold text-textPrimary">Setup Time</td>
                  <td className="p-4 text-textSecondary">Weeks (consultants needed)</td>
                  <td className="p-4 text-textSecondary">Days</td>
                  <td className="p-4 font-bold text-accent bg-accent/5">Same Day Live</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-textPrimary">User Interface</td>
                  <td className="p-4 text-textSecondary">Dense, form-heavy grid</td>
                  <td className="p-4 text-textSecondary">Functional but icon-heavy</td>
                  <td className="p-4 font-bold text-accent bg-accent/5">Minimal, calm, animated</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-textPrimary">AI Integration</td>
                  <td className="p-4 text-textSecondary">Expensive enterprise add-on</td>
                  <td className="p-4 text-textSecondary">None</td>
                  <td className="p-4 font-bold text-accent bg-accent/5">Native Gemini AI built-in</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-textPrimary">Deployment</td>
                  <td className="p-4 text-textSecondary">Complex vendor locking</td>
                  <td className="p-4 text-textSecondary">Per-seat monthly subscription</td>
                  <td className="p-4 font-bold text-accent bg-accent/5">Postgres + Vercel monorepo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-blue-50 to-white p-8 sm:p-12 rounded-2xl border border-blue-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">Your HR assistant, built right in</h2>
          <p className="text-xs sm:text-sm text-textSecondary max-w-xl mx-auto mt-2 leading-relaxed">
            Powered by Google's Gemini API, Dayflow answers employee policy questions, summarizes long leave justifications for admins, and flags attendance anomalies automatically.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/employee"
              className="px-5 py-2.5 bg-accent text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-accentHover transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try HR Chatbot in Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-borderSubtle bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent text-white font-bold flex items-center justify-center text-xs">D</div>
            <span className="font-semibold text-textPrimary">Dayflow HRMS</span>
            <span>— Tagline: Every workday, perfectly aligned.</span>
          </div>
          <div>© {new Date().getFullYear()} Dayflow Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
