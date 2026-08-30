export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

export const getImageUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  return `${base}${path}`;
};