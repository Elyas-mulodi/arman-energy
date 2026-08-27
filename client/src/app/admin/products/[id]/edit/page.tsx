'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/axios';
import { Product } from '@/types/product';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    api
      .get<Product>(`/products/admin/${params.id}`, { signal: controller.signal })
      .then((res) => {
        setProduct(res.data);
        setStatus('success');
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setStatus('error');
      });

    return () => controller.abort();
  }, [params.id]);

  if (status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-ink-800/50">محصول یافت نشد</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">ویرایش محصول</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}