"use client";

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { getProducts } from '@/services/modules/product/productService';

// Lightweight mapper from Medusa product to UI product used by ProductCard
function mapToUiProduct(p) {
  const normalizeUrl = (u) => {
    if (!u) return '';
    let s = String(u);
    if (s.startsWith('//')) s = 'https:' + s;
    if (s.startsWith('http://')) s = s.replace(/^http:\/\//, 'https://');
    if (s.startsWith('/')) {
      const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '';
      return base ? `${base.replace(/\/$/, '')}${s}` : s;
    }
    return s;
  };
  const rawImages = (p.images?.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean) || []);
  const images = rawImages.map(normalizeUrl);
  const rawTn = typeof p.thumbnail === 'string' ? p.thumbnail : (p.thumbnail?.url || '');
  const tn = normalizeUrl(rawTn);
  const primaryImage = tn || images[0] || '/placeholder.png';

  const sizeOption = p.options?.find((o) => /size/i.test(o.title));
  const colorOption = p.options?.find((o) => /(colou?r|colorway|shade|tone)/i.test(o.title));
  const sizes = sizeOption?.values?.map((v) => (v?.value ?? v)).filter(Boolean).map((s) => String(s).trim()) || [];
  let colors = colorOption?.values?.map((v) => (v?.value ?? v)).filter(Boolean).map((c) => String(c).trim()) || [];
  if ((!colors || colors.length === 0) && Array.isArray(p.variants)) {
    const variantColors = new Set();
    p.variants.forEach((variant) => {
      (variant.options || []).forEach((vo) => {
        const title = vo?.option?.title || '';
        if (/(colou?r|colorway|shade|tone)/i.test(String(title))) {
          if (vo?.value) variantColors.add(String(vo.value).trim());
        }
      });
    });
    colors = Array.from(variantColors);
  }

  const optionsMap = {};
  (p.options || []).forEach((o) => {
    const key = String(o.title || '').toLowerCase();
    const vals = (o.values || []).map((v) => v.value || v).filter(Boolean);
    if (key) optionsMap[key] = Array.from(new Set(vals));
  });

  const variantPrices = (p.variants || [])
    .map((v) => {
      let cp = null;
      let op = null;
      if (typeof v.calculated_price_incl_tax === 'number') {
        cp = v.calculated_price_incl_tax;
      } else if (typeof v.calculated_price === 'number') {
        cp = v.calculated_price;
      } else if (v.calculated_price && typeof v.calculated_price === 'object') {
        const obj = v.calculated_price;
        if (typeof obj.calculated_amount === 'number') cp = obj.calculated_amount;
        else if (obj.raw_calculated_amount?.value != null) cp = Number(obj.raw_calculated_amount.value);
        if (typeof obj.original_amount === 'number') op = obj.original_amount;
        else if (obj.raw_original_amount?.value != null) op = Number(obj.raw_original_amount.value);
      }
      if (op == null && typeof v.original_price === 'number') op = v.original_price;
      return { cp, op };
    })
    .filter(({ cp }) => typeof cp === 'number');
  const minPrice = variantPrices.length ? Math.min(...variantPrices.map((v) => v.cp)) : null;
  const anyOriginal = variantPrices.find((v) => typeof v.op === 'number' && v.op > (v.cp ?? 0));
  const originalPrice = anyOriginal?.op || null;
  const discount = originalPrice && minPrice ? Math.round(((originalPrice - minPrice) / originalPrice) * 100) : null;

  return {
    id: p.id,
    name: p.title,
    images: [primaryImage],
    price: typeof minPrice === 'number' ? Math.round(minPrice / 1) : 0,
    originalPrice: typeof originalPrice === 'number' ? Math.round(originalPrice / 1) : undefined,
    discount: discount || undefined,
    is_wishlist: Boolean(p?.is_wishlist),
    colors,
    sizes,
    optionsMap,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    review_count: typeof p.review_count === 'number' ? p.review_count : 0,
    stock: 999,
  };
}

export default function CollectionProductsSection({ title, description, collectionId, limit = 8 }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProducts({
          collection_id: collectionId,
          limit,
          offset: 0,
          fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories,+wishlist',
        });
        const list = Array.isArray(res?.products) ? res.products : (Array.isArray(res) ? res : []);
        const mapped = list.map(mapToUiProduct);
        if (!cancelled) setProducts(mapped);
      } catch (e) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [collectionId, limit]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[...Array(limit)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
