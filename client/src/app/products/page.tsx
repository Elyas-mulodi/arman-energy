import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import Pagination from '@/components/products/Pagiation';
import SearchBar from '@/components/products/SearchBar';

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const categories = await getCategories();
  const activeCategory = params.category
    ? categories.find((c) => c.slug === params.category)
    : undefined;

  const productsRes = await getProducts({
    category: activeCategory?._id,
    search: params.search,
    page,
    featured: params.featured,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-black text-ink-900">محصولات</h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <CategoryFilter categories={categories} activeSlug={params.category} />

        <div>
          <ProductGrid products={productsRes.products} />
          <Pagination pagination={productsRes.pagination} />
        </div>
      </div>
    </div>
  );
}