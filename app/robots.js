export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/account/',
          '/checkout',
          '/cart',
          '/order-confirmation',
          '/api/',
          '/_next/',
          '/search?*',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
