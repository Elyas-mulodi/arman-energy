import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    // فقط تو توسعه (localhost) فعاله؛ تو پروداکشن بک‌اند رو دامنه‌ی عمومی‌ه و نیازی بهش نیست
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // بعد از دیپلوی، دامنه‌ی واقعی بک‌اند رو اینجا اضافه کن، مثلا:
      // { protocol: 'https', hostname: 'api.armanenergy.ir', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;