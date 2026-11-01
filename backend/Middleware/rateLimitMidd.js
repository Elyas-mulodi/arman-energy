import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { normalizePhone } from '../Utils/validate.js';

const byPhoneOrIp = (req) => normalizePhone(req.body?.phone) ?? ipKeyGenerator(req.ip);

const baseOptions = { standardHeaders: true, legacyHeaders: false };

// هر شماره: ۳ درخواست OTP در ۱۵ دقیقه
export const otpLimiter = rateLimit({
  ...baseOptions,
  windowMs: 2 * 60 * 1000,
  limit: 3,
  keyGenerator: byPhoneOrIp,
  message: { message: 'تعداد درخواست‌های شما بیش از حد مجاز است. 2 دقیقه دیگر تلاش کنید' },
});

// هر IP: ۱۰ درخواست OTP در ساعت (جلوگیری از پیامک‌بازی روی شماره‌های مختلف)
export const otpIpLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: 'تعداد درخواست‌ها از این شبکه بیش از حد مجاز است. بعدا تلاش کنید' },
});

export const loginLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: byPhoneOrIp,
  message: { message: 'تعداد تلاش‌های ورود بیش از حد مجاز است. بعدا تلاش کنید' },
});

// حدس زدن کد OTP
export const resetLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: byPhoneOrIp,
  message: { message: 'تعداد تلاش‌ها بیش از حد مجاز است. بعدا تلاش کنید' },
});

export const registerLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: 'تعداد ثبت‌نام از این شبکه بیش از حد مجاز است. بعدا تلاش کنید' },
});