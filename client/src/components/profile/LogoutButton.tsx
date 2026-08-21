'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('با موفقیت خارج شدید');
      router.push('/');
    } catch {
      toast.error('خطا در خروج از حساب');
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-1.5 rounded-md border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {isLoggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
      خروج از حساب
    </button>
  );
}