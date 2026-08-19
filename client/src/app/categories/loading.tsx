import CategoryPlateSkeleton from '@/components/categories/CategoryPlateSkeleton';

export default function Loading() {
  return (
    <div className="bg-ink-100">
      <div className="border-b border-ink-800 bg-ink-900 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 h-3 w-32 animate-pulse rounded bg-ink-800" />
          <div className="mb-2 h-9 w-64 animate-pulse rounded bg-ink-800" />
          <div className="h-4 w-48 animate-pulse rounded bg-ink-800" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryPlateSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}