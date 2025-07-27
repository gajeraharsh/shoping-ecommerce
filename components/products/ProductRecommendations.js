'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Sparkles, TrendingUp, Heart, ShoppingBag } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';

export default function ProductRecommendations({ 
  currentProduct, 
  type = 'related', 
  title,
  limit = 4 
}) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let filteredProducts = [];

    switch (type) {
      case 'related':
        // Products from same category, excluding current product
        filteredProducts = mockProducts.filter(product => 
          product.category === currentProduct?.category && 
          product.id !== currentProduct?.id
        );
        break;
      
      case 'trending':
        // Products marked as trending or with high ratings
        filteredProducts = mockProducts.filter(product => 
          product.isTrending || product.rating >= 4.5
        );
        break;
      
      case 'similar-price':
        // Products within similar price range
        if (currentProduct) {
          const priceRange = currentProduct.price * 0.3; // 30% range
          filteredProducts = mockProducts.filter(product => 
            Math.abs(product.price - currentProduct.price) <= priceRange &&
            product.id !== currentProduct.id
          );
        }
        break;
      
      case 'recently-viewed':
        // This would typically come from a recently viewed context
        filteredProducts = mockProducts.slice(0, 4);
        break;
      
      case 'best-sellers':
        // Products with high review counts
        filteredProducts = mockProducts
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, limit);
        break;
      
      case 'new-arrivals':
        // Products marked as new or recently added
        filteredProducts = mockProducts.filter(product => product.isNew);
        break;
      
      default:
        filteredProducts = mockProducts.slice(0, limit);
    }

    // Shuffle and limit results
    const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, limit));
  }, [currentProduct, type, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'best-sellers':
        return <ShoppingBag className="h-5 w-5 text-primary" />;
      case 'new-arrivals':
        return <Sparkles className="h-5 w-5 text-primary" />;
      default:
        return <Heart className="h-5 w-5 text-primary" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'related':
        return 'You Might Also Like';
      case 'trending':
        return 'Trending Now';
      case 'similar-price':
        return 'Similar Products';
      case 'recently-viewed':
        return 'Recently Viewed';
      case 'best-sellers':
        return 'Best Sellers';
      case 'new-arrivals':
        return 'New Arrivals';
      default:
        return 'Recommended For You';
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          {getIcon()}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(product => (
            <ProductCard key={`rec-${product.id}`} product={product} />
          ))}
        </div>

        {type === 'trending' && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Updated hourly based on customer activity</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Multiple recommendation types for homepage
export function ProductRecommendationGrid() {
  return (
    <div className="space-y-0">
      <ProductRecommendations 
        type="trending" 
        title="Trending This Week"
        limit={4}
      />
      <ProductRecommendations 
        type="new-arrivals" 
        title="Fresh Arrivals"
        limit={4}
      />
      <ProductRecommendations 
        type="best-sellers" 
        title="Customer Favorites"
        limit={4}
      />
    </div>
  );
}
