'use client';

import { Minus, Plus, Loader2 } from 'lucide-react';

export default function QuantityStepper({
  quantity,
  max,
  disabled,
  onChange,
}: {
  quantity: number;
  max: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center rounded-md border border-ink-800/15">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={disabled || quantity <= 1}
        className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="flex w-8 items-center justify-center text-xs font-bold">
        {disabled ? <Loader2 className="h-3 w-3 animate-spin" /> : quantity.toLocaleString('fa-IR')}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled || quantity >= max}
        className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}