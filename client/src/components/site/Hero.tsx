"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, Zap } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

const floatingBadges = [
  { icon: ShieldCheck, label: "ضمانت اصالت", position: "top-10 -left-6" },
  { icon: Truck, label: "ارسال سراسری", position: "bottom-16 -left-10" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* گرید بلوپرینت پس‌زمینه */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* نور محو برند در پس‌زمینه */}
      <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        {/* متن */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-800/50 px-3 py-1.5 text-xs text-ink-100/70">
            <Zap className="h-3.5 w-3.5 text-brand-500" />
            تامین‌کننده‌ی رسمی موتور کولر آبی
          </div>

          <h1 className="mb-5 text-4xl font-black leading-[1.25] text-ink-100 md:text-5xl">
            موتور کولرت رو
            <br />
            با <span className="text-brand-500">اطمینان</span> انتخاب کن
          </h1>

          <p className="mb-8 max-w-md text-sm leading-7 text-ink-100/60 md:text-base">
            انواع موتور کولر با ولتاژها و توان‌های مختلف، اصالت‌سنجی‌شده و
            آماده‌ی ارسال به سراسر کشور. از انتخاب تا نصب، کنارتیم.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/categories"
              className="rounded-md border border-ink-800 px-6 py-3 text-sm font-bold text-ink-100 transition hover:bg-ink-800"
            >
              دسته‌بندی‌ها
            </Link>
          </div>
          {/* بعد از div دکمه‌ها */}
          <div className="mt-10 flex gap-8 border-t border-ink-800 pt-6">
            <div>
              <p className="text-2xl font-black text-white">
                <AnimatedCounter value={500} suffix="+" />
              </p>
              <p className="text-xs text-ink-100/40">محصول متنوع</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                <AnimatedCounter value={15} suffix="+" />
              </p>
              <p className="text-xs text-ink-100/40">سال سابقه</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                <AnimatedCounter value={98} suffix="%" />
              </p>
              <p className="text-xs text-ink-100/40">رضایت مشتری</p>
            </div>
          </div>
        </motion.div>

        {/* بصری سمت راست */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative hidden md:block"
        >
          <div className="relative mx-auto flex h-80 w-80 items-center justify-center">
            {/* حلقه‌های دوار */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-ink-800"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-ink-800"
            />

            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-900 shadow-2xl shadow-brand-500/30">
              <Zap className="h-16 w-16 text-white" strokeWidth={1.5} />
            </div>

            {floatingBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                className={`absolute ${badge.position} flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900 px-3 py-2 shadow-lg`}
              >
                <badge.icon className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-bold text-ink-100 whitespace-nowrap">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
