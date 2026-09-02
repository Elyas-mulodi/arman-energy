'use client';

import { motion } from 'framer-motion';
import { Search, MessageCircle, Package, Truck } from 'lucide-react';

const steps = [
  { icon: Search, title: 'انتخاب محصول', desc: 'موتور مناسب کولرت رو از بین دسته‌بندی‌ها پیدا کن' },
  { icon: MessageCircle, title: 'مشاوره (در صورت نیاز)', desc: 'با کارشناسان ما در ارتباط باش تا مطمئن بشی' },
  { icon: Package, title: 'ثبت و پرداخت سفارش', desc: 'خرید امن با درگاه پرداخت آنلاین' },
  { icon: Truck, title: 'ارسال به درب منزل', desc: 'بسته‌بندی مطمئن و ارسال سریع به سراسر کشور' },
];

export default function AboutProcess() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
            مسیر خرید
          </p>
          <h2 className="text-2xl font-black text-ink-900 md:text-3xl">
            از انتخاب تا تحویل، چهار قدم ساده
          </h2>
        </motion.div> 

        <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* خط اتصال بین مراحل - فقط دسکتاپ */}
          <div className="absolute right-0 top-6 hidden h-px w-full bg-ink-800/10 lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-right"
            >
              <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-500 bg-white text-brand-500">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-1 text-sm font-bold text-ink-900">{step.title}</h3>
              <p className="text-xs leading-6 text-ink-800/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}