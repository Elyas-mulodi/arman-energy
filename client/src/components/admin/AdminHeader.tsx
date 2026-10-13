'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch {
      toast.error('خطا در خروج از حساب');
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-800/10 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-800/70 hover:bg-ink-800/5 lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-[11px] text-ink-800/40">خوش آمدید،</p>
          <p className="text-sm font-bold text-ink-900">{user?.fullName ?? '—'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-600 sm:flex">
          {user?.fullName?.charAt(0)}
        </span>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 rounded-md border border-ink-800/10 px-3 py-2 text-xs font-bold text-ink-800/60 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}