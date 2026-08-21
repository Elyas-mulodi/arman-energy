'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, User, Phone, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import FormInput from '@/components/ui/FormInput';

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

const initialFormData: ContactFormData = {
  fullName: '',
  phone: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // فعلا هیچ روت بک‌اندی برای پیام تماس نداریم، پس فقط شبیه‌سازی می‌کنیم
      // وقتی روت /api/contact ساخته شد، این بخش با یه درخواست واقعی axios جایگزین میشه
      await new Promise((resolve) => setTimeout(resolve, 900));

      setIsSubmitted(true);
      toast.success('پیام شما با موفقیت ارسال شد');
    } catch {
      toast.error('خطایی در ارسال پیام رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mb-2 text-lg font-bold text-ink-900">پیام شما ارسال شد</h3>
        <p className="mb-6 text-sm text-ink-800/50">
          تیم پشتیبانی در اسرع وقت با شما تماس خواهد گرفت
        </p>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsSubmitted(false);
          }}
          className="text-sm font-bold text-brand-600 hover:underline"
        >
          ارسال پیام جدید
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-1 text-xl font-black text-ink-900">فرم تماس</h2>
      <p className="mb-6 text-sm text-ink-800/50">پیام خود را برای ما ارسال کنید</p>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <FormInput
          icon={User}
          label="نام و نام خانوادگی"
          value={formData.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          required
        />
        <FormInput
          icon={Phone}
          label="شماره موبایل"
          type="tel"
          inputMode="numeric"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          required
        />
      </div>

      <FormInput
        icon={Mail}
        label="ایمیل (اختیاری)"
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
      />

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-ink-800/70">متن پیام</label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink-800/30" />
          <textarea
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            required
            rows={4}
            placeholder="پیام خود را بنویسید..."
            className="w-full resize-none rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        ارسال پیام
      </button>
    </form>
  );
}