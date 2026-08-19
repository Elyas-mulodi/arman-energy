export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-md border border-ink-800/10 bg-white">
          <div className="aspect-square animate-pulse bg-ink-100" />
          <div className="space-y-2 p-3">
            <div className="h-3.5 w-full animate-pulse rounded bg-ink-100" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-ink-100" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      ))}
    </div>
  );
}