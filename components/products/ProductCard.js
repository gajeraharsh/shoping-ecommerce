'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye, GitCompare } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { useToast } from '@/hooks/useToast';
import QuickViewModal from '@/components/modals/QuickViewModal';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const { showToast } = useToast();
  
  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  // Image cycling effect on hover
  useEffect(() => {
    let interval;
    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 2000);
    } else {
      setCurrentImageIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
    showToast('Added to cart', 'success');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleComparisonToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(product.id);
      showToast('Removed from comparison', 'info');
    } else {
      if (canAddMore()) {
        addToComparison(product);
        showToast('Added to comparison', 'success');
      } else {
        showToast('Maximum 4 products can be compared', 'error');
      }
    }
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:shadow-lg rounded-xl border border-gray-100 dark:border-gray-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-xl">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
            )}
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-105' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium">
                -{product.discount}%
              </div>
            )}

            {/* Action Buttons - Always visible on mobile, hover on desktop */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
              <button
                onClick={handleWishlistToggle}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center ${
                  inWishlist
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white/90 text-gray-600 hover:text-red-500'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{ margin: 0, padding: 0, border: 'none' }}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${inWishlist ? 'fill-current' : ''}`} style={{ margin: 0, padding: 0, display: 'block' }} />
              </button>

              <button
                onClick={handleComparisonToggle}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center ${
                  inComparison
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-white/90 text-gray-600 hover:text-blue-500'
                }`}
                title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
                style={{ margin: 0, padding: 0, border: 'none' }}
              >
                <GitCompare className={`h-4 w-4 sm:h-5 sm:w-5 ${inComparison ? 'fill-current' : ''}`} style={{ margin: 0, padding: 0, display: 'block' }} />
              </button>
            </div>

            {/* Quick Actions - Always visible on mobile, hover on desktop */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-black text-white py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg touch-manipulation min-h-[44px] flex items-center justify-center"
                style={{ margin: 0, border: 'none' }}
              >
                <ShoppingBag className="h-4 w-4 mr-3 sm:hidden" style={{ margin: 0, padding: 0, display: 'block' }} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white text-gray-900 w-11 h-11 sm:w-auto sm:h-auto sm:p-2.5 hover:bg-gray-50 transition-colors rounded-lg flex items-center justify-center touch-manipulation"
                title="Quick View"
                style={{ margin: 0, padding: 0, border: 'none' }}
              >
                <Eye className="h-4 w-4" style={{ margin: 0, padding: 0, display: 'block' }} />
              </button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">+{product.colors.length - 4}</span>
                </div>
              )}
            </div>
            
            {/* Stock indicator */}
            {product.stock <= 5 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
