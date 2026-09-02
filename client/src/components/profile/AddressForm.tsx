'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Loader2, MapPin, Building2, Home, Hash } from 'lucide-react';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';
import FormInput from '@/components/ui/FormInput';

interface AddressData {
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
}

const provinces = [
  'تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'آذربایجان غربی', 'خوزستان', 'مازندران', 'گیلان', 'کرمان', 'یزد',
];

export default function AddressForm({ address }: { address?: Partial<AddressData> }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [form, setForm] = useState<AddressData>({
    province: address?.province || '',
    city: address?.city || '',
    fullAddress: address?.fullAddress || '',
    postalCode: address?.postalCode || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof AddressData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.postalCode && form.postalCode.length !== 10) {
      toast.error('کد پستی باید ۱۰ رقم باشد');
      return;
    }

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

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="mb-4 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <div className="mb-4 sm:mb-0">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">استان</label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
            <select
              value={form.province}
              onChange={(e) => updateField('province', e.target.value)}
              required
              className="w-full appearance-none rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            >
              <option value="">انتخاب استان</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormInput
          icon={MapPin}
          label="شهر"
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-ink-800/70">آدرس کامل</label>
        <div className="relative">
          <Home className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink-800/30" />
          <textarea
            value={form.fullAddress}
            onChange={(e) => updateField('fullAddress', e.target.value)}
            required
            rows={3}
            placeholder="خیابان، کوچه، پلاک، واحد..."
            className="w-full resize-none rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <FormInput
        icon={Hash}
        label="کد پستی"
        value={form.postalCode}
        onChange={(e) => updateField('postalCode', e.target.value.replace(/\D/g, ''))}
        inputMode="numeric"
        maxLength={10}
        placeholder="۱۰ رقمی"
      />

      <button
        type="submit"
        disabled={isSaving}
        className="mt-2 flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        ذخیره آدرس
      </button>
    </form>
  );
}