import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-1xl font-black text-ink-900">افزودن محصول جدید</h1>
      <ProductForm />
    </div>
  );
}