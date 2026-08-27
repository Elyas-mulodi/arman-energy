import { getProducts } from '@/lib/adminProducts';
import ProductsTable from '@/components/admin/products/ProductsTable';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">محصولات</h1>
      <ProductsTable initialProducts={products} />
    </div>
  );
}