import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: { message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفا 15 دقیقه دیگر تلاش کنید' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.phone || req.ip, 
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفا بعدا تلاش کنید' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.phone || req.ip,
});