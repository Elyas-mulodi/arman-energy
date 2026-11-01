const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// ارقام فارسی و عربی را به انگلیسی تبدیل می‌کند
export const toEnglishDigits = (value) =>
  String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(digit);
    return String(persianIndex !== -1 ? persianIndex : ARABIC_DIGITS.indexOf(digit));
  });

// فقط رشته قبول می‌کند؛ آبجکت یا آرایه (مثل { $ne: null }) به رشته‌ی خالی تبدیل می‌شود
export const asString = (value) => (typeof value === 'string' ? value.trim() : '');

export const isObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

// خروجی: موبایل استاندارد 09xxxxxxxxx یا null
export const normalizePhone = (value) => {
  if (typeof value !== 'string') return null;

  let phone = toEnglishDigits(value).replace(/[\s\-()]/g, '');

  if (phone.startsWith('+98')) phone = `0${phone.slice(3)}`;
  else if (phone.startsWith('0098')) phone = `0${phone.slice(4)}`;
  else if (/^98\d{10}$/.test(phone)) phone = `0${phone.slice(2)}`;
  else if (/^9\d{9}$/.test(phone)) phone = `0${phone}`;

  return /^09\d{9}$/.test(phone) ? phone : null;
};

export const normalizePostalCode = (value) => {
  if (typeof value !== 'string') return null;
  const code = toEnglishDigits(value).replace(/\s/g, '');
  return /^\d{10}$/.test(code) ? code : null;
};

// مقدار multipart (رشته‌ی JSON) یا آرایه‌ی آماده را به آرایه تبدیل می‌کند؛ در غیر این صورت null
export const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const toNumber = (value) =>
  value === '' || value === null || value === undefined ? NaN : Number(value);

const cleanText = (value) => (typeof value === 'string' ? value.trim().slice(0, 60) : undefined);

// وریانت‌ها را اعتبارسنجی و تمیز می‌کند. خروجی: { error } یا { variants }
export const normalizeVariants = (rawVariants) => {
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
    return { error: 'محصول باید حداقل یک وریانت داشته باشد' };
  }
  if (rawVariants.length > 50) return { error: 'تعداد وریانت‌ها بیش از حد مجاز است' };

  const seenSkus = new Set();
  const variants = [];

  for (const [index, raw] of rawVariants.entries()) {
    const label = `وریانت ${index + 1}`;
    if (!raw || typeof raw !== 'object') return { error: `${label}: ساختار نامعتبر است` };

    const sku = typeof raw.sku === 'string' ? raw.sku.trim() : '';
    if (!sku || sku.length > 60) return { error: `${label}: SKU الزامی است` };
    if (seenSkus.has(sku.toLowerCase())) return { error: `${label}: SKU تکراری است` };
    seenSkus.add(sku.toLowerCase());

    const price = toNumber(raw.price);
    if (!Number.isInteger(price) || price <= 0) {
      return { error: `${label}: قیمت باید عدد صحیح و بیشتر از صفر باشد` };
    }

    const stock = toNumber(raw.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return { error: `${label}: موجودی باید عدد صحیح و غیرمنفی باشد` };
    }

    let discountPrice = null;
    if (raw.discountPrice !== null && raw.discountPrice !== undefined && raw.discountPrice !== '') {
      discountPrice = toNumber(raw.discountPrice);
      if (!Number.isInteger(discountPrice) || discountPrice <= 0 || discountPrice >= price) {
        return { error: `${label}: قیمت تخفیف باید کمتر از قیمت اصلی باشد` };
      }
    }

    variants.push({
      // _id فقط برای وریانت‌های موجود حفظ می‌شود تا سبد و سفارش‌های قبلی گم نشوند
      ...(isObjectId(raw._id) && { _id: raw._id }),
      voltage: cleanText(raw.voltage),
      size: cleanText(raw.size),
      brand: cleanText(raw.brand),
      sku,
      price,
      discountPrice,
      stock,
      isActive: raw.isActive === undefined ? true : raw.isActive === true || raw.isActive === 'true',
    });
  }

  return { variants };
};