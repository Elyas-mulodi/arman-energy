"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/config/site";
import Rivet from "@/components/ui/Rivet";

const DEVELOPER = {
  name: "ELyas Moludi",
  phone: "09010708833",
};

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
  {
    key: "phone",
    icon: Phone,
    text: SITE.contact.phone,
    href: `tel:${SITE.contact.phone}`,
    ltr: true,
  },
  {
    key: "email",
    icon: Mail,
    text: SITE.contact.email,
    href: `mailto:${SITE.contact.email}`,
    ltr: true,
  },
  {
    key: "address",
    icon: MapPin,
    text: SITE.contact.address,
    extra: `کد پستی: ${SITE.contact.postalCode}`,
    ltr: false,
  },
];

// سال شمسی با ارقام فارسی؛ locale و timezone ثابت تا hydration mismatch نداشته باشیم
const currentYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  year: "numeric",
  timeZone: "Asia/Tehran",
}).format(new Date());

const labelClass = "mb-4 text-xs font-bold text-ink-100/50";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="mt-auto border-t border-ink-800 bg-ink-900 text-ink-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-xl border border-ink-800 px-6 py-10 md:p-10"
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

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:gap-12">
            {/* برند */}
            <div>
              <h3 className="mb-3 text-2xl font-black text-brand-500">
                {SITE.name}
              </h3>
              <p className="mb-6 text-sm leading-7 text-ink-100/60">
                {SITE.tagline}
              </p>

              <div className="grid grid-cols-3 gap-3 border-t border-ink-800 pt-5">
                {SITE.footerSpecs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xs text-ink-100/50">{spec.label}</p>
                    <p className="mt-1 text-sm font-bold text-ink-100">
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
                  className="mt-6 inline-block"
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

            {/* لینک‌ها */}
            <div>
              <p className={labelClass}>دسترسی سریع</p>
              <ul className="mb-8 flex flex-col gap-3 text-sm text-ink-100/70">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block transition hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className={labelClass}>قوانین</p>
              <ul className="flex flex-col gap-3 text-sm text-ink-100/70">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block transition hover:text-brand-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* تماس */}
            <div>
              <p className={labelClass}>راه ارتباطی</p>
              <ul className="flex flex-col gap-4 text-sm text-ink-100/70">
                {contactItems.map((item) => {
                  const content = (
                    <>
                      <span
                        dir={item.ltr ? "ltr" : "rtl"}
                        className="block break-all text-right leading-6"
                      >
                        {item.text}
                      </span>
                      {item.extra && (
                        <span className="mt-1 block leading-6 text-ink-100/50">
                          {item.extra}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={item.key} className="flex items-start gap-3">
                      <item.icon className="mt-1 h-4 w-4 shrink-0 text-brand-500" />
                      <div className="min-w-0">
                        {item.href ? (
                          <a
                            href={item.href}
                            className="transition hover:text-brand-500"
                          >
                            {content}
                          </a>
                        ) : (
                          content
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* نوار پایین */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-ink-100/50 md:flex-row">
          <p>
            © {currentYear} {SITE.name} — تمام حقوق محفوظ است
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span>طراحی و توسعه: {DEVELOPER.name}</span>
            <span aria-hidden="true">•</span>
            <a
              href={`tel:${DEVELOPER.phone}`}
              dir="ltr"
              className="transition hover:text-brand-500"
            >
              {DEVELOPER.phone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}