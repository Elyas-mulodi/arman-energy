import { getCategories } from '@/lib/categories';
import ProductForm from '@/components/admin/products/ProductForm';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">افزودن محصول جدید</h1>
      <ProductForm categories={categories} />
    </div>
  );
}