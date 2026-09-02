import { OrderItem } from '@/types/order';
import { formatPrice } from '@/lib/utils';

export default function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <div className="rounded-md border border-ink-800/10 bg-white">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 border-b border-ink-800/8 p-4 last:border-0"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
            {item.variantLabel && (
              <p className="mt-0.5 text-xs text-ink-800/45">{item.variantLabel}</p>
            )}
            <p className="mt-1 text-xs text-ink-800/40">
              {formatPrice(item.price)} تومان × {item.quantity.toLocaleString('fa-IR')}
            </p>
          </div>
          <span className="shrink-0 text-sm font-black text-ink-900">
            {formatPrice(item.lineTotal)}
          </span>
        </div>
      ))}
    </div>
  );
}