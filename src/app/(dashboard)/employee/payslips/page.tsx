'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EmployeePayslipsPage() {
  const [downloading, setDownloading] = useState(false);

  const payslips = [
    { month: 'July 2026', base: 120000, allowances: 20000, deductions: 10000, net: 130000, date: '2026-07-31' },
    { month: 'June 2026', base: 120000, allowances: 20000, deductions: 10000, net: 130000, date: '2026-06-30' },
    { month: 'May 2026', base: 120000, allowances: 20000, deductions: 10000, net: 130000, date: '2026-05-31' },
  ];

  const handleDownloadPDF = async (month: string, net: number) => {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Accent blue
      doc.text('DAYFLOW HRMS', 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Official Monthly Salary Slip', 20, 32);

      doc.setDrawColor(220, 220, 220);
      doc.line(20, 38, 190, 38);

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(`Employee: Arjun Mehta (EMP-1002)`, 20, 50);
      doc.text(`Designation: Senior Frontend Engineer`, 20, 58);
      doc.text(`Pay Period: ${month}`, 20, 66);
      doc.text(`Disbursement Date: 31st of month`, 20, 74);

      doc.setFillColor(245, 245, 245);
      doc.rect(20, 85, 170, 65, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.text('EARNINGS & DEDUCTIONS BREAKDOWN', 25, 95);
      doc.setFont('Helvetica', 'normal');
      doc.text('Base Salary:', 25, 108);
      doc.text('₹1,20,000.00', 140, 108);

      doc.text('Allowances (HRA):', 25, 118);
      doc.text('₹20,000.00', 140, 118);

      doc.text('Tax Deductions:', 25, 128);
      doc.text('- ₹10,000.00', 140, 128);

      doc.line(25, 134, 185, 134);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(21, 128, 61);
      doc.text('NET SALARY DISBURSED:', 25, 144);
      doc.text(`₹${net.toLocaleString()}.00`, 140, 144);

      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('This is a computer-generated document issued by Dayflow HRMS.', 20, 170);

      doc.save(`Dayflow_Payslip_${month.replace(' ', '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Current Month Breakdown Header */}
      <div className="bg-white p-6 rounded-card border border-borderSubtle shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderSubtle pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">Salary Structure & Payslips</h2>
            <p className="text-xs text-textMuted">Read-only view of compensation structure and downloadable payslip PDFs.</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
            ● Active Payroll
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500">Base Salary</div>
            <div className="text-lg font-bold text-textPrimary mt-1 font-mono">₹1,20,000</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500">Allowances</div>
            <div className="text-lg font-bold text-textPrimary mt-1 font-mono">₹20,000</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500">Deductions</div>
            <div className="text-lg font-bold text-rose-700 mt-1 font-mono">- ₹10,000</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-emerald-800 font-medium">Net Disbursed Pay</div>
            <div className="text-lg font-extrabold text-emerald-800 mt-1 font-mono">₹1,30,000</div>
          </div>
        </div>
      </div>

      {/* Monthly Payslips List */}
      <div className="bg-white rounded-card border border-borderSubtle shadow-xs overflow-hidden">
        <div className="p-5 border-b border-borderSubtle">
          <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-accent" />
            Issued Payslips
          </h3>
        </div>

        <div className="divide-y divide-borderSubtle">
          {payslips.map((ps, idx) => (
            <div key={idx} className="p-4 hover:bg-stone-50/60 transition-colors flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-textPrimary">{ps.month} Payslip</div>
                <div className="text-stone-500 mt-0.5">Disbursed on {ps.date} • Net: ₹{ps.net.toLocaleString()}</div>
              </div>
              <button
                onClick={() => handleDownloadPDF(ps.month, ps.net)}
                disabled={downloading}
                className="px-3 py-1.5 bg-accent hover:bg-accentHover text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
