import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Breadcrumb from '@/components/products/Breadcrumb';
import ProductGallery from '@/components/products/ProductGallery';
import AddToCartPanel from '@/components/products/AddToCartPanel';
import SpecsTable from '@/components/products/SpecsTable';
import RelatedProducts from '@/components/products/RelatedProducts';
import { getProductBySlug } from '@/lib/products';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductSafe(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductSafe(slug);
  if (!product) return { title: 'محصول یافت نشد' };

  return {
    title: `${product.name} | آرمان انرژی`,
    description: product.description?.slice(0, 150),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductSafe(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'محصولات', href: '/products' },
          { label: product.category.name, href: `/products?category=${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <h1 className="mb-1 text-2xl font-black text-ink-900">{product.name}</h1>
          <p className="mb-6 text-xs text-ink-800/40">
            کد دسته‌بندی: <span dir="ltr">{product.category.slug}</span>
          </p>

          <AddToCartPanel product={product} />

          {product.description && (
            <p className="mt-6 border-t border-ink-800/10 pt-6 text-sm leading-7 text-ink-800/70">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {product.specifications.length > 0 && (
        <div className="mt-12 max-w-2xl">
          <h2 className="mb-4 text-lg font-black text-ink-900">مشخصات فنی</h2>
          <SpecsTable specs={product.specifications} />
        </div>
      )}

      <RelatedProducts categoryId={product.category._id} excludeId={product._id} />
    </div>
  );
}