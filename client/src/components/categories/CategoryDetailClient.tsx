'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertTriangle, FolderX, PackageSearch, ChevronLeft, Zap } from 'lucide-react';
import api from '@/lib/axios';
import { Category } from '@/types/category';
import { Product, ProductListResponse } from '@/types/product';
import { getImageUrl, normalizeSlug } from '@/lib/utils';
import ProductCard from '@/components/site/ProductCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

const PAGE_SIZE = 12;

type CategoryStatus = 'loading' | 'success' | 'error' | 'not-found';
type ProductsStatus = 'loading' | 'success' | 'error';

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-ink-800/10">
          <div className="aspect-square animate-pulse bg-ink-800/5" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-ink-800/5" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryDetailClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus>('loading');
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsStatus, setProductsStatus] = useState<ProductsStatus>('loading');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // مرحله ۱: خود دسته‌بندی + زیردسته‌هاش
  useEffect(() => {
    const controller = new AbortController();

    const fetchCategory = async () => {
      setCategoryStatus('loading');
      try {
        const [categoryRes, allRes] = await Promise.all([
          api.get<Category>(`/categories/${normalizeSlug(slug)}`, { signal: controller.signal }),
          api.get<Category[]>('/categories', { signal: controller.signal }),
        ]);

        setCategory(categoryRes.data);
        setSubCategories(allRes.data.filter((c) => c.parent === categoryRes.data._id));
        setCategoryStatus('success');
      } catch (error) {
        if (axios.isCancel(error)) return;
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setCategoryStatus('not-found');
        } else {
          setCategoryStatus('error');
        }
      }
    };

    fetchCategory();
    return () => controller.abort();
  }, [slug]);

  // مرحله ۲: محصولات این دسته (فقط بعد از اینکه دسته‌بندی لود شد)
  const categoryId = category?._id;

  useEffect(() => {
    if (!categoryId) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      setProductsStatus('loading');
      try {
        const { data } = await api.get<ProductListResponse>('/products', {
          signal: controller.signal,
          params: { category: categoryId, page: currentPage, limit: PAGE_SIZE },
        });
        setProducts(data.products);
        setTotalPages(data.pagination.pages || 1);
        setProductsStatus('success');
      } catch (error) {
        if (axios.isCancel(error)) return;
        setProductsStatus('error');
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [categoryId, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (categoryStatus === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 h-48 animate-pulse rounded-xl bg-ink-800/5" />
        <ProductsSkeleton />
      </div>
    );
  }

  if (categoryStatus === 'not-found') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          icon={FolderX}
          title="دسته‌بندی مورد نظر یافت نشد"
          description="ممکن است این دسته‌بندی حذف شده یا آدرس اشتباه باشد"
        />
      </div>
    );
  }

  if (categoryStatus === 'error' || !category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          icon={AlertTriangle}
          title="مشکلی در دریافت اطلاعات پیش آمد"
          description="لطفا دوباره تلاش کنید"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* مسیر ناوبری */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink-800/40">
        <Link href="/categories" className="hover:text-brand-600">
          دسته‌بندی‌ها
        </Link>
        <ChevronLeft className="h-3 w-3" />
        <span className="text-ink-800/70">{category.name}</span>
      </nav>

      {/* بنر دسته‌بندی */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8 flex h-44 items-end overflow-hidden rounded-xl bg-ink-900 sm:h-52"
      >
        {category.image ? (
          <>
            <Image
              src={getImageUrl(category.image)}
              alt={category.name}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-ink-900/10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-900" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <Zap className="h-5 w-5" />
            </span>
          </>
        )}

        <div className="relative z-10 p-6">
          <h1 className="text-2xl font-black text-white sm:text-3xl">{category.name}</h1>
          {category.description && (
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-white/70">
              {category.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* زیردسته‌ها */}
      {subCategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subCategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/categories/${sub.slug}`}
              className="rounded-full border border-ink-800/10 bg-white px-4 py-2 text-xs font-bold text-ink-800/70 transition hover:border-brand-500 hover:text-brand-600"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* محصولات */}
      {productsStatus === 'loading' && <ProductsSkeleton />}

      {productsStatus === 'error' && (
        <EmptyState
          icon={AlertTriangle}
          title="مشکلی در دریافت محصولات پیش آمد"
          description="لطفا دوباره تلاش کنید"
        />
      )}

      {productsStatus === 'success' && products.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="محصولی در این دسته‌بندی یافت نشد"
          description="به‌زودی محصولات جدید اضافه می‌شوند"
        />
      )}

      {productsStatus === 'success' && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}