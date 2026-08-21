'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock , Send } from 'lucide-react';
import { useBusinessStatus } from '@/hooks/useBusinessStatus';

const readouts = [
  { icon: Phone, label: 'تماس مستقیم', value: '021-00000000', dir: 'ltr' as const },
  { icon: Mail, label: 'ایمیل پشتیبانی', value: 'info@armanenergy.ir', dir: 'ltr' as const },
  { icon: MapPin, label: 'آدرس دفتر مرکزی', value: 'تهران، خیابان ولیعصر، پلاک ۰۰۰', dir: 'rtl' as const },
  { icon: Clock, label: 'ساعات کاری', value: 'شنبه تا پنج‌شنبه، ۹ الی ۲۰', dir: 'rtl' as const },
];

const socials = [
  { icon: Send, href: '#', label: 'تلگرام' },
];

export default function ContactInfoPanel() {
  const { isOpen, label } = useBusinessStatus();

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-ink-900 p-8 md:p-12">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-2xl font-black text-ink-100 md:text-3xl">در تماس باشیم</h1>
          <p className="mb-6 max-w-sm text-sm leading-6 text-ink-100/50">
            سوالی درباره‌ی محصولات داری یا نیاز به مشاوره‌ی فنی داری؟ تیم ما آماده‌ی پاسخگوییه.
          </p>
        </motion.div>

        {/* نشانگر وضعیت زنده */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-800/40 px-3 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isOpen ? 'animate-ping bg-emerald-400' : 'bg-ink-100/20'
              } opacity-75`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isOpen ? 'bg-emerald-400' : 'bg-ink-100/40'
              }`}
            />
          </span>
          <span className="text-xs font-bold text-ink-100/80">{label}</span>
        </motion.div>

        {/* قرائت‌گرها */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {readouts.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              className="rounded-lg border border-ink-800 bg-ink-800/20 p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-ink-100/40">
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-sm font-bold text-ink-100" dir={item.dir}>
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* شبکه‌های اجتماعی */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="relative flex items-center gap-3"
      >
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-800 text-ink-100/60 transition hover:border-brand-500 hover:text-brand-500"
          >
            <social.icon className="h-4 w-4" />
          </a>
        ))}
      </motion.div>
    </div>
  );
}