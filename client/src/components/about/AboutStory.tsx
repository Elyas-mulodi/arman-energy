'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function AboutStory() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
            درباره ما
          </p>
          <h2 className="mb-5 text-2xl font-black text-ink-900 md:text-3xl">
            تخصصی که از دل تجربه ساخته شده
          </h2>
          <div className="space-y-4 text-sm leading-7 text-ink-800/60">
            <p>
              آرمان انرژی فعالیت خودش رو با هدف ساده‌ای شروع کرد: در دسترس قرار دادن موتورهای
              کولر با کیفیت، اصیل و قیمت منصفانه برای همه — از تعمیرکار محله تا پیمانکاران بزرگ
              صنعتی.
            </p>
            <p>
              امروز با همکاری نزدیک با معتبرترین برندهای تولیدکننده، توانستیم مجموعه‌ای متنوع از
              موتورهای تک‌فاز و سه‌فاز رو با ضمانت اصالت کالا در اختیار مشتریانمون قرار بدیم.
            </p>
            <p>
              چیزی که ما رو متفاوت می‌کنه، نه فقط تنوع محصول، بلکه مشاوره‌ی تخصصی قبل از خریده —
              چون می‌دونیم انتخاب درست موتور، نصفِ کار درسته.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-ink-900">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute h-56 w-56 rounded-full border border-dashed border-ink-800"
            />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-900 shadow-2xl shadow-brand-500/30">
              <Zap className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}