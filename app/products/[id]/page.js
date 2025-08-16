export { default } from './ServerPage';

import { getProductById } from '@/services/modules/product/productService';

export const revalidate = 300; // cache page for 5 minutes

export async function generateMetadata({ params }) {
  const id = params?.id;
  try {
    const res = await getProductById(id, { params: { fields: '+images,+thumbnail,+metadata,+title,+description' } });
    const p = res?.product || res || {};
    const title = p?.title ? `${p.title} | Faxio` : 'Product | Faxio';
    const description = p?.description || p?.subtitle || 'Discover quality products on Faxio.';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
    const url = `${siteUrl}/products/${id}`;
    const images = (p?.images?.map((i) => i.url).filter(Boolean) || []).slice(0, 4);
    const ogImages = images.length ? images : (p?.thumbnail ? [p.thumbnail] : []);

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        images: ogImages.map((src) => ({ url: src })),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImages,
      },
    };
  } catch (_) {
    return {
      title: 'Product | Faxio',
      description: 'Discover quality products on Faxio.',
    };
  }
}
