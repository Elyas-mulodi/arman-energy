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
  const [confirming, setConfirming] = useState(false);

  const handleLogout = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('با موفقیت خارج شدید');
      router.push('/');
    } catch {
      toast.error('خطا در خروج از حساب');
      setIsLoggingOut(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      onBlur={() => setConfirming(false)}
      disabled={isLoggingOut}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
        confirming
          ? 'border-red-500 bg-red-500 text-white'
          : 'border-red-500/20 text-red-400 hover:bg-red-500/10'
      }`}
    >
      {isLoggingOut ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      {confirming ? 'مطمئنی؟ دوباره بزن' : 'خروج از حساب'}
    </button>
  );
}