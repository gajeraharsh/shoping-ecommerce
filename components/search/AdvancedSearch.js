'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';
import Link from 'next/link';

export default function AdvancedSearch({ isOpen, onClose, onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    'Floral Kurti', 'Maxi Dress', 'Crop Top', 'Ethnic Wear', 'Designer Collection'
  ]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockProducts
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const saveRecentSearch = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      onSearch(searchTerm.trim());
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Full Page Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      />

      {/* Search Modal Container */}
      <div className="flex items-start justify-center pt-4 sm:pt-20 min-h-full px-2 sm:px-4 safe-area-top">
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
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation min-h-[60px]"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                    />
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
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 touch-manipulation min-h-[44px] flex items-center"
                  >
                    {search}
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
                    {trend}
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
              <Link
                href="/products?category=kurtis"
                onClick={onClose}
                className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
              >
                Browse Kurtis
              </Link>
              <Link
                href="/products?category=dresses"
                onClick={onClose}
                className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
              >
                Browse Dresses
              </Link>
              <Link
                href="/products?category=ethnic"
                onClick={onClose}
                className="px-4 py-3 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px] flex items-center"
              >
                Ethnic Wear
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
