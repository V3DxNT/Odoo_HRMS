import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dayflow — Every workday, perfectly aligned.',
  description: 'A modern, lightweight Human Resource Management System (HRMS) for small to mid-sized organizations. Fast attendance, leave approvals, payroll visibility, and Gemini AI assistance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bgPrimary text-textPrimary antialiased selection:bg-accent selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
