'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import api from '@/lib/axios';
import { Product, ProductListResponse } from '@/types/product';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<ProductListResponse>('/products', { params: { featured: true, limit: 8 } })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">
              پیشنهاد ویژه
            </p>
            <h2 className="text-2xl font-black text-ink-900">محصولات منتخب</h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:underline md:flex"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="فعلا محصول ویژه‌ای ثبت نشده"
            description="به‌زودی محصولات منتخب اینجا نمایش داده می‌شن"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}