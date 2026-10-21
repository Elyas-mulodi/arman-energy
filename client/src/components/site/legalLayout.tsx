import Link from "next/link";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
}

const otherPages = [
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
  { label: "شرایط بازگشت کالا", href: "/returns" },
  { label: "ارسال و تحویل", href: "/shipping" },
];

export default function LegalLayout({
  title,
  updatedAt,
  intro,
  sections,
}: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-black text-ink-900">{title}</h1>
      <p className="mt-1 text-xs text-ink-800/40">
        آخرین به‌روزرسانی: {updatedAt}
      </p>

      {intro && (
        <p className="mt-5 text-sm leading-7 text-ink-800/70">{intro}</p>
      )}

      <nav
        aria-label="فهرست مطالب"
        className="my-8 rounded-xl border border-ink-800/10 bg-white p-5"
      >
        <p className="mb-3 text-xs font-bold text-ink-800/50">فهرست مطالب</p>
        <ol className="space-y-1.5 text-sm">
          {sections.map((section, index) => (
            <li key={section.title}>
              <a
                href={`#section-${index + 1}`}
                className="text-ink-800/70 hover:text-brand-600"
              >
                {(index + 1).toLocaleString("fa-IR")}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section
            key={section.title}
            id={`section-${index + 1}`}
            className="scroll-mt-24"
          >
            <h2 className="mb-3 text-base font-black text-ink-900">
              {(index + 1).toLocaleString("fa-IR")}. {section.title}
            </h2>
            <div className="space-y-3 text-sm leading-7 text-ink-800/70">
              {section.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 pr-5">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-800/10 pt-6 text-xs">
        {otherPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="font-bold text-brand-600 hover:underline"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
