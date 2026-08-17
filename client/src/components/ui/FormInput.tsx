'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon: Icon, label, error, className, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-ink-800/70">{label}</label>
        <div className="relative">
          <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <input
            ref={ref}
            className={`w-full rounded-md border bg-white py-2.5 pr-10 pl-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 ${
              error ? 'border-red-400' : 'border-ink-800/15'
            } ${className ?? ''}`}
            {...rest}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;