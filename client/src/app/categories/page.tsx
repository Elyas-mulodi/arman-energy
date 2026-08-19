import { Metadata } from 'next';
import { buildCategoryTree } from '@/lib/categoryTree';
import CategoryPlate from '@/components/categories/CategoryPlate';
import CategoriesEmpty from '@/components/categories/CategoriesEmpty';
import { getCategories } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'دسته‌بندی محصولات | آرمان انرژی',
  description: 'دسته‌بندی کامل موتور کولرهای آبی و قطعات جانبی',
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const tree = buildCategoryTree(categories);

  return (
    <div className="relative overflow-hidden bg-ink-100">
      {/* هدر صفحه */}
      <div className="relative border-b border-ink-800 bg-ink-900 px-4 py-14">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-2 font-mono text-xs tracking-widest text-brand-500" dir="ltr">
            PRODUCT CATALOG
          </p>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-ink-100 sm:text-4xl">
            دسته‌بندی محصولات
          </h1>
          <p className="max-w-md text-sm leading-6 text-ink-100/50">
            {categories.length.toLocaleString('fa-IR')} دسته‌بندی از انواع موتور کولر و قطعات جانبی
          </p>
        </div>
      </div>

      {/* گرید دسته‌ها */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {tree.length === 0 ? (
          <CategoriesEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tree.map((category, index) => (
              <CategoryPlate key={category._id} category={category} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}