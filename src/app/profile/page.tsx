"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: 'David',
    lastName: 'Lee',
    email: 'employee@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    designation: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
  });

  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass border-b border-black/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-xs font-bold text-[#0071e3] hover:underline">
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex items-center gap-2">
          <FlowerLogo />
          <span className="font-bold text-sm">Dayflow Profile</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Profile</h1>
          <p className="text-[#86868b] text-[#86868b] text-base font-medium">Manage your personal credentials, contact info, and avatar.</p>
        </div>

        {savedMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl">
            ✓ {savedMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="bento-card p-8 bg-white space-y-6">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 border-b border-black/5 pb-6">
            <img src={profile.avatar} alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#0071e3]" />
            <div>
              <h3 className="font-bold text-lg">{profile.firstName} {profile.lastName}</h3>
              <p className="text-xs text-[#86868b] mb-3">{profile.designation} • {profile.department}</p>
              <label className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-bold rounded-xl cursor-pointer transition-colors">
                Upload New Photo (Mock Cloudinary)
                <input type="file" className="hidden" onChange={() => alert("Photo updated via mock file upload service!")} />
              </label>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">First Name</label>
              <input 
                type="text" 
                value={profile.firstName}
                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl text-sm border border-transparent focus:bg-white focus:border-[#0071e3] transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Last Name</label>
              <input 
                type="text" 
                value={profile.lastName}
                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl text-sm border border-transparent focus:bg-white focus:border-[#0071e3] transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Work Email</label>
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm border border-transparent cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1.5">Phone Number</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl text-sm border border-transparent focus:bg-white focus:border-[#0071e3] transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-3 bg-[#0071e3] text-white font-semibold text-sm rounded-xl hover:bg-[#0077ED] shadow-md">
              Save Changes
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
