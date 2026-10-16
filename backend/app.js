import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { ENV } from './Config/env.js';
import { UPLOAD_ROOT } from './Config/paths.js';
import { notFound, errorHandler } from './Middleware/errorMidd.js';

import userRoutes from './Modules/User/User.js';
import categoryRoutes from './Modules/Category/Category.js';
import productRoutes from './Modules/Product/Product.js';
import cartRoutes from './Modules/Cart/Cart.js';
import orderRoutes from './Modules/Order/Order.js';
import dashboardRoutes from './Modules/Dashboard/Dashboard.js';

const app = express();

// پشت nginx: بدون این، IP همه‌ی کاربران IP خود nginx دیده می‌شود و rate limit بی‌اثر می‌شود
if (ENV.TRUST_PROXY) app.set('trust proxy', 1);

// بدون CORP مناسب، helmet اجازه‌ی نمایش عکس‌های /uploads در دامنه‌ی فرانت را نمی‌دهد
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());

app.use(
  cors({
    origin: (origin, callback) => {
      // درخواست بدون Origin: رندر سمت سرور Next.js، curl، پایش سلامت
      if (!origin || ENV.CLIENT_URLS.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// نام فایل‌ها یکتاست، پس کش طولانی امن است
app.use(
  '/uploads',
  express.static(UPLOAD_ROOT, { maxAge: '7d', immutable: true, dotfiles: 'deny', index: false })
);

// محدودیت کلی: ۳۰۰ درخواست در دقیقه برای هر IP (لاگین و OTP محدودیت سخت‌تر خودشان را دارند)
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد تلاش کنید' },
  })
);

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;