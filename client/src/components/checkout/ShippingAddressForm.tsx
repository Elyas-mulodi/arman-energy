"use client";

import { MapPin, User, Phone, Home, Map } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import { ShippingAddress } from "@/types/order";

interface ShippingAddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}

const provinces = [
  "تهران",
  "البرز",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "خوزستان",
  "مازندران",
  "گیلان",
  "کرمان",
  "یزد",
];

export default function ShippingAddressForm({
  address,
  onChange,
}: ShippingAddressFormProps) {
  const updateField = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div>
      <h2 className="mb-1 text-lg font-black text-ink-900">اطلاعات ارسال</h2>
      <p className="mb-6 text-sm text-ink-800/50">
        آدرس دقیق برای تحویل سفارش را وارد کنید
      </p>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <FormInput
          icon={User}
          label="نام و نام خانوادگی گیرنده"
          value={address.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          required
        />
        <FormInput
          icon={Phone}
          label="شماره موبایل گیرنده"
          type="tel"
          inputMode="numeric"
          value={address.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-ink-800/70">
          استان
        </label>
        <div className="relative">
          <Map className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <select
            value={address.province}
            onChange={(e) => updateField("province", e.target.value)}
            required
            className="w-full appearance-none rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          >
            <option value="">انتخاب استان</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormInput
        icon={MapPin}
        label="شهر"
        value={address.city}
        onChange={(e) => updateField("city", e.target.value)}
        required
      />

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-ink-800/70">
          آدرس کامل
        </label>
        <div className="relative">
          <Home className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink-800/30" />
          <textarea
            value={address.fullAddress}
            onChange={(e) => updateField("fullAddress", e.target.value)}
            required
            rows={3}
            placeholder="خیابان، کوچه، پلاک، واحد..."
            className="w-full resize-none rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <FormInput
        icon={MapPin}
        label="کد پستی"
        value={address.postalCode}
        onChange={(e) => updateField("postalCode", e.target.value)}
        inputMode="numeric"
        required
        minLength={10}
        maxLength={10}
        placeholder="۱۰ رقمی"
      />
    </div>
  );
}
