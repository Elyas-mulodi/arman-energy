import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const requiredAlways = ['MONGO_URI', 'JWT_SECRET'];
const requiredInProd = ['CLIENT_URL', 'SERVER_URL', 'ZARINPAL_MERCHANT_ID', 'ZARINPAL_SANDBOX'];

const missing = [...requiredAlways, ...(isProd ? requiredInProd : [])].filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  console.error(`❌ متغیرهای محیطی زیر تنظیم نشده‌اند: ${missing.join(', ')}`);
  process.exit(1);
}

if (isProd && process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET در پروداکشن باید حداقل ۳۲ کاراکتر باشد');
  process.exit(1);
}

if (isProd && process.env.ZARINPAL_SANDBOX === 'true') {
  console.warn('⚠️ ZARINPAL_SANDBOX روشن است؛ پرداخت‌ها واقعی نیستند');
}

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const port = process.env.PORT || 5000;

export const ENV = {
  PORT: port,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: clientUrls[0],
  CLIENT_URLS: clientUrls,
  SERVER_URL: (process.env.SERVER_URL || `http://localhost:${port}`).replace(/\/$/, ''),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || '',
  TRUST_PROXY: process.env.TRUST_PROXY === 'true',
  UPLOAD_DIR: process.env.UPLOAD_DIR || '',
  PENDING_ORDER_TTL_MINUTES: Number(process.env.PENDING_ORDER_TTL_MINUTES) || 1440,
  ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID,
  ZARINPAL_SANDBOX: process.env.ZARINPAL_SANDBOX ?? 'true',
  LIMOSMS_API_KEY: process.env.LIMOSMS_API_KEY,
};