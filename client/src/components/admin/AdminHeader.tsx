'use client';

import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminUIStore } from '@/store/useAdminUIStore';

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const toggleSidebar = useAdminUIStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-800/10 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-800/60 hover:bg-ink-100 lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-xs text-ink-800/40">خوش آمدید،</p>
          <p className="text-sm font-bold text-ink-900">{user?.fullName}</p>
        </div>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-600">
        {user?.fullName?.charAt(0)}
      </div>
    </header>
  );
}