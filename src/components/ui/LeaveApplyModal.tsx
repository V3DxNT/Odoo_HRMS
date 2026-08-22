'use client';

import { useState } from 'react';
import { X, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { LeaveType } from '@/lib/types';

interface LeaveApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leaveBalance?: {
    PAID: { remaining: number };
    SICK: { remaining: number };
    UNPAID: { remaining: number };
  };
}

export function LeaveApplyModal({ isOpen, onClose, onSuccess, leaveBalance }: LeaveApplyModalProps) {
  const [type, setType] = useState<LeaveType>('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();
  const availableRemaining = leaveBalance?.[type]?.remaining ?? 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, startDate, endDate, remarks }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to submit leave request');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-modal w-full max-w-lg shadow-2xl border border-borderSubtle overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-sm font-bold text-textPrimary">Apply for Time Off</h3>
            <p className="text-xs text-textMuted">Submit leave request for HR review</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Leave Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 uppercase tracking-wider">
              Leave Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['PAID', 'SICK', 'UNPAID'] as LeaveType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                    type === t
                      ? 'border-accent bg-accent/5 text-accent shadow-xs'
                      : 'border-borderSubtle bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div>{t === 'PAID' ? 'Paid Leave' : t === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}</div>
                  <div className="text-[10px] text-stone-400 mt-1">
                    {leaveBalance?.[t]?.remaining ?? 0} days left
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 text-textPrimary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 text-textPrimary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {daysCount > 0 && (
            <div className="p-3 bg-stone-50 rounded-lg border border-borderSubtle flex items-center justify-between text-xs">
              <span className="text-textSecondary font-medium">Total requested duration:</span>
              <span className={`font-bold ${daysCount > availableRemaining ? 'text-rose-600' : 'text-accent'}`}>
                {daysCount} {daysCount === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Remarks / Reason</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Briefly state your reason for leave..."
              className="w-full text-xs border border-borderSubtle rounded-lg p-3 bg-stone-50 text-textPrimary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-borderSubtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent hover:bg-accentHover text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
