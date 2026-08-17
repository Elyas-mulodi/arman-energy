import { Product, ProductListResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: string;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.featured) query.set('featured', params.featured);

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('خطا در دریافت محصولات');
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('محصول یافت نشد');
  return res.json();
}