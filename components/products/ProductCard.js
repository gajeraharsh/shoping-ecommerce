'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye, Plus } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';
import QuickViewModal from '@/components/modals/QuickViewModal';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const inWishlist = isInWishlist(product.id);
  
  // Badge logic
  const getBadge = () => {
    if (product.isNew) return { text: 'NEW', color: 'bg-green-500' };
    if (product.isTrending) return { text: 'TRENDING', color: 'bg-purple-500' };
    if (product.discount > 30) return { text: 'HOT DEAL', color: 'bg-red-500' };
    if (product.stock < 10) return { text: 'LOW STOCK', color: 'bg-orange-500' };
    return null;
  };
  
  const badge = getBadge();

  // Image cycling effect
  useEffect(() => {
    let interval;
    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1500);
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

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"></div>
            )}
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Image dots indicator */}
            {product.images.length > 1 && isHovered && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
              {product.discount && (
                <div className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                  {product.discount}% OFF
                </div>
              )}
              {badge && (
                <div className={`${badge.color} text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg`}>
                  {badge.text}
                </div>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock <= 5 && (
              <div className="absolute top-2 sm:top-3 right-10 sm:right-14 bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                <span className="hidden sm:inline">Only {product.stock} left!</span>
                <span className="sm:hidden">{product.stock} left</span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all transform hover:scale-110 z-10 shadow-lg ${
                inWishlist
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-white/90 hover:bg-white'
              }`}
            >
              <Heart
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors ${
                  inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              />
            </button>

            {/* Quick Actions */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-primary text-white py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg hover:bg-primary/90 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 shadow-lg backdrop-blur-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Quick Add</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white/90 text-gray-700 p-2 sm:p-2.5 rounded-lg hover:bg-white transition-colors shadow-lg backdrop-blur-sm"
                title="Quick View"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-2 sm:p-3 lg:p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 ml-1">{product.rating}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-400">({product.reviews})</span>
            {product.stock <= 10 && (
              <span className="text-xs text-orange-600 font-medium bg-orange-50 px-1 sm:px-2 py-0.5 rounded-full">
                <span className="hidden sm:inline">Low Stock</span>
                <span className="sm:hidden">Low</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="text-xs text-green-600 font-medium hidden sm:inline">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>
          </div>

          {/* Colors Preview */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                  +{product.colors.length - 3}
                </div>
              )}
            </div>

            {/* Size indicator */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.sizes.length} sizes
            </div>
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
