export default function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-md border border-ink-800/10 bg-white p-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-ink-800/8 py-5 last:border-0">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-ink-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-ink-100" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-ink-100" />
              <div className="mt-3 h-8 w-24 animate-pulse rounded bg-ink-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-md bg-ink-100" />
    </div>
  );
}