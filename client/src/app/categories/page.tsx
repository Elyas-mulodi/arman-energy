'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  LayoutGrid,
  Phone,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import api from '@/lib/axios';
import { Category } from '@/types/category';
import CategoryCard from '@/components/site/CategoryCard';
import EmptyState from '@/components/ui/EmptyState';

type Status = 'loading' | 'success' | 'error';

// پاسخ API ممکنه آرایه‌ی مستقیم یا داخل یک آبجکت باشه
function extractCategories(data: unknown): Category[] {
  if (Array.isArray(data)) return data as Category[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.categories)) return obj.categories as Category[];
    if (Array.isArray(obj.data)) return obj.data as Category[];
  }
  return [];
}

// یکسان‌سازی ی/ک عربی و فارسی برای جستجو
function normalize(text: string) {
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .toLowerCase()
    .trim();
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-800/10 bg-white">
      <div className="h-32 animate-pulse bg-ink-800/5" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-ink-800/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800/5" />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/categories', { signal: controller.signal })
      .then((res) => {
        setCategories(extractCategories(res.data));
        setStatus('success');
      })
      .catch((error) => {
        if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return;
        setStatus('error');
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  };

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return categories;
    return categories.filter((c) => normalize(c.name ?? '').includes(q));
  }, [categories, query]);

  const hasCategories = status === 'success' && categories.length > 0;

  return (
    <div className="bg-ink-100/40">
      {/* هیرو */}
      <section className="relative overflow-hidden bg-ink-900 text-ink-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <nav
              aria-label="مسیر صفحه"
              className="mb-6 flex items-center gap-1.5 text-xs text-ink-100/50"
            >
              <Link href="/" className="transition hover:text-brand-500">
                خانه
              </Link>
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="text-ink-100/80">دسته‌بندی‌ها</span>
            </nav>

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  دسته‌بندی <span className="text-brand-500">محصولات</span>
                </h1>
                <p className="mt-4 text-sm leading-8 text-ink-100/60 md:text-base">
                  موتور کولر و قطعات مرتبط رو بر اساس نیازت پیدا کن؛ از
                  دسته‌بندی مناسب شروع کن و سریع‌تر به محصول مورد نظرت برس.
                </p>
              </div>

              {hasCategories && (
                <div className="flex items-center gap-4 self-start rounded-xl border border-ink-800 bg-white/5 px-5 py-4 backdrop-blur md:self-auto">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/15 text-brand-500">
                    <LayoutGrid className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-black text-white">
                      {categories.length.toLocaleString('fa-IR')}
                    </p>
                    <p className="text-xs text-ink-100/50">دسته‌بندی فعال</p>
                  </div>
                </div>
              )}
            </div>

            {hasCategories && (
              <div className="relative mt-8 max-w-md">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-100/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در دسته‌بندی‌ها..."
                  aria-label="جستجو در دسته‌بندی‌ها"
                  className="w-full rounded-xl border border-ink-800 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder:text-ink-100/40 outline-none transition focus:border-brand-500 focus:bg-white/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="پاک کردن جستجو"
                    className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-100/50 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* محتوا */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {status === 'loading' && (
          <div
            aria-busy="true"
            aria-label="در حال بارگذاری"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <EmptyState
              icon={AlertTriangle}
              title="مشکلی در دریافت دسته‌بندی‌ها پیش آمد"
              description="لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید"
            />
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" />
              تلاش دوباره
            </button>
          </div>
        )}

        {status === 'success' && categories.length === 0 && (
          <EmptyState
            icon={LayoutGrid}
            title="هنوز دسته‌بندی‌ای ثبت نشده"
            description="به‌زودی دسته‌بندی‌های جدید اضافه می‌شوند"
          />
        )}

        {hasCategories && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4">
            <EmptyState
              icon={Search}
              title="دسته‌بندی‌ای با این عنوان پیدا نشد"
              description="عبارت دیگه‌ای رو امتحان کن یا جستجو رو پاک کن"
            />
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg border border-ink-800/15 bg-white px-5 py-2.5 text-sm font-bold text-ink-900 transition hover:border-brand-500 hover:text-brand-500"
            >
              پاک کردن جستجو
            </button>
          </div>
        )}

        {hasCategories && filtered.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-black text-ink-900">
                {query ? 'نتایج جستجو' : 'همه‌ی دسته‌بندی‌ها'}
              </h2>
              <span className="text-xs text-ink-800/60">
                {filtered.length.toLocaleString('fa-IR')} مورد
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {filtered.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: 'easeOut',
                    delay: Math.min(index * 0.04, 0.4),
                  }}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>

            {/* دعوت به تماس */}
            <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-xl border border-ink-800/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
              <div>
                <h3 className="text-lg font-black text-ink-900">
                  دنبال محصول خاصی هستی؟
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-800/60">
                  اگه مطمئن نیستی کدوم دسته‌بندی یا مدل مناسب توئه، با کارشناس‌های
                  ما صحبت کن.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
              >
                <Phone className="h-4 w-4" />
                تماس با ما
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}