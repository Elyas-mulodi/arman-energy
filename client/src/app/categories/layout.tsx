import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دسته‌بندی‌ها',
  description: 'مشاهده‌ی تمام دسته‌بندی‌های موتور کولر و قطعات مرتبط در آرمان انرژی.',
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}