import { Phone, Mail, MapPin } from 'lucide-react';
import { SITE } from '@/config/site';
import ContactForm from '@/components/contact/ContactForm';

const contactItems = [
  {
    key: 'phone',
    icon: Phone,
    label: 'تلفن',
    value: SITE.contact.phone,
    href: `tel:${SITE.contact.phone}`,
    ltr: true,
  },
  {
    key: 'email',
    icon: Mail,
    label: 'ایمیل',
    value: SITE.contact.email,
    href: `mailto:${SITE.contact.email}`,
    ltr: true,
  },
  {
    key: 'address',
    icon: MapPin,
    label: 'آدرس',
    value: SITE.contact.address,
    extra: `کد پستی: ${SITE.contact.postalCode}`,
    ltr: false,
  },
];

export default function ContactPage() {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
      {/* پنل اطلاعات تماس */}
      <section className="flex items-center bg-ink-900 px-6 py-12 text-ink-100 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-black text-brand-500">تماس با ما</h1>
          <p className="mt-4 text-sm leading-7 text-ink-100/60">
            سوال، پیشنهاد یا مشکلی داری؟ پیامت رو بفرست یا از راه‌های زیر با
            ما در ارتباط باش.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {contactItems.map((item) => {
              const content = (
                <>
                  <span
                    dir={item.ltr ? 'ltr' : 'rtl'}
                    className="block break-all text-right text-sm leading-6 text-ink-100"
                  >
                    {item.value}
                  </span>
                  {item.extra && (
                    <span className="mt-1 block text-xs leading-6 text-ink-100/50">
                      {item.extra}
                    </span>
                  )}
                </>
              );

              return (
                <li key={item.key} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-800 bg-ink-800/40 text-brand-500">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-bold text-ink-100/50">
                      {item.label}
                    </p>
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
      </section>

      {/* فرم */}
      <section className="flex items-center justify-center bg-ink-100 px-6 py-12">
        <div className="w-full max-w-md rounded-xl border border-ink-800/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-1 text-lg font-black text-ink-900">
            ارسال پیام
          </h2>
          <p className="mb-6 text-sm text-ink-800/60">
            فرم زیر رو پر کن، در اولین فرصت پاسخ می‌دیم.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}