import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">افزودن دسته‌بندی جدید</h1>
      <CategoryForm />
    </div>
  );
}