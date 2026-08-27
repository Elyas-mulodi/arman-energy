import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/categories';
import { getProductById } from '@/lib/adminProducts';
import ProductForm from '@/components/admin/products/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id).catch(() => null),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">ویرایش محصول</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}