"use client";

import { useState, useEffect, useMemo } from 'react';
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
  useEffect(() => {
    setMounted(true);
  }, []);

  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
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

  // Map Medusa product to UI shape
  const mapToUiProduct = (p) => {
    const images = (p.images?.map((img) => img.url).filter(Boolean) || []);
    const primaryImage = p.thumbnail || images[0] || '/placeholder.png';

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

  // Apply client-side filters after Medusa response
  useEffect(() => {
    let filtered = [...products];

    if (filters.category) {
      const cid = String(filters.category);
      filtered = filtered.filter((product) => Array.isArray(product.categoryIds) && product.categoryIds.includes(cid));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map((n) => Number(n));
      filtered = filtered.filter((product) => product.price >= (min || 0) && product.price <= (max || Number.MAX_SAFE_INTEGER));
    }

    if (filters.size) {
      filtered = filtered.filter((product) => product.sizes?.includes(filters.size));
    }

    if (filters.color) {
      filtered = filtered.filter((product) =>
        (product.colors || [])
          .map((c) => String(c).toLowerCase())
          .includes(String(filters.color).toLowerCase())
      );
    }

    // Text search (debounced via searchText -> filters.q)
    if (filters.q && String(filters.q).trim().length) {
      const q = String(filters.q).trim().toLowerCase();
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

    Object.entries(filters).forEach(([key, val]) => {
      if (!val || !key.startsWith('option_')) return;
      const optTitle = key.replace('option_', '').toLowerCase();
      filtered = filtered.filter((product) => {
        const values = product.optionsMap?.[optTitle] || [];
        return values.map(String).map((s) => s.toLowerCase()).includes(String(val).toLowerCase());
      });
    });

    switch (filters.sortBy) {
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

    setFilteredProducts(filtered);
  }, [products, filters]);

  // Re-fetch from Medusa when URL server-side params change
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
          setFilteredProducts(mapped);
          setCount(Number(res?.count) || mapped.length);
        }
      } catch (e) {
        if (!cancelled) {
          setProducts([]);
          setFilteredProducts([]);
          setCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const buildQueryParams = () => {
    const params = {
      limit,
      offset: (page - 1) * limit,
      fields: '+variants,+variants.options,+options,+images,+tags,+collection,+categories',
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
    Object.entries(newFilters).forEach(([k, v]) => {
      if (k.startsWith('option_')) { if (v) sp.set(k, String(v)); else sp.delete(k); sp.set('page', '1'); }
    });

    router.push(`${pathname}?${sp.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(count / limit));
  const goToPage = (p) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(Math.min(Math.max(1, p), totalPages)));
    router.push(`${pathname}?${sp.toString()}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(limit || 12)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => handleFilterChange({})}
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

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => setFilters({ category: '', priceRange: '', size: '', color: '', sortBy: 'newest' })}
                  className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
