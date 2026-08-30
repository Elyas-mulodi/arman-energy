'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, KeyRound, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { useCountdown } from '@/hooks/useCountdown';
import FormInput from '@/components/ui/FormInput';

type Step = 'phone' | 'reset' | 'done';

const OTP_EXPIRY_SECONDS = 120; // منطبق با انقضای 2 دقیقه‌ای OTP در بک‌اند

export default function ForgotPasswordFlow() {
  const router = useRouter();
  const { seconds, isActive, start } = useCountdown(OTP_EXPIRY_SECONDS);

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestOtp = async () => {
    if (!phone) {
      toast.error('لطفا شماره موبایل را وارد کنید');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/users/forgot-password', { phone });
      toast.success('کد تایید ارسال شد');
      setStep('reset');
      start();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    requestOtp();
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('کد تایید باید 6 رقم باشد');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/users/reset-password', { phone, otp, newPassword });
      setStep('done');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (isActive) return;
    requestOtp();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-4 py-16">
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="mb-1 text-2xl font-black text-ink-900">فراموشی رمز عبور</h1>
            <p className="mb-8 text-sm text-ink-800/50">
              شماره موبایل خود را وارد کنید تا کد تایید برایتان پیامک شود
            </p>

            <form onSubmit={handleRequestSubmit}>
              <FormInput
                icon={Phone}
                label="شماره موبایل"
                type="tel"
                inputMode="numeric"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                ارسال کد تایید
              </button>
            </form>
          </motion.div>
        )}

        {step === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setStep('phone')}
              type="button"
              className="mb-4 flex items-center gap-1 text-xs font-bold text-ink-800/50 hover:text-brand-600"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              تغییر شماره موبایل
            </button>

            <h1 className="mb-1 text-2xl font-black text-ink-900">کد تایید را وارد کنید</h1>
            <p className="mb-8 text-sm text-ink-800/50">
              کد 6 رقمی ارسال‌شده به <span dir="ltr" className="font-bold">{phone}</span> و رمز
              جدید خود را وارد کنید
            </p>

            <form onSubmit={handleResetSubmit}>
              <FormInput
                icon={KeyRound}
                label="کد تایید"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6 رقمی"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
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
                disabled={isLoading}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                تغییر رمز عبور
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isActive || isLoading}
                className="w-full text-center text-xs font-bold text-brand-600 disabled:text-ink-800/30"
              >
                {isActive
                  ? `ارسال مجدد کد تا ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} دیگر`
                  : 'ارسال مجدد کد تایید'}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mb-2 text-xl font-black text-ink-900">رمز عبور تغییر کرد</h1>
            <p className="mb-8 text-sm text-ink-800/50">
              اکنون می‌توانید با رمز عبور جدید وارد حساب کاربری خود شوید
            </p>
            <button
              onClick={() => router.push('/login')}
              className="rounded-md bg-brand-500 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              ورود به حساب
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}