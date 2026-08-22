'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  User,
  Briefcase,
  Camera,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UploadCloud,
  Check,
} from 'lucide-react';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [password, setPassword] = useState('Password123!');
  const [phone, setPhone] = useState('+91 98123 99887');
  const [address, setAddress] = useState('Flat 302, Green Glen Layout, Bellandur, Bengaluru');
  const [dob, setDob] = useState('1996-05-14');
  const [emergencyContact, setEmergencyContact] = useState('Meera Rivera (+91 98123 99880)');
  const [department] = useState('Growth Marketing');
  const [designation] = useState('Growth Marketing Manager');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300');
  const [docUploaded, setDocUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: 'Account Security', icon: Lock },
    { title: 'Personal Details', icon: User },
    { title: 'Job Confirmation', icon: Briefcase },
    { title: 'Profile Photo', icon: Camera },
    { title: 'Document Upload', icon: FileCheck },
    { title: 'Review & Submit', icon: CheckCircle2 },
  ];

  const handleComplete = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/employee');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center p-4">
      {/* Top Header */}
      <div className="max-w-xl w-full text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3 border border-accent/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Employee Guided Onboarding</span>
        </div>
        <h1 className="text-2xl font-bold text-textPrimary">Welcome to Dayflow</h1>
        <p className="text-xs text-textMuted mt-1">Complete your profile setup in 6 easy steps</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white border border-borderSubtle rounded-modal shadow-xl overflow-hidden">
        {/* Progress Bar Header */}
        <div className="bg-stone-50 p-4 border-b border-borderSubtle">
          <div className="flex justify-between items-center text-xs font-semibold text-textSecondary mb-2">
            <span>Step {step} of 6: {steps[step - 1].title}</span>
            <span className="text-accent font-bold">{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Security */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <Lock className="w-4 h-4 text-accent" />
                    Set Password & Verify Account
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Corporate Email</label>
                    <input
                      type="text"
                      disabled
                      value="alex@dayflow.hr"
                      className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-100 text-stone-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Create Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Email verified via invite token</span>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Personal Information
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Full Name</label>
                    <input
                      type="text"
                      value="Alex Rivera"
                      readOnly
                      className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-100 text-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Residential Address</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs border border-borderSubtle rounded-lg p-3 bg-stone-50 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Job Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" />
                    Confirm Job Details (Pre-filled by HR)
                  </h3>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-textMuted font-medium">Department</span>
                      <span className="font-bold text-textPrimary">{department}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-textMuted font-medium">Designation</span>
                      <span className="font-bold text-textPrimary">{designation}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-textMuted font-medium">Employee ID</span>
                      <span className="font-mono font-bold text-accent">EMP-1004</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-textMuted font-medium">Date of Joining</span>
                      <span className="font-bold text-textPrimary">September 1, 2026</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-textMuted">These details were configured by your HR Admin Priya Sharma. Click next to confirm.</p>
                </div>
              )}

              {/* Step 4: Photo */}
              {step === 4 && (
                <div className="space-y-4 text-center">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4 text-accent" />
                    Upload Profile Photo
                  </h3>
                  <div className="flex flex-col items-center gap-3">
                    <img src={profileImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-accent shadow-md" />
                    <button
                      type="button"
                      onClick={() => setProfileImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')}
                      className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Change Photo Avatar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-accent" />
                    Upload Identification Documents
                  </h3>
                  <div className="p-6 border-2 border-dashed border-stone-300 rounded-xl text-center bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-xs font-semibold text-textPrimary">Click to upload Passport / Government ID Proof</p>
                    <p className="text-[10px] text-textMuted mt-1">PDF, PNG, JPG up to 5MB (Stored securely in Cloudinary)</p>
                  </div>

                  <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-textPrimary">Dayflow_Signed_Offer_Letter.pdf</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Uploaded</span>
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {step === 6 && (
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Review & Complete Onboarding
                  </h3>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-textMuted">Name:</span> <span className="font-bold">Alex Rivera</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Role:</span> <span className="font-bold">Growth Marketing Manager</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Phone:</span> <span className="font-bold">{phone}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Status:</span> <span className="text-emerald-700 font-bold">Ready to Activate</span></div>
                  </div>
                  <p className="text-[11px] text-textMuted">Clicking Submit will change your status from INVITED to ACTIVE and take you directly to your Employee Dashboard.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-borderSubtle flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-accent hover:bg-accentHover text-white px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
              >
                <span>Submit & Activate Workspace</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
