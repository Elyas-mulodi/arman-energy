import { CheckCircle2, XCircle, AlertTriangle, PackageX, HelpCircle, LucideIcon } from 'lucide-react';

export type PaymentStatus =
  | 'success'
  | 'cancelled'
  | 'failed'
  | 'out_of_stock'
  | 'not_found'
  | 'error';

interface ResultConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export const resultConfigs: Record<PaymentStatus, ResultConfig> = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    title: 'پرداخت با موفقیت انجام شد',
    description: 'سفارش شما ثبت شد و به‌زودی پردازش می‌شود',
  },
  cancelled: {
    icon: XCircle,
    iconColor: 'text-ink-800/40',
    iconBg: 'bg-ink-800/5',
    title: 'پرداخت لغو شد',
    description: 'شما فرآیند پرداخت را لغو کردید. می‌توانید دوباره تلاش کنید',
  },
  failed: {
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    title: 'پرداخت ناموفق بود',
    description: 'مشکلی در پردازش پرداخت شما رخ داد. مبلغی از حساب شما کسر نشده است',
  },
  out_of_stock: {
    icon: PackageX,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    title: 'پرداخت انجام شد اما موجودی کافی نبود',
    description: 'مبلغ پرداختی شما به‌زودی توسط پشتیبانی بازگردانده می‌شود. با ما تماس بگیرید',
  },
  not_found: {
    icon: HelpCircle,
    iconColor: 'text-ink-800/40',
    iconBg: 'bg-ink-800/5',
    title: 'سفارش یافت نشد',
    description: 'اطلاعات این تراکنش پیدا نشد',
  },
  error: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    title: 'خطایی رخ داد',
    description: 'مشکلی در بررسی وضعیت پرداخت پیش آمد. با پشتیبانی تماس بگیرید',
  },
};