import { getProducts } from "@/lib/products";
import ProductGrid from "./ProductGrid";

export default async function RelatedProducts({
  categoryId,
  excludeId,
}: {
  categoryId: string;
  excludeId: string;
}) {
  const { products } = await getProducts({ category: categoryId, limit: 5 });
  const related = products.filter((p) => p._id !== excludeId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="mb-4 text-lg font-black text-ink-900">محصولات مرتبط</h2>
      <ProductGrid products={related} />
    </div>
  );
}