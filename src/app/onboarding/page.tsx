"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const FlowerLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: 'Acme HR Technologies',
    teamSize: '50-100 employees',
    primaryGoal: 'Streamline Leaves & Attendance',
    adminRole: 'HR Director'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    router.push('/hr');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-black/5 space-y-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0071e3] text-white rounded-xl">
              <FlowerLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">Dayflow Setup</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Step {step} of 3</span>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0071e3] transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Tell us about your organization</h2>
                <p className="text-xs text-[#86868b] mt-1">We'll customize your Dayflow workspace layout based on your company structure.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Team Size</label>
                  <select 
                    value={formData.teamSize}
                    onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] transition-all text-sm"
                  >
                    <option>1-20 employees</option>
                    <option>20-50 employees</option>
                    <option>50-100 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight">What is your primary HR priority?</h2>
                <p className="text-xs text-[#86868b] mt-1">Select what you'd like to configure first.</p>
              </div>

              <div className="space-y-3">
                {[
                  "Streamline Leaves & Attendance",
                  "Automate Payroll & Reports",
                  "AI Insights & Anomaly Detection",
                  "Complete HR Transformation"
                ].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData({ ...formData, primaryGoal: goal })}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all ${
                      formData.primaryGoal === goal 
                        ? 'border-[#0071e3] bg-blue-50/50 text-[#0071e3]' 
                        : 'border-black/5 bg-[#f5f5f7] hover:border-black/10'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">You're all set!</h2>
                <p className="text-sm text-[#86868b] mt-1 max-w-sm mx-auto">
                  Your Dayflow workspace for <strong>{formData.companyName}</strong> has been configured with AI insights enabled.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          {step > 1 ? (
            <button onClick={prevStep} className="px-5 py-2.5 rounded-xl font-medium text-sm text-[#86868b] hover:bg-[#f5f5f7]">
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={nextStep} className="px-6 py-2.5 rounded-xl bg-[#0071e3] text-white font-semibold text-sm hover:bg-[#0077ED] shadow-md">
              Continue ➔
            </button>
          ) : (
            <button onClick={handleFinish} className="px-8 py-3 rounded-xl bg-[#34c759] text-white font-bold text-sm hover:bg-green-600 shadow-md">
              Enter Workspace 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
