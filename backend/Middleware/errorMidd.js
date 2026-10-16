import { ENV } from '../Config/env.js';

export const notFound = (req, res, next) => {
  const error = new Error(`مسیر یافت نشد - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'خطای داخلی سرور';

  const status = err.status ?? err.statusCode;
  if (typeof status === 'number' && status >= 400 && status < 500) statusCode = status;

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'تعداد تصاویر ارسالی بیش از حد مجاز است';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'فرمت داده ارسالی نامعتبر است';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'حجم درخواست بیش از حد مجاز است';
  }

  if (statusCode >= 500) {
    console.error(err);
    if (ENV.NODE_ENV === 'production') message = 'خطای داخلی سرور';
  }

  res.status(statusCode).json({
    message,
    ...(ENV.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};