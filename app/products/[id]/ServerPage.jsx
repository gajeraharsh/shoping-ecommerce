import ProductDetailClient from './ClientPage';
import { getProductById } from '@/services/modules/product/productService';
import { getProductReviews } from '@/services/modules/review/reviewService';
import { notFound } from 'next/navigation';

// Enable ISR so subsequent reloads are served from cache (reduces flicker and speeds up reloads)
export const revalidate = 300; // seconds

export default async function ServerProductPage({ params, searchParams }) {
  const sp = await searchParams;
  const { id } = await params;

  const query = {
    // include wishlist to hint backend and preserve consistency
    fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories,+metadata,+wishlist',
  };
  if (process.env.NEXT_PUBLIC_MEDUSA_REGION_ID) {
    query.region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL) {
    query.sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL;
  }

  let product = null;
  try {
    // Run product and reviews requests in parallel to reduce server response time
    const productPromise = getProductById(id, { params: query });
    const reviewsPromise = getProductReviews(id, { limit: 3, offset: 0, order: '-created_at' }).catch(() => null);

    const res = await productPromise;
    const p = res?.product || res; // our apiClient returns response.data
    // Server-side log of raw data as requested

    // Map Medusa product to UI shape expected by client
    const images = (p?.images?.map((img) => img.url).filter(Boolean) || []);
    const thumbnail = p?.thumbnail ? [p.thumbnail] : [];
    const allImages = images.length ? images : thumbnail;

    const sizeOption = p?.options?.find((o) => /size/i.test(o.title || ''));
    const colorOption = p?.options?.find((o) => /color/i.test(o.title || ''));
    const sizes = sizeOption?.values?.map((v) => v.value || v) || [];
    const colors = colorOption?.values?.map((v) => v.value || v) || [];

    const categories = Array.isArray(p?.categories) ? p.categories : [];
    const categoryNames = categories.map((c) => c.name).filter(Boolean);
    const category = categoryNames[0] || 'general';

    // Normalize Medusa variant pricing (supports both numeric and object forms)
    const variantPrices = (p?.variants || [])
      .map((v) => {
        const cpObj = v?.calculated_price;
        const cp =
          typeof v?.calculated_price_incl_tax === 'number'
            ? v.calculated_price_incl_tax
            : typeof v?.calculated_price === 'number'
            ? v.calculated_price
            : typeof cpObj?.calculated_amount === 'number'
            ? cpObj.calculated_amount
            : null;
        const op =
          typeof v?.original_price === 'number'
            ? v.original_price
            : typeof cpObj?.original_amount === 'number'
            ? cpObj.original_amount
            : null;
        return { cp, op };
      })
      .filter(({ cp }) => typeof cp === 'number');

    // Pick display price as the minimum calculated price among variants
    const price = variantPrices.length ? Math.min(...variantPrices.map((v) => v.cp)) : null;

    // Prefer the original price corresponding to the selected (min) calculated price
    let originalPrice = null;
    if (variantPrices.length && typeof price === 'number') {
      const matched = variantPrices.find((v) => v.cp === price);
      if (matched && typeof matched.op === 'number' && matched.op > price) {
        originalPrice = matched.op;
      } else {
        // Fallback: any original price greater than its calculated price
        const anyOriginal = variantPrices.find((v) => typeof v.op === 'number' && v.op > (v.cp ?? 0));
        originalPrice = anyOriginal?.op || null;
      }
    }

    const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

    // Description and Key Features/Highlights mapping with sane fallbacks
    const description = p?.description || p?.subtitle || '';
    const md = p?.metadata || {};
    const toList = (val) => {
      // If already an array, normalize to strings and trim
      if (Array.isArray(val)) {
        return val
          .map((v) => (typeof v === 'string' ? v : String(v)))
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (typeof val === 'string') {
        let s = val.trim();
        // Try direct JSON first
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) {
            return parsed
              .map((v) => (typeof v === 'string' ? v : String(v)))
              .map((x) => x.trim())
              .filter(Boolean);
          }
        } catch (_) {
          // Not valid JSON, continue with cleaning heuristics
        }
        // Remove surrounding brackets if present: [ "a" "b" ] or ["a","b"]
        if (s.startsWith('[') && s.endsWith(']')) {
          s = s.slice(1, -1);
        }
        // Insert commas where users put quoted items on new lines or with spaces
        // Convert patterns like "A"\n"B" or "A"  "B" into "A","B"
        s = s.replace(/"\s*[\r\n]+\s*"/g, '","');
        s = s.replace(/"\s+"/g, '","');
        // Now split on commas or newlines
        return s
          .split(/[\r\n,]+/)
          .map((part) => part.trim())
          .map((part) => part.replace(/^\"|\"$/g, '')) // strip surrounding quotes
          .filter(Boolean);
      }
      return [];
    };
    let highlights = [];
    if (md.key_features !== undefined) {
      highlights = toList(md.key_features);
    } else if (md.highlights !== undefined) {
      highlights = toList(md.highlights);
    } else if (Array.isArray(p?.tags) && p.tags.length) {
      highlights = p.tags.map((t) => t.name).filter(Boolean);
    }

    const care = md.care || 'Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Iron on low heat if needed.';
    const fabric = md.fabric || md.material || p?.material || 'Cotton';
    const deliveryTime = md.delivery_time || '3–5 business days';
    const returnPolicy = md.return_policy || '30-day return policy. No questions asked.';
    // Prefer server-aggregated review stats from Medusa route augmentation
    const aggStats = (p?.metadata && p.metadata.review_stats) ? p.metadata.review_stats : (p?.review_stats || null);
    const aggAverage = typeof aggStats?.average === 'number' ? aggStats.average : Number(aggStats?.average ?? 0);
    const aggCount = typeof aggStats?.count === 'number' ? aggStats.count : Number(aggStats?.count ?? 0);
    // Fetch reviews count from API on server (already requested in parallel above)
    let reviews = 0;
    const reviewsRes = await reviewsPromise;
    if (reviewsRes) {
      // Support both { reviews: [], count } or [] shapes
      reviews =
        typeof reviewsRes?.count === 'number'
          ? reviewsRes.count
          : Array.isArray(reviewsRes?.reviews)
          ? reviewsRes.reviews.length
          : Array.isArray(reviewsRes)
          ? reviewsRes.length
          : 0;
    }
    // Prefer aggregated count from product.metadata.review_stats (fallback to dedicated reviews API)
    const review_count = aggCount > 0 ? aggCount : (typeof p?.review_count === 'number' ? p.review_count : reviews);

    // Build a simplified variant matrix: [{ id, options: { Size: 'M', Color: 'Red', ... } }]
    const optionIdToTitle = new Map(
      (Array.isArray(p?.options) ? p.options : []).map((o) => [o.id, o.title])
    )
    const simplifiedVariants = (Array.isArray(p?.variants) ? p.variants : [])
      .map((v) => {
        const opts = {}
        const varOpts = Array.isArray(v?.options) ? v.options : []
        varOpts.forEach((vo) => {
          const t = optionIdToTitle.get(vo.option_id)
          if (t) opts[t] = vo.value
        })
        return { id: v.id, options: opts }
      })

    
    product = {
      id: p.id,
      name: p.title,
      images: allImages.length ? allImages : ['/placeholder.png'],
      price: typeof price === 'number' ? Math.round(price / 1) : 0,
      originalPrice: typeof originalPrice === 'number' ? Math.round(originalPrice / 1) : undefined,
      discount: discount || undefined,
      colors,
      sizes,
      variants: simplifiedVariants,
      category,
      // Prefer aggregated average rating from metadata.review_stats
      rating: aggAverage > 0 ? aggAverage : (typeof p?.rating === 'number' ? p.rating : 0),
      review_count,
      reviews: review_count, // backward compatibility for components expecting `reviews`
      // Pass through wishlist flag from server so client can use it
      is_wishlist: !!p?.is_wishlist,
      stock: 999,
      description,
      highlights,
      // Pass through raw metadata from Medusa so the client can parse specification/highlights
      metadata: p?.metadata || {},
      care,
      fabric,
      deliveryTime,
      returnPolicy,
    };
  } catch (e) {
    console.error('[Medusa][Product Detail] Failed fetching product', e?.response?.data || e?.message || e);
    product = null;
  }

  // If product is not found, render Next.js 404 page for correct SEO
  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
  const productUrl = product?.id ? `${siteUrl}/products/${product.id}` : `${siteUrl}/products`;

  // Build Review JSON-LD array (best-effort mapping)
  let reviewLd = [];
  try {
    const rr = Array.isArray(reviewsRes?.reviews)
      ? reviewsRes.reviews
      : (Array.isArray(reviewsRes) ? reviewsRes : []);
    reviewLd = rr.slice(0, 3).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r?.user?.name || r?.author_name || 'Verified Buyer' },
      datePublished: r?.created_at || r?.date || undefined,
      reviewBody: r?.comment || r?.content || r?.text || undefined,
      name: r?.title || `Review for ${product?.name || 'product'}`,
      reviewRating: (typeof r?.rating === 'number' || typeof r?.rate === 'number')
        ? { '@type': 'Rating', ratingValue: r?.rating ?? r?.rate, bestRating: 5, worstRating: 1 }
        : undefined,
    })).filter(Boolean);
  } catch (_) {
    reviewLd = [];
  }

  const productLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: Array.isArray(product.images) ? product.images : [],
        description: product.description,
        sku: `MOD${String(product.id || '').padStart(4, '0')}`,
        brand: { '@type': 'Brand', name: 'Faxio' },
        aggregateRating:
          product.rating && product.reviews
            ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews }
            : undefined,
        review: reviewLd.length ? reviewLd : undefined,
        offers:
          typeof product.price === 'number'
            ? {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'INR',
                price: product.price,
                availability: 'https://schema.org/InStock',
              }
            : undefined,
      }
    : null;

  const breadcrumbLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: { '@id': siteUrl, name: 'Home' },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: { '@id': productUrl, name: product.name },
          },
        ],
      }
    : null;

  return (
    <>
      {productLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      )}
      {breadcrumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      )}
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
