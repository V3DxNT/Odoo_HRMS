'use client';

import { useState, useEffect } from 'react';
import { FileSpreadsheet, Edit3, ShieldCheck, History } from 'lucide-react';
import { EditSalaryModal } from '@/components/ui/EditSalaryModal';
import { PayrollRecord, AuditLogRecord } from '@/lib/types';

export default function AdminPayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  const fetchPayroll = async () => {
    try {
      const res = await fetch('/api/payroll/all');
      const data = await res.json();
      if (data.payroll) setPayroll(data.payroll);
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    // Populate default payroll list
    setPayroll([
      { id: 'pay_1', userId: 'usr_admin_1', userName: 'Priya Sharma', employeeId: 'EMP-1001', department: 'Human Resources', baseSalary: 140000, allowances: 25000, deductions: 12000, netSalary: 153000, currency: '₹', effectiveFrom: '2026-01-01', updatedAt: '2026-01-01' },
      { id: 'pay_2', userId: 'usr_emp_1', userName: 'Arjun Mehta', employeeId: 'EMP-1002', department: 'Engineering', baseSalary: 120000, allowances: 20000, deductions: 10000, netSalary: 130000, currency: '₹', effectiveFrom: '2026-01-01', updatedAt: '2026-01-01' },
      { id: 'pay_3', userId: 'usr_emp_2', userName: 'Sarah Jenkins', employeeId: 'EMP-1003', department: 'Design', baseSalary: 130000, allowances: 22000, deductions: 11000, netSalary: 141000, currency: '₹', effectiveFrom: '2026-01-01', updatedAt: '2026-01-01' },
    ]);

    setAuditLogs([
      { id: 'aud_1', actorId: 'usr_admin_1', actorName: 'Priya Sharma', action: 'PAYROLL_UPDATED', entityType: 'Payroll', entityId: 'pay_2', details: 'Updated base salary for Arjun Mehta to ₹1,20,000', createdAt: '2026-08-20T10:00:00.000Z' },
    ]);
  }, []);

  const totalPayroll = payroll.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Total Overview Card */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Total Monthly Payroll Outflow</span>
          <div className="text-3xl font-extrabold text-textPrimary mt-1 tabular-nums font-mono">₹{totalPayroll.toLocaleString()}</div>
          <p className="text-xs text-textMuted mt-1">Disbursed on the last calendar day of every month</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-xs border border-emerald-200">
          ● Audit Trail Active
        </div>
      </div>

      {/* Salary Structure Table */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-accent" />
            Employee Salary Breakdown & Compensation
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderSubtle bg-stone-50 text-textMuted uppercase font-semibold">
                <th className="p-3.5 pl-5">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Base Salary</th>
                <th className="p-3.5">Allowances</th>
                <th className="p-3.5">Deductions</th>
                <th className="p-3.5">Net Pay</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-textPrimary">{p.userName} ({p.employeeId})</td>
                  <td className="p-3.5 text-stone-600">{p.department}</td>
                  <td className="p-3.5 font-mono text-stone-700">₹{p.baseSalary.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-stone-700">₹{p.allowances.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-rose-700">- ₹{p.deductions.toLocaleString()}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-700">₹{p.netSalary.toLocaleString()}</td>
                  <td className="p-3.5 pr-5 text-right">
                    <button
                      onClick={() =>
                        setEditingEmployee({
                          id: p.userId,
                          fullName: p.userName,
                          department: p.department,
                          baseSalary: p.baseSalary,
                          allowances: p.allowances,
                          deductions: p.deductions,
                        })
                      }
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-md border border-stone-200 text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Pay</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Audit Trail Log */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2 border-b border-borderSubtle pb-3">
          <History className="w-4 h-4 text-accent" />
          Payroll Versioning & Audit Log History
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-textPrimary">{log.actorName}</span>
                <span className="text-stone-500 ml-2">{log.details}</span>
              </div>
              <span className="text-[10px] text-textMuted font-mono">{new Date(log.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Salary Modal */}
      {editingEmployee && (
        <EditSalaryModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSuccess={fetchPayroll}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}
