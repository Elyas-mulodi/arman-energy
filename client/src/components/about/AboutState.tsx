'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 500, suffix: '+', label: 'محصول متنوع' },
  { value: 15, suffix: '+', label: 'سال سابقه فعالیت' },
  { value: 3000, suffix: '+', label: 'مشتری راضی' },
  { value: 98, suffix: '%', label: 'رضایت مشتریان' },
];

export default function AboutStats() {
  return (
    <section className="bg-ink-900 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
          >
            <p className="mb-1 text-3xl font-black text-brand-500 md:text-4xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs text-ink-100/50 md:text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}