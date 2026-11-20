'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  PackageSearch,
  RefreshCw,
  Search,
  Tag,
  X,
} from 'lucide-react';
import axios from 'axios';
import api from '@/lib/axios';
import { Product, ProductListResponse } from '@/types/product';
import { useDebounce } from '@/hooks/useDebounce';
import ProductCard from '@/components/site/ProductCard';
import ProductFilters from '@/components/site/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

const PAGE_SIZE = 12;

function ProductsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="در حال بارگذاری"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5"
    >
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-ink-800/10 bg-white"
        >
          <div className="aspect-square animate-pulse bg-ink-800/5" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-3/4 animate-pulse rounded bg-ink-800/5" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800/5" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-ink-800/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Chip({
  icon: Icon,
  children,
  onRemove,
}: {
  icon: typeof Search;
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 py-1 pl-1.5 pr-3 text-xs font-bold text-ink-900">
      <Icon className="h-3.5 w-3.5 text-brand-500" />
      <span className="max-w-[10rem] truncate">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="حذف فیلتر"
        className="flex h-5 w-5 items-center justify-center rounded-full text-ink-800/60 transition hover:bg-ink-800/10 hover:text-ink-900"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );
  const [attempt, setAttempt] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  const debouncedSearch = useDebounce(search, 500);

  // ریست صفحه داخل هندلرها انجام می‌شه تا درخواست اضافه (و از دست رفتن page از URL) نداشته باشیم
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setSearch('');
    setSelectedCategory('');
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setStatus('loading');
      try {
        const { data } = await api.get<ProductListResponse>('/products', {
          signal: controller.signal,
          params: {
            page: currentPage,
            limit: PAGE_SIZE,
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(selectedCategory && { category: selectedCategory }),
          },
        });

        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalCount(
          (data.pagination as { total?: number } | undefined)?.total ?? null
        );
        setStatus('success');

        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (selectedCategory) params.set('category', selectedCategory);
        if (currentPage > 1) params.set('page', String(currentPage));
        const qs = params.toString();
        window.history.replaceState(null, '', qs ? `/products?${qs}` : '/products');
      } catch (error) {
        if (axios.isCancel(error) || (error as { code?: string })?.code === 'ERR_CANCELED')
          return;
        setStatus('error');
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [currentPage, debouncedSearch, selectedCategory, attempt]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const hasFilters = Boolean(debouncedSearch || selectedCategory);

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
          className="pointer-events-none absolute -top-28 right-0 h-64 w-[34rem] rounded-full bg-brand-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <nav
                aria-label="مسیر صفحه"
                className="mb-5 flex items-center gap-1.5 text-xs text-ink-100/50"
              >
                <Link href="/" className="transition hover:text-brand-500">
                  خانه
                </Link>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="text-ink-100/80">محصولات</span>
              </nav>

              <h1 className="text-3xl font-black text-white md:text-4xl">
                فروشگاه <span className="text-brand-500">موتور کولر</span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-8 text-ink-100/60">
                انواع موتور کولر و قطعات مرتبط؛ فیلتر کن، مقایسه کن و محصول مناسب
                خودت رو انتخاب کن.
              </p>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-ink-800 bg-white/5 px-4 py-2.5 text-sm font-bold text-ink-100 transition hover:border-brand-500 hover:text-brand-500 md:self-auto"
            >
              مشاهده‌ی دسته‌بندی‌ها
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* محتوا */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <aside className="md:w-72 md:shrink-0">
            <div className="md:sticky md:top-24">
              <ProductFilters
                search={search}
                onSearchChange={handleSearchChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            {/* نوار ابزار */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-800/10 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black text-ink-900">
                  {hasFilters ? 'نتایج فیلتر' : 'همه‌ی محصولات'}
                </span>
                {status === 'success' && totalCount !== null && (
                  <span className="text-xs text-ink-800/60">
                    ({totalCount.toLocaleString('fa-IR')} محصول)
                  </span>
                )}
              </div>

              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  {debouncedSearch && (
                    <Chip icon={Search} onRemove={() => handleSearchChange('')}>
                      {debouncedSearch}
                    </Chip>
                  )}
                  {selectedCategory && (
                    <Chip icon={Tag} onRemove={() => handleCategoryChange('')}>
                      دسته‌بندی انتخاب‌شده
                    </Chip>
                  )}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-bold text-ink-800/60 underline-offset-4 transition hover:text-brand-500 hover:underline"
                  >
                    پاک کردن همه
                  </button>
                </div>
              )}
            </div>

            {status === 'loading' && <ProductsSkeleton />}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <EmptyState
                  icon={AlertTriangle}
                  title="مشکلی در دریافت محصولات پیش آمد"
                  description="لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید"
                />
                <button
                  type="button"
                  onClick={() => setAttempt((n) => n + 1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  <RefreshCw className="h-4 w-4" />
                  تلاش دوباره
                </button>
              </div>
            )}

            {status === 'success' && products.length === 0 && (
              <div className="flex flex-col items-center gap-4">
                <EmptyState
                  icon={PackageSearch}
                  title="محصولی یافت نشد"
                  description="فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید"
                />
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-lg border border-ink-800/15 bg-white px-5 py-2.5 text-sm font-bold text-ink-900 transition hover:border-brand-500 hover:text-brand-500"
                  >
                    پاک کردن فیلترها
                  </button>
                )}
              </div>
            )}

            {status === 'success' && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: 'easeOut',
                        delay: Math.min(index * 0.03, 0.3),
                      }}
                      className="transition-transform duration-300 hover:-translate-y-1"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10">
          <ProductsSkeleton />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}