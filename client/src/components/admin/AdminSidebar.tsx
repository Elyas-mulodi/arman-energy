'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'داشبورد', href: '/admin', icon: LayoutDashboard },
  { label: 'محصولات', href: '/admin/products', icon: Package },
  { label: 'دسته‌بندی‌ها', href: '/admin/categories', icon: FolderTree },
  { label: 'سفارشات', href: '/admin/orders', icon: ShoppingCart },
  { label: 'کاربران', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-ink-800 bg-ink-900">
      <div className="flex h-16 items-center gap-2 border-b border-ink-800 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
          <Zap className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-sm font-black tracking-tight text-ink-100">
          پنل مدیریت
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          // آیتم "داشبورد" فقط دقیقا روی /admin فعال باشه، بقیه با startsWith چک بشن
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-ink-100/60 hover:text-ink-100'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-md bg-brand-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative h-4 w-4" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-800 p-4">
        <Link
          href="/"
          className="block text-center text-xs text-ink-100/40 transition hover:text-ink-100/70"
        >
          بازگشت به سایت
        </Link>
      </div>
    </aside>
  );
}