'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, Package, MapPin, KeyRound } from 'lucide-react';

const tabs = [
  { id: 'info', label: 'اطلاعات شخصی', icon: UserCircle },
  { id: 'orders', label: 'سفارشات', icon: Package },
  { id: 'address', label: 'آدرس تحویل', icon: MapPin },
  { id: 'password', label: 'تغییر رمز', icon: KeyRound },
];

export default function ProfileTabs({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-ink-800/10 pb-px">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-bold transition-colors ${
              isActive ? 'text-brand-600' : 'text-ink-800/50 hover:text-ink-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {isActive && (
              <motion.span
                layoutId="profile-tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-500"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}