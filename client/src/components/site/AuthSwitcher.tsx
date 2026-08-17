'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Phone, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FormInput from '@/components/ui/FormInput';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';

type AuthMode = 'login' | 'register';

const specs = [
  { label: 'ولتاژ', value: '220V / 380V' },
  { label: 'ضمانت', value: 'اصالت کالا' },
  { label: 'ارسال', value: 'سراسر کشور' },
];

const bannerContent: Record<AuthMode, { title: string; desc: string }> = {
  login: {
    title: 'خوشحالیم دوباره می‌بینیمت',
    desc: 'وارد حساب کاربریت شو و به سریع‌ترین مسیر تامین قطعات موتور کولر دسترسی داشته باش.',
  },
  register: {
    title: 'به آرمان انرژی بپیوند',
    desc: 'با ساخت حساب کاربری، خرید و پیگیری سفارشات موتور کولر برات چند برابر ساده‌تر میشه.',
  },
};

export default function AuthSwitcher({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = mode === 'login' ? '/login' : '/register';
    window.history.replaceState(null, '', url);
  }, [mode]);

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setPassword('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'register' && password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(phone, password);
        toast.success('خوش آمدید');
        router.push(user.role === 'admin' ? '/admin' : '/');
      } else {
        await register(fullName, phone, password);
        toast.success('ثبت‌نام با موفقیت انجام شد');
        router.push('/');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden md:flex-row">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 md:flex md:w-1/2 ${
          isLogin ? 'order-2' : 'order-1'
        }`}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight text-ink-100">
            آرمان<span className="text-brand-500"> انرژی</span>
          </span>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-3 text-3xl font-black leading-tight text-ink-100">
                {bannerContent[mode].title}
              </h2>
              <p className="mb-8 text-sm leading-6 text-ink-100/50">
                {bannerContent[mode].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-3 border-t border-ink-800 pt-5">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-[10px] uppercase tracking-widest text-ink-100/40">
                  {spec.label}
                </p>
                <p className="mt-1 text-xs font-bold text-ink-100">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-xs text-ink-100/30" dir="ltr">
          AE-ENERGY-SYS
        </p>
      </motion.div>

      {/* پنل فرم */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`flex items-center justify-center bg-ink-100 px-6 py-12 md:w-1/2 ${
          isLogin ? 'order-1' : 'order-2'
        }`}
      >
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: isLogin ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 16 : -16 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="mb-1 text-2xl font-black text-ink-900">
                {isLogin ? 'ورود' : 'ثبت‌نام'}
              </h1>
              <p className="mb-8 text-sm text-ink-800/50">
                {isLogin ? 'اطلاعات حسابت رو وارد کن' : 'چند ثانیه وقت بذار و عضو شو'}
              </p>

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <FormInput
                    icon={UserIcon}
                    label="نام و نام خانوادگی"
                    type="text"
                    placeholder="مثلا علی رضایی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}

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

                <FormInput
                  icon={Lock}
                  label="رمز عبور"
                  type="password"
                  placeholder={isLogin ? '••••••••' : 'حداقل ۶ کاراکتر'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {isLogin && (
                  <div className="mb-6 flex justify-end">
                    <a href="/forgot-password" className="text-xs text-brand-600 hover:underline">
                      رمز عبورت رو فراموش کردی؟
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLogin ? 'ورود به حساب' : 'ساخت حساب کاربری'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-800/60">
                {isLogin ? 'حساب کاربری نداری؟' : 'قبلا ثبت‌نام کردی؟'}{' '}
                <button
                  onClick={switchMode}
                  type="button"
                  className="font-bold text-brand-600 hover:underline"
                >
                  {isLogin ? 'ثبت‌نام کن' : 'وارد شو'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}