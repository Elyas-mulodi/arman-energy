'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ReactNode } from 'react';

const specs = [
  { label: 'ولتاژ', value: '220V / 380V' },
  { label: 'ضمانت', value: 'اصالت کالا' },
  { label: 'ارسال', value: 'سراسر کشور' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 md:flex">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight text-ink-100">
            آرمان<span className="text-brand-500"> انرژی</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <h2 className="mb-3 text-3xl font-black leading-tight text-ink-100">
            تامین‌کننده‌ی تخصصی
            <br />
            موتور کولر آبی
          </h2>
          <p className="mb-8 text-sm leading-6 text-ink-100/50">
            با ثبت‌نام در آرمان انرژی به سریع‌ترین مسیر تامین قطعات موتور کولر دسترسی پیدا کنید.
          </p>

          <div className="grid grid-cols-3 gap-3 border-t border-ink-800 pt-5">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-[10px] uppercase tracking-widest text-ink-100/40">
                  {spec.label}
                </p>
                <p className="mt-1 text-xs font-bold text-ink-100">{spec.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative font-mono text-xs text-ink-100/30" dir="ltr">
          AE-ENERGY-SYS
        </p>
      </div>

      {/* فرم */}
      <div className="flex items-center justify-center bg-ink-100 px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}