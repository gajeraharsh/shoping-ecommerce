import { BRAND } from '@/lib/brand';

export default function StructuredData() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: base,
    logo: `${base}/favicon.svg`,
    sameAs: [
      `https://instagram.com/${BRAND.social.instagram.replace('@','')}`,
      `https://facebook.com/${BRAND.social.facebook}`,
      `https://twitter.com/${BRAND.social.twitter.replace('@','')}`,
      `https://youtube.com/@${BRAND.social.youtube}`,
    ],
    contactPoint: [{
      '@type': 'ContactPoint',
      email: BRAND.contact.email,
      telephone: BRAND.contact.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en'],
    }],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    url: base,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
