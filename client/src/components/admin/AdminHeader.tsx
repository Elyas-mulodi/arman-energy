'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-800/10 bg-white px-6">
      <div>
        <p className="text-xs text-ink-800/40">خوش آمدید،</p>
        <p className="text-sm font-bold text-ink-900">{user?.fullName}</p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-600">
        {user?.fullName?.charAt(0)}
      </div>
    </header>
  );
}