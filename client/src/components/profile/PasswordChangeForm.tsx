'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Lock } from 'lucide-react';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';
import FormInput from '@/components/ui/FormInput';

export default function PasswordChangeForm() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('رمز جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ currentPassword, password: newPassword });
      toast.success('رمز عبور با موفقیت تغییر کرد');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <FormInput
        icon={Lock}
        label="رمز عبور فعلی"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <FormInput
        icon={Lock}
        label="رمز عبور جدید"
        type="password"
        placeholder="حداقل ۶ کاراکتر"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <FormInput
        icon={Lock}
        label="تکرار رمز عبور جدید"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        تغییر رمز عبور
      </button>
    </form>
  );
}