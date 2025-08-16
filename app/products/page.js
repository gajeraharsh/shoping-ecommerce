export { default } from './ServerPage';

export const revalidate = 300; // cache listing for 5 minutes

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
  const page = Number(sp?.page) || 1;
  const q = sp?.q ? String(sp.q) : '';
  const titleBase = 'Products | Faxio';
  const title = q ? `${q} – ${titleBase}` : (page > 1 ? `${titleBase} – Page ${page}` : titleBase);
  const description = q
    ? `Browse products for "${q}" on Faxio. Discover curated items with fast delivery and great prices.`
    : 'Browse all products on Faxio. Discover curated items with fast delivery and great prices.';

  // Build canonical with current query params for filters/pagination
  const params = new URLSearchParams();
  ['q', 'category_id', 'collection_id', 'sort', 'page', 'limit'].forEach((k) => {
    const v = sp?.[k];
    if (typeof v === 'string' && v.length) params.set(k, v);
  });
  const url = `${siteUrl}/products${params.toString() ? `?${params.toString()}` : ''}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Faxio',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@faxio',
      creator: '@faxio',
    },
  };
}
