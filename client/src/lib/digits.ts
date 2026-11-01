const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const toEnglishDigits = (value: string): string =>
  value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(digit);
    return String(persianIndex !== -1 ? persianIndex : ARABIC_DIGITS.indexOf(digit));
  });

export const digitsOnly = (value: string): string => toEnglishDigits(value).replace(/\D/g, '');