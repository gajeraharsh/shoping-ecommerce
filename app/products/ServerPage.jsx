import ProductsClient from '@/components/products/ProductsClient';
import { getProducts } from '@/services/modules/product/productService';
import { getCategoryTree } from '@/services/modules/category/categoryService';
import PaginationLinks from '@/components/seo/PaginationLinks';

// Server Component: first paint is fully rendered HTML for SEO
export default async function ServerProductsPage({ searchParams }) {
  // Next.js sync dynamic APIs: searchParams is thenable in server components
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const limit = Number(sp?.limit) || 24;
  const offset = (page - 1) * limit;

  const params = {
    limit,
    offset,
    fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories',
  };

  // Pricing context on server: region_id and sales_channel only
  if (process.env.NEXT_PUBLIC_MEDUSA_REGION_ID) {
    params.region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL) {
    params.sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL;
  }

  const { q, category_id, collection_id, sort } = sp || {};
  if (q) params.q = q;
  if (category_id) params.category_id = category_id;
  if (collection_id) params.collection_id = collection_id;
  if (sort) {
    const map = {
      'price-low': 'title',
      'price-high': '-title',
      'newest': '-created_at',
      'popular': '-created_at',
      'title': 'title',
      '-title': '-title',
      'created_at': 'created_at',
      '-created_at': '-created_at',
    };
    params.order = map[sort] || sort;
  }

  // Fetch from Medusa
  let products = [];
  let count = 0;
  try {
    const res = await getProducts(params);
    const list = Array.isArray(res?.products) ? res.products : (Array.isArray(res) ? res : []);
    products = list;
    count = Number(res?.count) || list.length || 0;
  } catch (e) {
    products = [];
    count = 0;
  }

  // Map to UI shape for initial render
  const mapToUiProduct = (p) => {
    const images = (p.images?.map((img) => img.url).filter(Boolean) || []);
    const thumbnail = p.thumbnail ? [p.thumbnail] : [];
    const allImages = images.length ? images : thumbnail;

    const sizeOption = p.options?.find((o) => /size/i.test(o.title));
    const colorOption = p.options?.find((o) => /color/i.test(o.title));
    const sizes = sizeOption?.values?.map((v) => v.value || v) || [];
    const colors = colorOption?.values?.map((v) => (v.value || v)) || [];

    const optionsMap = {};
    (p.options || []).forEach((o) => {
      const key = String(o.title || '').toLowerCase();
      const vals = (o.values || []).map((v) => v.value || v).filter(Boolean);
      if (key) optionsMap[key] = Array.from(new Set(vals));
    });

    const categories = Array.isArray(p.categories) ? p.categories : [];
    const categoryIds = categories.map((c) => c.id);
    const categoryNames = categories.map((c) => c.name);

    const variantPrices = (p.variants || [])
      .map((v) => ({
        cp: v.calculated_price_incl_tax ?? v.calculated_price ?? null,
        op: v.original_price ?? null,
      }))
      .filter(({ cp }) => typeof cp === 'number');
    const minPrice = variantPrices.length ? Math.min(...variantPrices.map((v) => v.cp)) : null;
    const anyOriginal = variantPrices.find((v) => typeof v.op === 'number' && v.op > (v.cp ?? 0));
    const originalPrice = anyOriginal?.op || null;
    const discount = originalPrice && minPrice ? Math.round(((originalPrice - minPrice) / originalPrice) * 100) : null;

    return {
      id: p.id,
      name: p.title,
      images: allImages.length ? allImages : ['/placeholder.png'],
      price: typeof minPrice === 'number' ? Math.round(minPrice / 1) : 0,
      originalPrice: typeof originalPrice === 'number' ? Math.round(originalPrice / 1) : undefined,
      discount: discount || undefined,
      colors,
      sizes,
      categoryIds,
      categoryNames,
      optionsMap,
      rating: 4.6,
      reviews: 0,
      stock: 999,
    };
  };

  const mapped = products.map(mapToUiProduct);

  // Categories for initial render (flattened)
  let categoryOptions = [];
  try {
    const tree = await getCategoryTree();
    const flatten = (nodes = []) => nodes.flatMap((n) => [
      { value: n.id, label: n.name },
      ...(n.category_children?.length ? flatten(n.category_children) : []),
    ]);
    categoryOptions = flatten(tree);
  } catch (e) {
    categoryOptions = [];
  }

  // Derive initial dynamic options (excluding size/color)
  const optionValuesMap = new Map();
  mapped.forEach((mp) => {
    const om = mp.optionsMap || {};
    Object.entries(om).forEach(([titleLower, values]) => {
      if (titleLower === 'size' || titleLower === 'color') return;
      if (!optionValuesMap.has(titleLower)) optionValuesMap.set(titleLower, new Set());
      const set = optionValuesMap.get(titleLower);
      values.forEach((v) => set.add(String(v)));
    });
  });
  const initialOptions = Array.from(optionValuesMap.entries()).map(([t, set]) => ({
    title: t.replace(/\b\w/g, (m) => m.toUpperCase()),
    values: Array.from(set),
  }));

  // ItemList JSON-LD for the listing page
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: mapped.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1 + offset,
      url: `${siteUrl}/products/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <>
      <PaginationLinks basePath="/products" page={page} limit={limit} count={count} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <ProductsClient
        initialProducts={mapped}
        initialCount={count}
        initialCategories={categoryOptions}
        initialOptions={initialOptions}
      />
    </>
  );
}
