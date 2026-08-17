import { Category } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها');
  return res.json();
}