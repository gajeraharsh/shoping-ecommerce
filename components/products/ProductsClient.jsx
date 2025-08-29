"use client";

import { useState, useEffect, useMemo, useTransition, useDeferredValue } from 'react';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { getProducts } from '@/services/modules/product/productService';
import { getCategoryTree } from '@/services/modules/category/categoryService';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ProductsClient({
  initialProducts = [],
  initialCount = 0,
  initialCategories = [],
  initialOptions = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Prevent hydration mismatches by deferring UI until mounted
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    setMounted(true);
  }, []);

  const [products, setProducts] = useState(initialProducts);
  // filteredProducts is derived to avoid extra renders and flicker
  const [loading, setLoading] = useState(false);
  // Visual loading avoids quick flashes: only shows skeletons if loading > 150ms
  const [visualLoading, setVisualLoading] = useState(false);
  // Mobile filters drawer open state (mirror header menu behavior)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // Pending filters used only in mobile drawer; applied on Apply button
  const [pendingFilters, setPendingFilters] = useState({});
  // Control visualLoading to reduce flicker (placed after state initialization)
  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setVisualLoading(true), 150);
      return () => { clearTimeout(t); setVisualLoading(false); };
    } else {
      setVisualLoading(false);
    }
  }, [loading]);

  // Lock body scroll when mobile filters are open (mirror Header)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    if (isFiltersOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = prev || '';
      document.body.style.paddingRight = prevPad || '0px';
    }
    return () => {
      document.body.style.overflow = prev || '';
      document.body.style.paddingRight = prevPad || '0px';
    };
  }, [isFiltersOpen]);

  // Close on Escape like Header
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isFiltersOpen) setIsFiltersOpen(false);
    };
    if (isFiltersOpen) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [isFiltersOpen]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: searchParams.get('category_id') || '',
    collection: searchParams.get('collection_id') || '',
    q: searchParams.get('q') || '',
    priceRange: searchParams.get('price') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    sortBy: searchParams.get('sort') || 'newest',
  });
  // Debounced search text state (controlled input)
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  useEffect(() => {
    // keep input in sync if URL/filters change externally
    setSearchText(filters.q || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q]);

  // Debounce typing -> update q filter
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = (searchText || '').trim();
      if (trimmed !== (filters.q || '')) {
        handleFilterChange({ q: trimmed });
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  // restore option_* selections from URL
  useEffect(() => {
    const opt = {};
    for (const [k, v] of Array.from(searchParams.entries())) {
      if (k.startsWith('option_')) opt[k] = v;
    }
    if (Object.keys(opt).length) setFilters((prev) => ({ ...prev, ...opt }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [categoryOptions, setCategoryOptions] = useState(initialCategories);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [productOptions, setProductOptions] = useState(initialOptions);
  const [count, setCount] = useState(initialCount);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 24;
  // Flags to know which filters are already applied server-side via URL
  const serverQActive = Boolean(searchParams.get('q'));
  const serverCategoryActive = Boolean(searchParams.get('category_id'));
  const serverCollectionActive = Boolean(searchParams.get('collection_id'));

  // Map Medusa product to UI shape
  const mapToUiProduct = (p) => {
    // Normalize thumbnail and images to string URLs with protocol/base fixes
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
    // Fallback: derive colors from variant options if not present at product option level
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

    const categories = Array.isArray(p.categories) ? p.categories : [];
    const categoryIds = categories.map((c) => c.id);
    const categoryNames = categories.map((c) => c.name);

    const variantPrices = (p.variants || [])
      .map((v) => {
        // Support both legacy numeric fields and new object-shaped calculated_price
        let cp = null;
        let op = null;
        if (typeof v.calculated_price_incl_tax === 'number') {
          cp = v.calculated_price_incl_tax;
        } else if (typeof v.calculated_price === 'number') {
          cp = v.calculated_price;
        } else if (v.calculated_price && typeof v.calculated_price === 'object') {
          const obj = v.calculated_price;
          // Prefer calculated_amount; fallback to raw_calculated_amount.value
          if (typeof obj.calculated_amount === 'number') cp = obj.calculated_amount;
          else if (obj.raw_calculated_amount?.value != null) cp = Number(obj.raw_calculated_amount.value);
          // Original price
          if (typeof obj.original_amount === 'number') op = obj.original_amount;
          else if (obj.raw_original_amount?.value != null) op = Number(obj.raw_original_amount.value);
        }
        // Also consider legacy original_price numeric on variant
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
      categoryIds,
      categoryNames,
      optionsMap,
      rating: typeof p.rating === 'number' ? p.rating : 0,
      review_count: typeof p.review_count === 'number' ? p.review_count : 0,
      reviews: typeof p.review_count === 'number' ? p.review_count : 0, // backward compat
      stock: 999,
    };
  };

  // Derive dynamic options/sizes/colors whenever products change
  useEffect(() => {
    const sizesSet = new Set();
    const colorsSet = new Set();
    const optionValuesMap = new Map();
    products.forEach((mp) => {
      (mp.sizes || []).forEach((s) => sizesSet.add(String(s)));
      (mp.colors || []).forEach((c) => colorsSet.add(String(c)));
      const om = mp.optionsMap || {};
      Object.entries(om).forEach(([titleLower, values]) => {
        if (!optionValuesMap.has(titleLower)) optionValuesMap.set(titleLower, new Set());
        const set = optionValuesMap.get(titleLower);
        values.forEach((v) => set.add(String(v)));
      });
    });
    setSizeOptions(Array.from(sizesSet));
    setColorOptions(Array.from(colorsSet));
    // Only set generic options if not provided from server
    if (!initialOptions?.length) {
      const generic = Array.from(optionValuesMap.entries())
        .filter(([t]) => t !== 'size' && t !== 'color')
        .map(([t, set]) => ({ title: t.replace(/\b\w/g, (m) => m.toUpperCase()), values: Array.from(set) }));
      setProductOptions(generic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // Keep categories from server; if empty, fetch client-side
  useEffect(() => {
    if (initialCategories?.length) return;
    let cancelled = false;
    (async () => {
      try {
        const tree = await getCategoryTree();
        if (cancelled) return;
        const flatten = (nodes = []) => nodes.flatMap((n) => [{ value: n.id, label: n.name }, ...(n.category_children?.length ? flatten(n.category_children) : [])]);
        const opts = flatten(tree);
        setCategoryOptions(opts);
      } catch (e) {
        setCategoryOptions([]);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Defer heavy filtering to keep UI responsive during typing/updates
  const deferredFilters = useDeferredValue(filters);
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // When category is applied on server via category_id, do not re-filter locally by category
    if (!serverCategoryActive && deferredFilters.category) {
      const cid = String(deferredFilters.category);
      filtered = filtered.filter((product) => Array.isArray(product.categoryIds) && product.categoryIds.includes(cid));
    }

    if (deferredFilters.priceRange) {
      const [min, max] = deferredFilters.priceRange.split('-').map((n) => Number(n));
      filtered = filtered.filter((product) => product.price >= (min || 0) && product.price <= (max || Number.MAX_SAFE_INTEGER));
    }

    if (deferredFilters.size) {
      filtered = filtered.filter((product) => product.sizes?.includes(deferredFilters.size));
    }

    if (deferredFilters.color) {
      filtered = filtered.filter((product) =>
        (product.colors || [])
          .map((c) => String(c).toLowerCase())
          .includes(String(deferredFilters.color).toLowerCase())
      );
    }

    // Text search (debounced via searchText -> filters.q). If q is active on server, avoid re-filtering locally.
    if (!serverQActive && deferredFilters.q && String(deferredFilters.q).trim().length) {
      const q = String(deferredFilters.q).trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const name = String(p.name || '').toLowerCase();
        const categories = (p.categoryNames || []).map((c) => String(c).toLowerCase());
        const optionsJoined = Object.entries(p.optionsMap || {})
          .flatMap(([, vals]) => (vals || []).map((v) => String(v).toLowerCase()));
        return (
          name.includes(q) ||
          categories.some((c) => c.includes(q)) ||
          optionsJoined.some((v) => v.includes(q))
        );
      });
    }

    Object.entries(deferredFilters).forEach(([key, val]) => {
      if (!val || !key.startsWith('option_')) return;
      const optTitle = key.replace('option_', '').toLowerCase();
      filtered = filtered.filter((product) => {
        const values = product.optionsMap?.[optTitle] || [];
        return values.map(String).map((s) => s.toLowerCase()).includes(String(val).toLowerCase());
      });
    });

    switch (deferredFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'newest':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }

    return filtered;
  }, [products, deferredFilters, serverCategoryActive, serverQActive]);

  // Re-fetch from Medusa ONLY when server-relevant URL params change (avoid option_* causing refetch flicker)
  const serverParamValues = useMemo(() => {
    return JSON.stringify({
      q: searchParams.get('q') || '',
      category_id: searchParams.get('category_id') || '',
      collection_id: searchParams.get('collection_id') || '',
      sort: searchParams.get('sort') || '',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || String(limit),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, limit]);
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = buildQueryParams();
        const res = await getProducts(params);
        const list = Array.isArray(res?.products) ? res.products : (Array.isArray(res) ? res : []);
        const mapped = list.map(mapToUiProduct);
        if (!cancelled) {
          setProducts(mapped);
          // let client-side filters effect compute filteredProducts to avoid double updates/flicker
          setCount(Number(res?.count) || mapped.length);
        }
      } catch (e) {
        if (!cancelled) {
          setProducts([]);
          setCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverParamValues]);

  const buildQueryParams = () => {
    const params = {
      limit,
      offset: (page - 1) * limit,
      fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories,+wishlist',
    };

    if (typeof window !== 'undefined') {
      const cartId = localStorage.getItem('cart_id');
      if (cartId) params.cart_id = cartId;
    }
    if (!params.cart_id && process.env.NEXT_PUBLIC_MEDUSA_REGION_ID) {
      params.region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
    }
    if (process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL) {
      params.sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL;
    }

    const q = searchParams.get('q');
    const category_id = searchParams.get('category_id');
    const collection_id = searchParams.get('collection_id');
    const sort = searchParams.get('sort');
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

    return params;
  };

  const handleFilterChange = (newFilters) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters }));

      const sp = new URLSearchParams(searchParams.toString());
      if ('category' in newFilters) {
        const v = newFilters.category; if (v) sp.set('category_id', v); else sp.delete('category_id'); sp.set('page', '1');
      }
      if ('collection' in newFilters) {
        const v = newFilters.collection; if (v) sp.set('collection_id', v); else sp.delete('collection_id'); sp.set('page', '1');
      }
      if ('q' in newFilters) {
        const v = newFilters.q; if (v) sp.set('q', v); else sp.delete('q'); sp.set('page', '1');
      }
      if ('sortBy' in newFilters) {
        const v = newFilters.sortBy; if (v) sp.set('sort', v); else sp.delete('sort');
      }
      // Keep dynamic option_* filters client-side to avoid unnecessary URL changes and re-renders

      // For filter/search changes, replace URL to avoid history spam and heavy navigations
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    });
  };

  const totalPages = Math.max(1, Math.ceil(count / limit));
  const goToPage = (p) => {
    startTransition(() => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', String(Math.min(Math.max(1, p), totalPages)));
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    });
  };

  // Until mounted on client, render a stable placeholder to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Note: Do not early-return on loading to avoid full page flicker. We'll show inline skeletons instead.

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Our Collections</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium fashion pieces, 
              crafted for the modern woman who values quality and style.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
            {/* Search */}
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="hidden md:block w-56 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm min-h-[44px]"
            />
            <button
              onClick={() => { setPendingFilters(filters); setIsFiltersOpen(true); }}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px] text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors touch-manipulation ${viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors touch-manipulation ${viewMode === 'list' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm min-h-[44px] touch-manipulation"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div>
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
                sizes={sizeOptions}
                colors={colorOptions}
                productOptions={productOptions}
              />
            </div>
          </div>

          {/* Mobile Filters Drawer (mirrors Header mobile menu) */}
          {isFiltersOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 lg:hidden"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
                  onClick={() => setIsFiltersOpen(false)}
                />
              </div>
              {/* Panel */}
              <div
                className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl lg:hidden transform transition-all duration-300 ease-out translate-x-0 animate-in slide-in-from-left-full"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="h-[calc(100vh-60px-68px)] overflow-y-auto p-4">
                  <ProductFilters
                    filters={pendingFilters}
                    onFilterChange={(nf) => setPendingFilters((prev) => ({ ...prev, ...nf }))}
                    categories={categoryOptions}
                    sizes={sizeOptions}
                    colors={colorOptions}
                    productOptions={productOptions}
                  />
                </div>
                {/* Sticky footer actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="flex-1 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { handleFilterChange(pendingFilters); setIsFiltersOpen(false); }}
                    className="flex-1 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Products Grid */}
          <div className={`flex-1 min-w-0 ${isPending ? 'opacity-95' : ''}`}>
            {visualLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-200">
                {[...Array(limit || 12)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => {
                    const base = { category: '', priceRange: '', size: '', color: '', sortBy: 'newest' };
                    const dynamic = {};
                    (productOptions || []).forEach((opt) => { dynamic[`option_${opt.title}`] = ''; });
                    setFilters({ ...base, ...dynamic });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 transition-opacity duration-200 ${viewMode === 'grid' ? 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} priority={idx < 4} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {count > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className={`px-4 py-2 rounded-full border text-sm ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} border-gray-200 dark:border-gray-700`}
                >
                  Prev
                </button>
                {/* Page numbers (compact) */}
                {Array.from({ length: Math.max(1, Math.ceil(count / limit)) }).slice(0, 7).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 rounded-full text-sm border ${p === page ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      {p}
                    </button>
                  );
                })}
                {Math.ceil(count / limit) > 7 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => goToPage(Math.ceil(count / limit))}
                      className={`w-10 h-10 rounded-full text-sm border ${Math.ceil(count / limit) === page ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      {Math.ceil(count / limit)}
                    </button>
                  </>
                )}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= Math.ceil(count / limit)}
                  className={`px-4 py-2 rounded-full border text-sm ${page >= Math.ceil(count / limit) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} border-gray-200 dark:border-gray-700`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
