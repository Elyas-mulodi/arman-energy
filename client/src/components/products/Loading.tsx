import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-ink-100" />
        <div className="h-9 w-full animate-pulse rounded-md bg-ink-100 md:w-64" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <div className="hidden flex-col gap-2 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-ink-100" />
          ))}
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}