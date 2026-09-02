'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, PackageSearch } from 'lucide-react';
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

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

        setProducts(data.products);
        setTotalPages(data.pagination.pages || 1);
        setStatus('success');

        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (selectedCategory) params.set('category', selectedCategory);
        if (currentPage > 1) params.set('page', String(currentPage));
        window.history.replaceState(null, '', `/products?${params.toString()}`);
        
      } catch (error) {
        if (axios.isCancel(error)) return;
        setStatus('error');
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [currentPage, debouncedSearch, selectedCategory]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-900">محصولات</h1>
        <p className="mt-1 text-sm text-ink-800/50">مشاهده و خرید انواع موتور کولر</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="flex-1">
          {status === 'loading' && <ProductsSkeleton />}

          {status === 'error' && (
            <EmptyState
              icon={AlertTriangle}
              title="مشکلی در دریافت محصولات پیش آمد"
              description="لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید"
            />
          )}

          {status === 'success' && products.length === 0 && (
            <EmptyState
              icon={PackageSearch}
              title="محصولی یافت نشد"
              description="فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید"
            />
          )}

          {status === 'success' && products.length > 0 && (
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
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}