"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/config/site";
import Rivet from "@/components/ui/Rivet";

const quickLinks = [
  { label: "محصولات", href: "/products" },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

const legalLinks = [
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
  { label: "شرایط بازگشت کالا", href: "/returns" },
  { label: "ارسال و تحویل", href: "/shipping" },
];

const contactItems = [
  { icon: Phone, text: SITE.contact.phone, ltr: true },
  { icon: Mail, text: SITE.contact.email, ltr: true },
  {
    icon: MapPin,
    text: `${SITE.contact.address} | کد پستی: ${SITE.contact.postalCode}`,
    ltr: false,
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-100">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-sm border border-ink-800 p-8"
        >
          <div className="absolute left-3 top-3">
            <Rivet />
          </div>
          <div className="absolute right-3 top-3">
            <Rivet />
          </div>
          <div className="absolute bottom-3 left-3">
            <Rivet />
          </div>
          <div className="absolute bottom-3 right-3">
            <Rivet />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <h3 className="mb-2 text-xl font-black tracking-tight text-brand-500">
                {SITE.name}
              </h3>
              <p className="mb-6 text-sm leading-6 text-ink-100/60">
                {SITE.tagline}
              </p>

              <div className="grid grid-cols-3 gap-3 border-t border-ink-800 pt-4">
                {SITE.footerSpecs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-[10px] uppercase tracking-widest text-ink-100/40">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-xs font-bold text-ink-100">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {SITE.enamad.link && SITE.enamad.logo && (
                <a
                  href={SITE.enamad.link}
                  target="_blank"
                  rel="noopener"
                  referrerPolicy="origin"
                  className="mt-5 inline-block"
                >
                  {/* لوگوی اینماد از دامنه‌ی خودشون لود میشه */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SITE.enamad.logo}
                    alt="نماد اعتماد الکترونیکی"
                    referrerPolicy="origin"
                    className="h-16 w-auto rounded bg-white p-1"
                  />
                </a>
              )}
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-widest text-ink-100/40">
                دسترسی سریع
              </p>
              <ul className="mb-6 flex flex-col gap-3 text-sm text-ink-100/70">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mb-4 text-[10px] uppercase tracking-widest text-ink-100/40">
                قوانین
              </p>
              <ul className="flex flex-col gap-3 text-sm text-ink-100/70">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-widest text-ink-100/40">
                راه ارتباطی
              </p>
              <ul className="flex flex-col gap-3 text-sm text-ink-100/70">
                {contactItems.map((item) => (
                  <li key={item.text} className="flex items-start gap-2">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <span dir={item.ltr ? "ltr" : "rtl"}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 text-center text-xs text-ink-100/40">
          ©{" "}
          {new Date()
            .getFullYear()
            .toLocaleString("fa-IR", { useGrouping: false })}{" "}
          {SITE.name} — تمام حقوق محفوظ است
        </div>
      </div>
    </footer>
  );
}
