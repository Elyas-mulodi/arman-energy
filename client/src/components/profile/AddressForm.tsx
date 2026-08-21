'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';

interface AddressData {
  province?: string;
  city?: string;
  fullAddress?: string;
  postalCode?: string;
}

export default function AddressForm({ address }: { address?: AddressData }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [form, setForm] = useState<AddressData>({
    province: address?.province || '',
    city: address?.city || '',
    fullAddress: address?.fullAddress || '',
    postalCode: address?.postalCode || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const update = (field: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ address: form });
      toast.success('آدرس با موفقیت ذخیره شد');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">استان</label>
          <input className={inputClass} value={form.province} onChange={update('province')} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">شهر</label>
          <input className={inputClass} value={form.city} onChange={update('city')} required />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-ink-800/60">آدرس کامل</label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-none`}
          value={form.fullAddress}
          onChange={update('fullAddress')}
          required
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-bold text-ink-800/60">کد پستی</label>
        <input className={inputClass} value={form.postalCode} onChange={update('postalCode')} inputMode="numeric" />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        ذخیره آدرس
      </button>
    </form>
  );
}