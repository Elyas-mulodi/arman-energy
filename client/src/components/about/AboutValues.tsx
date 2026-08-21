'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Users, Award, Clock } from 'lucide-react';

const values = [
  {
    icon: ShieldCheck,
    title: 'اصالت و شفافیت',
    desc: 'تمام محصولات ما دارای ضمانت اصالت هستن و هیچ تعارفی تو کیفیت کالا نداریم.',
  },
  {
    icon: Users,
    title: 'مشتری‌مداری واقعی',
    desc: 'مشاوره‌ی تخصصی قبل از خرید، حتی اگه به فروش هم نرسیم، برامون اولویته.',
  },
  {
    icon: Award,
    title: 'تخصص فنی',
    desc: 'تیم ما با سال‌ها تجربه در صنعت موتور، دقیق‌ترین راهنمایی رو بهت میده.',
  },
  {
    icon: Clock,
    title: 'ارسال سریع و مطمئن',
    desc: 'سفارشات در کوتاه‌ترین زمان ممکن بسته‌بندی و ارسال میشن.',
  },
];

export default function AboutValues() {
  return (
    <section className="bg-ink-100 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
            ارزش‌های ما
          </p>
          <h2 className="text-2xl font-black text-ink-900 md:text-3xl">چرا آرمان انرژی؟</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-xl border border-ink-800/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/5"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-2 text-sm font-bold text-ink-900">{value.title}</h3>
              <p className="text-xs leading-6 text-ink-800/50">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}