'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const plateSpecs = [
  { label: 'زمینه فعالیت', value: 'فروش موتور کولر' },
  { label: 'نوع تامین', value: 'عمده و خرده' },
  { label: 'ضمانت', value: 'اصالت کالا' },
];

const quickLinks = [
  { label: 'محصولات', href: '/products' },
  { label: 'دسته‌بندی‌ها', href: '/categories' },
  { label: 'درباره ما', href: '/about' },
];

const contactItems = [
  { icon: Phone, text: '021-00000000' },
  { icon: Mail, text: 'info@armanenergy.ir' },
  { icon: MapPin, text: 'تهران، ایران' },
];

function Rivet() {
  return (
    <div className="h-2 w-2 rounded-full bg-ink-700">
      <div className="mt-[3px] ml-[1px] h-[1px] w-1 bg-ink-900/50" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-100">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-sm border border-ink-800 p-8"
        >
          <div className="absolute left-3 top-3"><Rivet /></div>
          <div className="absolute right-3 top-3"><Rivet /></div>
          <div className="absolute bottom-3 left-3"><Rivet /></div>
          <div className="absolute bottom-3 right-3"><Rivet /></div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <h3 className="mb-2 text-xl font-black tracking-tight text-brand-500">
                آرمان انرژی
              </h3>
              <p className="mb-6 text-sm leading-6 text-ink-100/60">
                تامین‌کننده‌ی تخصصی انواع موتور کولر آبی با تضمین کیفیت.
              </p>

              <div className="grid grid-cols-3 gap-3 border-t border-ink-800 pt-4">
                {plateSpecs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-[10px] uppercase tracking-widest text-ink-100/40">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-xs font-bold text-ink-100">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-widest text-ink-100/40">
                دسترسی سریع
              </p>
              <ul className="flex flex-col gap-3 text-sm text-ink-100/70">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-brand-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-widest text-ink-100/40">
                راه ارتباطی
              </p>
              <ul className="flex flex-col gap-3 text-sm text-ink-100/70">
                {contactItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-brand-500" />
                    <span dir="ltr">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-ink-100/40 md:flex-row">
          <span>© {new Date().getFullYear()} آرمان انرژی — تمام حقوق محفوظ است</span>
          <span className="font-mono" dir="ltr">AE-ENERGY-SYS</span>
        </div>
      </div>
    </footer>
  );
}