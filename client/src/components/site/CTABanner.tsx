'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Headset } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="bg-ink-100 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-2xl bg-ink-900 px-8 py-14 text-center md:flex-row md:justify-between md:text-right"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
            <Headset className="h-5 w-5" />
          </div>
          <h3 className="mb-2 text-2xl font-black text-white">
            نمی‌دونی کدوم موتور مناسب کولرته؟
          </h3>
          <p className="max-w-md text-sm text-ink-100/60">
            کارشناسان ما رایگان راهنماییت می‌کنن تا دقیق‌ترین انتخاب رو داشته باشی.
          </p>
        </div>

        <Link
          href="/contact"
          className="group relative flex shrink-0 items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          تماس با کارشناس
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}