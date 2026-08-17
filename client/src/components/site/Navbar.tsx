'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

const navLinks = [
  { label: 'محصولات', href: '/products' },
  { label: 'دسته‌بندی‌ها', href: '/categories' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const itemCount = useCartStore((state) => state.itemCount);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-ink-800 bg-ink-900/85 backdrop-blur-md'
          : 'border-transparent bg-ink-900'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* لوگو */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight text-ink-100">
            آرمان<span className="text-brand-500"> انرژی</span>
          </span>
        </Link>

        {/* نویگیشن دسکتاپ */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-500' : 'text-ink-100/70 hover:text-ink-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md bg-brand-500/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* اکشن‌ها */}
        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-100/80 transition-colors hover:bg-ink-800 hover:text-ink-100"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link
            href={user ? '/profile' : '/login'}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-100/80 transition-colors hover:bg-ink-800 hover:text-ink-100"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>

          <div className="mx-1 h-5 w-px bg-ink-800 md:hidden" />

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-100/80 transition-colors hover:bg-ink-800 hover:text-ink-100 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="باز کردن منو"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-ink-800 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                      pathname === link.href
                        ? 'bg-brand-500/10 text-brand-500'
                        : 'text-ink-100/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}