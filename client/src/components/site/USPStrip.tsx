'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headset, BadgePercent } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'ضمانت اصالت', desc: 'تمام محصولات اورجینال' },
  { icon: Truck, title: 'ارسال سریع', desc: 'به سراسر کشور' },
  { icon: Headset, title: 'پشتیبانی تخصصی', desc: 'مشاوره قبل از خرید' },
  { icon: BadgePercent, title: 'قیمت رقابتی', desc: 'مناسب برای عمده و خرده' },
];

export default function USPStrip() {
  return (
    <section className="border-b border-ink-800/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900">{item.title}</p>
              <p className="text-xs text-ink-800/50">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}