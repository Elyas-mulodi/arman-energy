'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-brand-500/20 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"
        >
          <Zap className="h-6 w-6" strokeWidth={2} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-3xl font-black text-ink-100 md:text-5xl"
        >
          داستان <span className="text-brand-500">آرمان انرژی</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm leading-7 text-ink-100/60 md:text-base"
        >
          از یک کارگاه کوچک تا یکی از تامین‌کنندگان قابل‌اعتماد موتور کولر در کشور؛ داستان ما،
          داستان تعهد به کیفیت و صداقت با مشتریه.
        </motion.p>
      </div>
    </section>
  );
}