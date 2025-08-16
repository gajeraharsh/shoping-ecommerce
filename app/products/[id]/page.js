export { default } from './ServerPage';

import { getProductById } from '@/services/modules/product/productService';

export const revalidate = 300; // cache page for 5 minutes

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await getProductById(id, { params: { fields: '+images,+thumbnail,+metadata,+title,+description' } });
    const p = res?.product || res || {};
    const title = p?.title ? `${p.title} | Faxio` : 'Product | Faxio';
    const description = p?.description || p?.subtitle || 'Discover quality products on Faxio.';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
    const url = `${siteUrl}/products/${id}`;
    const images = (p?.images?.map((i) => i.url).filter(Boolean) || []).slice(0, 4);
    const ogImages = images.length ? images : (p?.thumbnail ? [p.thumbnail] : []);
    const keywords = Array.isArray(p?.tags)
      ? p.tags.map((t) => t.name || '').filter(Boolean)
      : (Array.isArray(p?.metadata?.keywords) ? p.metadata.keywords : []);

    return {
      title,
      description,
      keywords,
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
        images: ogImages.map((src) => ({ url: src })),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImages,
        site: '@faxio',
        creator: '@faxio',
      },
    };
  } catch (_) {
    return {
      title: 'Product | Faxio',
      description: 'Discover quality products on Faxio.',
    };
  }
}
