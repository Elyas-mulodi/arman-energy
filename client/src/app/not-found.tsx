import Link from 'next/link';
import { SearchX, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-ink-900 px-4 text-center">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative">
        <div className="mb-6 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
            <SearchX className="h-7 w-7" strokeWidth={1.75} />
          </span>
        </div>

        <p className="mb-2 font-mono text-xs tracking-widest text-ink-100/30" dir="ltr">
          ERROR CODE 404
        </p>

        <h1 className="mb-3 text-4xl font-black tracking-tight text-ink-100 sm:text-5xl">
          صفحه پیدا نشد
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-ink-100/50">
          صفحه‌ای که دنبالش می‌گردی حذف شده یا هیچ‌وقت وجود نداشته. شاید محصول موردنظرت
          دیگه موجود نیست یا آدرس اشتباهه.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            بازگشت به صفحه اصلی
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-ink-800 px-5 py-2.5 text-sm font-bold text-ink-100/80 transition hover:border-ink-700 hover:text-ink-100"
          >
            مشاهده محصولات
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-3 border-t border-ink-800 pt-5 text-right">
          {[
            { label: 'زمینه فعالیت', value: 'فروش موتور کولر' },
            { label: 'نوع تامین', value: 'عمده و خرده' },
            { label: 'ضمانت', value: 'اصالت کالا' },
          ].map((spec) => (
            <div key={spec.label}>
              <p className="text-[10px] uppercase tracking-widest text-ink-100/40">{spec.label}</p>
              <p className="mt-1 text-xs font-bold text-ink-100">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}