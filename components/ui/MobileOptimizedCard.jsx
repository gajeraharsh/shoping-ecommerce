'use client';

import { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Shield } from 'lucide-react';
import { QuickGuarantees } from '@/components/ui/ProductGuarantees';

export default function MobileOptimizedCard({ product, className = '' }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Eye className="h-4 w-4 text-gray-700" />
            </button>
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <ShoppingBag className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 active:scale-95"
        >
          <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>

        {/* Sale Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}

        {/* Trust Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
          <Shield className="h-3 w-3" />
          <span>Verified</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.reviews || '1.2k'})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Quick Guarantees */}
        <QuickGuarantees className="mb-3" />

        {/* Mobile-Optimized Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors active:scale-95">
            Add to Cart
          </button>
          <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95">
            <Heart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Free shipping & returns</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>In stock - ships today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileProductGrid({ products = [], className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {products.map((product) => (
        <MobileOptimizedCard
          key={product.id}
          product={product}
          className="w-full"
        />
      ))}
    </div>
  );
}
