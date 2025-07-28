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
    <div className="py-12 lg:py-16 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Clock className="h-7 w-7 text-primary" />
              Recently Viewed
            </h2>
            <button
              onClick={clearRecentlyViewed}
              className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-2 transition-colors font-medium"
            >
              <X className="h-5 w-5" />
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map(product => (
            <ProductCard key={`recent-${product.id}`} product={product} />
          ))}
        </div>

        {recentlyViewed.length > limit && (
          <div className="text-center mt-8">
            <span className="text-base text-gray-500 dark:text-gray-400 font-medium">
              Showing {limit} of {recentlyViewed.length} recently viewed items
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
