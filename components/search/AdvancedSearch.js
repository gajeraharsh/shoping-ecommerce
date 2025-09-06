'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { getProducts } from '@/services/modules/product/productService';
import { getCategoryTree } from '@/services/modules/category/categoryService';
import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';

export default function AdvancedSearch({ isOpen, onClose, onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // recentSearches items shape: { type: 'keyword'|'product'|'category', value: string, id?: string }
  const [recentSearches, setRecentSearches] = useState([]);
  // trendingSearches items shape: { type: 'category', id: string, value: string }
  const [trendingSearches, setTrendingSearches] = useState([]);
  const inputRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset input and suggestions when popup closes so it reopens fresh
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  // Mount flag for portals and body scroll lock when open
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load trending searches from Medusa categories (flattened categories with ids)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tree = await getCategoryTree({ include_descendants_tree: true, limit: 100 });
        if (cancelled) return;
        const flatten = (nodes = []) => nodes.flatMap((n) => [
          { type: 'category', id: n.id, value: n.name },
          ...(n.category_children?.length ? flatten(n.category_children) : []),
        ]);
        const items = flatten(tree)
          .filter((it) => it.id && it.value)
          .reduce((acc, cur) => {
            if (!acc.find((x) => x.id === cur.id)) acc.push(cur);
            return acc;
          }, []);
        setTrendingSearches(items.slice(0, 12));
      } catch (e) {
        setTrendingSearches([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevPadding = document.body.style.paddingRight;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPadding;
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    // Load recent searches from localStorage and migrate legacy string list
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        let items = Array.isArray(parsed) ? parsed : [];
        // Migrate strings -> typed keyword items
        items = items.map((it) => {
          if (typeof it === 'string') return { type: 'keyword', value: it };
          return it;
        }).filter((it) => it && it.value);
        setRecentSearches(items.slice(0, 10));
      } catch (_) {
        // ignore
      }
    }
  }, []);

  // Fetch live suggestions from Medusa when user types
  useEffect(() => {
    let cancelled = false;
    const fetchSuggestions = async () => {
      const q = (query || '').trim();
      if (!q) {
        setSuggestions([]);
        return;
      }
      // debounce a bit
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      try {
        // apiClient returns response.data directly, not { data }
        const res = await getProducts({ q, limit: 6 });
        // Expect Medusa shape: { products, count, offset, limit }
        const items = Array.isArray(res?.products) ? res.products : (Array.isArray(res?.data) ? res.data : []);
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
        const mapped = items.map((p) => {
          const rawImages = (p.images?.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean) || []);
          const tnRaw = typeof p.thumbnail === 'string' ? p.thumbnail : (p.thumbnail?.url || '');
          const tn = normalizeUrl(tnRaw);
          const images = rawImages.map(normalizeUrl);
          const primary = tn || images[0] || '/placeholder.png';
          // compute minimal price from variants
          let minPrice = null;
          (p.variants || []).forEach((v) => {
            let cp = null;
            if (typeof v.calculated_price_incl_tax === 'number') cp = v.calculated_price_incl_tax;
            else if (typeof v.calculated_price === 'number') cp = v.calculated_price;
            else if (v.calculated_price && typeof v.calculated_price === 'object') {
              const obj = v.calculated_price;
              if (typeof obj.calculated_amount === 'number') cp = obj.calculated_amount;
              else if (obj.raw_calculated_amount?.value != null) cp = Number(obj.raw_calculated_amount.value);
            }
            if (typeof cp === 'number') {
              minPrice = (minPrice == null) ? cp : Math.min(minPrice, cp);
            }
          });
          return {
            id: p.id,
            name: p.title,
            images: [primary],
            price: typeof minPrice === 'number' ? Math.round(minPrice / 1) : undefined,
            category: Array.isArray(p.categories) && p.categories[0]?.name ? p.categories[0].name : '',
          };
        });
        if (!cancelled) setSuggestions(mapped);
      } catch (e) {
        if (!cancelled) setSuggestions([]);
      }
    };
    fetchSuggestions();
    return () => { cancelled = true; };
  }, [query]);

  const saveRecentSearch = (item) => {
    // item: { type, value, id? }
    const key = (it) => `${it.type}:${it.id ?? it.value}`.toLowerCase();
    const dedup = [item, ...recentSearches].reduce((acc, cur) => {
      const k = key(cur);
      if (!acc.map.has(k)) { acc.map.set(k, true); acc.list.push(cur); }
      return acc;
    }, { map: new Map(), list: [] }).list;
    const updated = dedup.slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (payload) => {
    // payload can be string (keyword) or typed object
    if (!payload) return;
    if (typeof payload === 'string') {
      const term = payload.trim();
      if (!term) return;
      saveRecentSearch({ type: 'keyword', value: term });
      onSearch({ type: 'keyword', value: term });
      onClose();
      return;
    }
    // object
    const { type, value, id } = payload;
    if (!value && !id) return;
    saveRecentSearch({ type, value: value || String(id), id });
    onSearch(payload);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch({ type: 'keyword', value: query });
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[100]">
      {/* Full Page Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      />

      {/* Search Modal Container */}
      <div className="flex items-center justify-center min-h-full px-2 sm:px-4 py-4 sm:py-20 safe-area-top safe-area-bottom" role="dialog" aria-modal="true">
        {/* Search Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-b">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-base sm:text-lg outline-none touch-manipulation"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </button>
          </div>

          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Products</h3>
                <div className="space-y-2">
                  {suggestions.map(product => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => { saveRecentSearch({ type: 'product', id: product.id, value: product.name }); onClose(); }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation min-h-[60px]"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <SmartImage
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</div>
                        <div className="text-sm text-gray-500">₹{product.price}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 capitalize hidden sm:block">{product.category}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {query.length === 0 && recentSearches.length > 0 && (
              <div className="p-3 sm:p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] flex items-center"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 touch-manipulation min-h-[44px] flex items-center justify-between"
                    >
                      <span className="truncate">{item.value}</span>
                      <span className="ml-3 text-xs text-gray-400 uppercase">{item.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {query.length === 0 && (
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(trend)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors touch-manipulation min-h-[44px]"
                    >
                      <Tag className="h-3 w-3" />
                      {trend.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query.length > 0 && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="h-12 w-12 mx-auto mb-3" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500">Try different keywords or check spelling</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {query.length === 0 && (
            <div className="p-3 sm:p-4 bg-gray-50 border-t safe-area-bottom">
              <div className="flex flex-wrap gap-2">
                {/* Collections quick links */}
                <Link
                  href={{ pathname: '/products', query: { collection_id: 'pcol_01K4G67CX7A92V3YEKSND0KWQ1', page: 1 } }}
                  onClick={onClose}
                  className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
                >
                  New Arrivals
                </Link>
                <Link
                  href={{ pathname: '/products', query: { collection_id: 'pcol_01K4G6886D7GMXZ22JDJJCM615', page: 1 } }}
                  onClick={onClose}
                  className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
                >
                  Best Seller
                </Link>
                {/* Sale: use configured collection if available, else fallback to keyword */}
                <Link
                  href={{ pathname: '/products', query: { collection_id: '3439849387434', page: 1 } }}
                  onClick={onClose}
                  className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
                >
                  Sale
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
