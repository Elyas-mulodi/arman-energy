'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';
import FormInput from '@/components/ui/FormInput';
import { User as UserIcon, Mail, Phone } from 'lucide-react';

export default function PersonalInfoForm({ user }: { user: { fullName: string; email?: string; phone: string } }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ fullName, email });
      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <FormInput
        icon={UserIcon}
        label="نام و نام خانوادگی"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <FormInput
        icon={Mail}
        label="ایمیل"
        type="email"
        placeholder="example@mail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-bold text-ink-800/60">شماره موبایل</label>
        <div className="flex items-center gap-2 rounded-md border border-ink-800/10 bg-ink-100/60 px-3 py-2.5 text-sm text-ink-800/50">
          <Phone className="h-4 w-4" />
          <span dir="ltr">{user.phone}</span>
        </div>
        <p className="mt-1 text-[11px] text-ink-800/35">شماره موبایل قابل تغییر نیست</p>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        ذخیره تغییرات
      </button>
    </form>
  );
}