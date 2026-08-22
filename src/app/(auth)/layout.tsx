import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center p-4">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-accent text-white font-black text-xl flex items-center justify-center tracking-tighter shadow-sm">
            D
          </div>
          <span className="text-xl font-bold text-textPrimary tracking-tight">Dayflow</span>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white border border-borderSubtle rounded-modal p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
