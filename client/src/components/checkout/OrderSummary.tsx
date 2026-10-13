import { Zap } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/lib/utils';
import ApiImage from '@/components/ui/ApiImage';

export default function OrderSummary({ items, subtotal }: { items: CartItem[]; subtotal: number }) {
  const shippingCost = 0;

  return (
    <div className="rounded-xl border border-ink-800/10 bg-white p-6">
      <h2 className="mb-4 text-lg font-black text-ink-900">خلاصه سفارش</h2>

      <div className="mb-5 flex flex-col gap-4">
        {items.map((item) => {
          if (!item.available) {
            return (
              <div key={item._id} className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
                {item.message}
              </div>
            );
          }

          return (
            <div key={item._id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-ink-100">
                {item.product.image ? (
                  <ApiImage
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Zap className="h-5 w-5 text-ink-800/20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-bold text-ink-900">{item.product.name}</p>
                <p className="text-xs text-ink-800/40">
                  {[item.variant.voltage, item.variant.size, item.variant.brand]
                    .filter(Boolean)
                    .join(' - ')}{' '}
                  × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-ink-800">{formatPrice(item.lineTotal)}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-ink-800/10 pt-4 text-sm">
        <div className="flex justify-between text-ink-800/60">
          <span>جمع کالاها</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-800/60">
          <span>هزینه ارسال</span>
          <span>{shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-ink-800/10 pt-3 text-base font-black text-ink-900">
          <span>مبلغ قابل پرداخت</span>
          <span className="text-brand-600">{formatPrice(subtotal + shippingCost)}</span>
        </div>
      </div>
    </div>
  );
}