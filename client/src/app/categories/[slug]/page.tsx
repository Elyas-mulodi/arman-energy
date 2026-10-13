import type { Metadata } from 'next';
import CategoryDetailClient from '@/components/categories/CategoryDetailClient';
import { Category } from '@/types/category';
import { getImageUrl, normalizeSlug } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCategoryForMetadata(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${normalizeSlug(slug)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryForMetadata(slug);

  if (!category) {
    return { title: 'دسته‌بندی یافت نشد' };
  }

  const description =
    category.description || `مشاهده و خرید محصولات دسته‌بندی ${category.name} از آرمان انرژی`;

  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
      images: category.image ? [{ url: getImageUrl(category.image) }] : undefined,
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  // key باعث میشه با تغییر slug، کل کامپوننت از نو ساخته بشه (صفحه‌ی ۱ و state تازه)
  return <CategoryDetailClient key={slug} slug={slug} />;
}