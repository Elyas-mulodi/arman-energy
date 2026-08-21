'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackageX, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { UnavailableCartItem } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';

export default function UnavailableItemRow({ item }: { item: UnavailableCartItem }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item._id);
    } catch {
      toast.error('خطا در حذف آیتم');
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      className="flex items-center gap-3 border-b border-ink-800/8 bg-ink-100/40 px-3 py-4 last:border-0"
    >
      <PackageX className="h-8 w-8 shrink-0 text-ink-800/25" strokeWidth={1.5} />
      <div className="flex-1">
        <p className="text-sm font-bold text-ink-800/50">{item.product?.name || 'محصول نامشخص'}</p>
        <p className="text-xs text-red-500/70">{item.message}</p>
      </div>
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/30 transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
        aria-label="حذف از سبد"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}