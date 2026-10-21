export interface SiteStat {
  value: number;
  suffix?: string;
  label: string;
}

export const SITE = {
  name: "آرمان انرژی",
  legalName: "XXX",
  tagline: "فروش آنلاین انواع موتور کولر آبی",

  contact: {
    phone: "021-XXXXXXXX", // تلفن ثابت (اینماد معمولا تلفن ثابت می‌خواد)
    email: "info@XXX.ir",
    address: "XXX",
    postalCode: "XXXXXXXXXX",
    instagram: "", // خالی = نمایش داده نمیشه
    telegram: "",
  },

  hours: {
    label: "شنبه تا پنج‌شنبه، ۹ الی ۲۰",
    days: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"], // با label بالا هماهنگ باشه
    open: 9,
    close: 20,
  },

  policy: {
    returnDays: 7, // روز کاری برای مرجوعی؛ سیاست خودت رو بنویس
    coverage: "XXX", // مثلا: سراسر کشور
    deliveryTime: "XXX", // مثلا: ۲ تا ۵ روز کاری
    refundTime: "XXX", // مثلا: ۳ تا ۷ روز کاری
  },

  // فقط آمار واقعی و قابل‌اثبات؛ خالی = بخش آمار تو سایت نمایش داده نمیشه
  stats: [] as SiteStat[],

  footerSpecs: [
    { label: "زمینه فعالیت", value: "فروش موتور کولر" },
    { label: "پرداخت", value: "درگاه بانکی" },
    { label: "پشتیبانی", value: "تلفنی" },
  ],

  about: {
    tagline:
      "ما فروش آنلاین موتور کولر آبی رو شروع کرده‌ایم تا انتخاب و خرید موتور مناسب ساده و شفاف باشه.",
    paragraphs: [
      "آرمان انرژی فعالیتش رو در حوزه‌ی فروش موتور کولر آبی شروع کرده و هدفش اینه که خریدار قبل از پرداخت دقیقاً بدونه چی می‌خره.",
      "تو صفحه‌ی هر محصول وریانت‌های موجود (ولتاژ، توان و برند) و موجودی هر کدوم رو می‌بینی، تا مجبور نباشی حدس بزنی.",
      "اگه برای انتخاب موتور مناسب کولرت مطمئن نیستی، قبل از خرید با ما تماس بگیر.",
    ],
  },

  // کدی که اینماد بهت می‌ده؛ هر دو آدرس رو از همون کد کپی کن
  enamad: { link: "", logo: "" },
};

const findPlaceholders = (value: unknown, path = "SITE"): string[] => {
  if (typeof value === "string") return value.includes("XXX") ? [path] : [];
  if (Array.isArray(value))
    return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      findPlaceholders(v, `${path}.${k}`),
    );
  }
  return [];
};

// فقط سمت سرور (موقع build) هشدار بده، نه تو مرورگر بازدیدکننده
if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
  const leftovers = findPlaceholders(SITE);
  if (leftovers.length > 0) {
    console.warn(
      `⚠️ این مقادیر در src/config/site.ts هنوز نمونه‌اند: ${leftovers.join(", ")}`,
    );
  }
}
