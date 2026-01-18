import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable X-Powered-By header (SEO security requirement)
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },

  // Compression
  compress: true,

  // Strict mode for better debugging
  reactStrictMode: true,

  // Disable source maps in production (reduces bundle size)
  productionBrowserSourceMaps: false,

  // WWW to non-WWW redirect for URL canonicalization
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.summarizelectures.com' }],
        destination: 'https://summarizelectures.com/:path*',
        permanent: true,
      },
    ];
  },

  // Security and caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS - Enforce HTTPS for 1 year with preload
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Content Security Policy for additional security
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
