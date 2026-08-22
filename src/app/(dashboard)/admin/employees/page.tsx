'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, UserPlus, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/lib/types';

export default function AdminEmployeesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, department, designation, role: 'EMPLOYEE' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to invite employee');
      }

      await fetchUsers();
      setIsInviteOpen(false);
      setEmail('');
      setFullName('');
    } catch (err: any) {
      setError(err.message || 'Error inviting employee');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      (u.profile?.fullName || '').toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.profile?.department || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs border border-borderSubtle rounded-lg pl-9 pr-3 py-2 bg-white text-textPrimary focus:outline-none focus:border-accent"
          />
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Employee</span>
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            Active & Invited Employee Directory ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderSubtle bg-stone-50 text-textMuted uppercase font-semibold">
                <th className="p-3.5 pl-5">Employee</th>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Designation</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profile?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                        alt={u.profile?.fullName || u.email}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="font-bold text-textPrimary">{u.profile?.fullName || u.email}</div>
                        <div className="text-[11px] text-textMuted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-stone-700">{u.employeeId}</td>
                  <td className="p-3.5 text-stone-700 font-medium">{u.profile?.department || 'Engineering'}</td>
                  <td className="p-3.5 text-stone-700">{u.profile?.designation || 'Specialist'}</td>
                  <td className="p-3.5 pr-5">
                    <Badge status={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-modal w-full max-w-md shadow-2xl border border-borderSubtle overflow-hidden">
            <div className="p-5 border-b border-borderSubtle flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-sm font-bold text-textPrimary">Invite New Employee</h3>
                <p className="text-xs text-textMuted">Sends an onboarding email invite link</p>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-5 space-y-4">
              {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="new.hire@dayflow.hr"
                  className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-borderSubtle">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
