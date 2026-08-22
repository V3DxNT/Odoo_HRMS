'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LeaveRequest } from '@/lib/types';

export default function AdminLeaveApprovalsPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leave');
      const data = await res.json();
      if (data.leaves) setLeaves(data.leaves);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApproveReject = async (leaveId: string, approved: boolean) => {
    setProcessingId(leaveId);
    try {
      await fetch(`/api/leave/${leaveId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, comment: approved ? 'Approved by HR Admin' : 'Rejected by HR Admin' }),
      });
      await fetchLeaves();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    if (filter === 'ALL') return true;
    return l.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-4 rounded-card border border-borderSubtle">
        <span className="text-xs font-semibold text-textSecondary mr-2">Filter Status:</span>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === s ? 'bg-accent text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {s} ({leaves.filter((l) => (s === 'ALL' ? true : l.status === s)).length})
          </button>
        ))}
      </div>

      {/* Approval List */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-accent" />
            Time Off Approval Queue & Gemini Summaries
          </h3>
        </div>

        <div className="divide-y divide-borderSubtle">
          {filteredLeaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-textMuted">No leave records matching filter.</div>
          ) : (
            filteredLeaves.map((l) => (
              <div key={l.id} className="p-5 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-textPrimary text-sm">{l.userName}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600 font-medium">{l.userDepartment}</span>
                    <Badge status={l.type} />
                    <Badge status={l.status} />
                  </div>

                  <div className="text-stone-600 font-medium">
                    Requested Dates: <span className="font-bold text-textPrimary">{l.startDate} to {l.endDate}</span> ({l.daysCount} {l.daysCount === 1 ? 'day' : 'days'})
                  </div>

                  {l.aiSummary && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-900 text-xs mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="font-semibold text-[11px] text-accent uppercase tracking-wider shrink-0">AI Executive Summary:</span>
                      <span className="italic">{l.aiSummary}</span>
                    </div>
                  )}

                  {l.remarks && <p className="text-stone-500 text-[11px] mt-1">Full Justification: "{l.remarks}"</p>}
                  {l.reviewComment && <p className="text-stone-600 font-semibold text-[11px] mt-1">Admin Action Note: {l.reviewComment}</p>}
                </div>

                {l.status === 'PENDING' && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleApproveReject(l.id, false)}
                      disabled={processingId === l.id}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg border border-rose-200 text-xs flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproveReject(l.id, true)}
                      disabled={processingId === l.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs text-xs flex items-center gap-1 transition-colors"
                    >
                      {processingId === l.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
