'use client';

import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import ProductCard from './ProductCard';
import { Clock, X } from 'lucide-react';

export default function RecentlyViewed({ showTitle = true, limit = 4 }) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const displayProducts = recentlyViewed.slice(0, limit);

  return (
    <div className="py-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Recently Viewed
            </h2>
            <button
              onClick={clearRecentlyViewed}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={`recent-${product.id}`} product={product} />
          ))}
        </div>

        {recentlyViewed.length > limit && (
          <div className="text-center mt-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {limit} of {recentlyViewed.length} recently viewed items
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
