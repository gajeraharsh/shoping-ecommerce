import { BRAND } from '@/lib/brand';

export default function StructuredData() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: base,
    logo: `${base}/favicon.svg`,
    sameAs: (() => {
      const links = [];
      // Instagram
      if (BRAND?.social?.instagram) {
        const igHandle = String(BRAND.social.instagram).replace('@', '');
        links.push(`https://instagram.com/${igHandle}`);
      }
      // Facebook: allow full URL or page/handle
      if (BRAND?.social?.facebook) {
        const fb = String(BRAND.social.facebook);
        links.push(fb.startsWith('http') ? fb : `https://facebook.com/${fb}`);
      }
      // Twitter/X: optional
      if (BRAND?.social?.twitter) {
        const tw = String(BRAND.social.twitter);
        const normalized = tw.startsWith('http') ? tw : `https://twitter.com/${tw.replace('@', '')}`;
        links.push(normalized);
      }
      // YouTube: allow channel/handle, assume handle if no protocol
      if (BRAND?.social?.youtube) {
        const yt = String(BRAND.social.youtube);
        links.push(yt.startsWith('http') ? yt : `https://youtube.com/@${yt}`);
      }
      return links;
    })(),
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
