'use client';

import { useState } from 'react';
import { X, DollarSign, Loader2 } from 'lucide-react';

interface EditSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: {
    id: string;
    fullName: string;
    department?: string;
    baseSalary?: number;
    allowances?: number;
    deductions?: number;
  };
}

export function EditSalaryModal({ isOpen, onClose, onSuccess, employee }: EditSalaryModalProps) {
  const [baseSalary, setBaseSalary] = useState(employee.baseSalary || 120000);
  const [allowances, setAllowances] = useState(employee.allowances || 20000);
  const [deductions, setDeductions] = useState(employee.deductions || 10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const netSalary = Math.max(0, Number(baseSalary) + Number(allowances) - Number(deductions));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/payroll/${employee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseSalary, allowances, deductions }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to update salary');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-modal w-full max-w-md shadow-2xl border border-borderSubtle overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-sm font-bold text-textPrimary">Update Salary Structure</h3>
            <p className="text-xs text-textMuted">{employee.fullName} ({employee.department || 'Engineering'})</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">Base Salary (Monthly)</label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">Allowances (HRA, Special)</label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(Number(e.target.value))}
              className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1">Deductions (Tax, PF)</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full text-xs border border-borderSubtle rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="p-3 bg-stone-100 rounded-lg border border-borderSubtle flex items-center justify-between">
            <span className="text-xs font-medium text-textSecondary">Calculated Net Pay:</span>
            <span className="text-sm font-bold text-emerald-700 tabular-nums">₹{netSalary.toLocaleString()} / mo</span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-borderSubtle">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent hover:bg-accentHover text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save & Log Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
