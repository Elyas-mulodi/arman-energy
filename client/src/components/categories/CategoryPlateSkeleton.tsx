export default function CategoryPlateSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-ink-800/15 bg-ink-900">
      <div className="aspect-[4/3] animate-pulse bg-ink-800" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-ink-800" />
        <div className="h-3 w-full animate-pulse rounded bg-ink-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800" />
      </div>
      <div className="flex gap-1.5 border-t border-ink-800 px-4 py-3">
        <div className="h-6 w-16 animate-pulse rounded bg-ink-800" />
        <div className="h-6 w-20 animate-pulse rounded bg-ink-800" />
      </div>
    </div>
  );
}