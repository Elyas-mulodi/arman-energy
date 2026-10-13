export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

// برای محور نمودار: ۱۲٫۵ میلیون به‌جای ۱۲۵۰۰۰۰۰
export const formatCompactPrice = (value: number): string => {
  const fmt = (n: number, digits: number) =>
    n.toLocaleString('fa-IR', { maximumFractionDigits: digits });

  if (value >= 1_000_000_000) return `${fmt(value / 1_000_000_000, 1)} میلیارد`;
  if (value >= 1_000_000) return `${fmt(value / 1_000_000, 1)} میلیون`;
  if (value >= 1_000) return `${fmt(value / 1_000, 0)} هزار`;
  return fmt(value, 0);
};

export const getImageUrl = (path: string): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('blob:')) return path;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const normalizeSlug = (slug: string): string => {
  try {
    return encodeURIComponent(decodeURIComponent(slug));
  } catch {
    return encodeURIComponent(slug);
  }
};