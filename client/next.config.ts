import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: api.protocol.replace(':', '') as 'http' | 'https',
        hostname: api.hostname,
        ...(api.port && { port: api.port }),
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;