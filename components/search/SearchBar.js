'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { searchProducts, setSearchQuery } from '@/store/slices/productsSlice';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar({ className = '', placeholder = 'Search products...' }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { searchResults, searchQuery, loading } = useAppSelector((state) => ({
    searchResults: state.products.searchResults,
    searchQuery: state.products.searchQuery,
    loading: state.products.loading.search,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery.trim().length >= 2) {
        dispatch(setSearchQuery(localQuery));
        dispatch(searchProducts({ q: localQuery, limit: 5 }));
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, dispatch]);

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const handleProductClick = (product) => {
    setIsOpen(false);
    setLocalQuery('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-2">
                {searchResults.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug || product.id}`}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <img
                      src={product.images?.[0] || '/api/placeholder/40/40'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <button
                  onClick={handleSubmit}
                  className="w-full text-left p-2 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  View all results for "{localQuery}"
                </button>
              </div>
            </>
          ) : localQuery.trim().length >= 2 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No products found for "{localQuery}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
