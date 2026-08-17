import { Product } from '@/types/product';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-ink-800/15 text-sm text-ink-800/40">
        محصولی یافت نشد
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}