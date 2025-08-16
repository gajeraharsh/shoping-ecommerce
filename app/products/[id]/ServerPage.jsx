import ProductDetailClient from './ClientPage';
import { getProductById } from '@/services/modules/product/productService';

export default async function ServerProductPage({ params, searchParams }) {
  const sp = await searchParams;
  const id = (await params)?.id;

  const query = {
    fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories,+metadata',
  };
  if (process.env.NEXT_PUBLIC_MEDUSA_REGION_ID) {
    query.region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL) {
    query.sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL;
  }

  let product = null;
  try {
    const res = await getProductById(id, { params: query });
    const p = res?.product || res; // our apiClient returns response.data

    // Server-side log of raw data as requested
    console.log('[Medusa][Product Detail] Raw product response:', JSON.stringify(p, null, 2));

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
    const reviews = Number(md.reviews_count) || 0;

    product = {
      id: p.id,
      name: p.title,
      images: allImages.length ? allImages : ['/placeholder.png'],
      price: typeof price === 'number' ? Math.round(price / 1) : 0,
      originalPrice: typeof originalPrice === 'number' ? Math.round(originalPrice / 1) : undefined,
      discount: discount || undefined,
      colors,
      sizes,
      category,
      rating: 4.6,
      reviews,
      stock: 999,
      description,
      highlights,
      care,
      fabric,
      deliveryTime,
      returnPolicy,
    };
  } catch (e) {
    console.error('[Medusa][Product Detail] Failed fetching product', e?.response?.data || e?.message || e);
    product = null;
  }

  return <ProductDetailClient initialProduct={product} />;
}
