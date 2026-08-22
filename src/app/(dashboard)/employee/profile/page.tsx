'use client';

import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Briefcase, FileText, Upload, Save, Check } from 'lucide-react';

export default function EmployeeProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setPhone(data.user.phone || '');
        setAddress(data.user.address || '');
      }
    } catch (e) {
      // silence
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/employees/${user?.id || 'usr_emp_1'}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, address }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={user?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
          alt={user?.fullName}
          className="w-20 h-20 rounded-full object-cover border-2 border-stone-200"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-textPrimary">{user?.fullName || 'Arjun Mehta'}</h2>
              <p className="text-xs text-textSecondary mt-0.5">{user?.designation || 'Senior Frontend Engineer'} • {user?.department || 'Engineering'}</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200 self-center sm:self-auto">
              ID: {user?.employeeId || 'EMP-1002'}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-borderSubtle grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-textMuted">
            <div><span className="text-stone-400">Email:</span> <span className="text-textPrimary font-medium block">{user?.email || 'arjun@dayflow.hr'}</span></div>
            <div><span className="text-stone-400">Joining Date:</span> <span className="text-textPrimary font-medium block">{user?.dateOfJoining || '2025-02-15'}</span></div>
            <div><span className="text-stone-400">Status:</span> <span className="text-emerald-700 font-bold block">Active Employee</span></div>
          </div>
        </div>
      </div>

      {/* Profile Form & Job Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editable Personal Details */}
        <form onSubmit={handleSave} className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Personal Contact Details
            </h3>
            {saved && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs border border-borderSubtle rounded-lg pl-9 pr-3 py-2 bg-stone-50 text-textPrimary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">Residential Address</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs border border-borderSubtle rounded-lg pl-9 pr-3 py-2 bg-stone-50 text-textPrimary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Read-Only Employment & Salary Summary */}
        <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs space-y-4">
          <div className="border-b border-borderSubtle pb-3">
            <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              Employment & Salary Overview
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-textMuted font-medium">Department</span>
              <span className="font-semibold text-textPrimary">{user?.department || 'Engineering'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-textMuted font-medium">Role Designation</span>
              <span className="font-semibold text-textPrimary">{user?.designation || 'Senior Frontend Engineer'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-textMuted font-medium">Monthly Base Pay</span>
              <span className="font-bold text-textPrimary font-mono">₹1,20,000</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-textMuted font-medium">Allowances (HRA)</span>
              <span className="font-bold text-textPrimary font-mono">₹20,000</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-textMuted font-medium">Tax Deductions</span>
              <span className="font-bold text-rose-700 font-mono">- ₹10,000</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <span className="font-bold text-textPrimary">Net Monthly Pay</span>
              <span className="font-extrabold text-emerald-700 font-mono text-sm">₹1,30,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs">
        <div className="flex items-center justify-between border-b border-borderSubtle pb-3 mb-4">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Uploaded Documents & Identification
          </h3>
          <button className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-textPrimary">Govt_ID_Passport.pdf</div>
              <div className="text-[10px] text-textMuted mt-0.5">Uploaded Feb 15, 2025 • 1.2 MB</div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Verified</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-textPrimary">Dayflow_Signed_Offer_Letter.pdf</div>
              <div className="text-[10px] text-textMuted mt-0.5">Uploaded Feb 15, 2025 • 850 KB</div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
