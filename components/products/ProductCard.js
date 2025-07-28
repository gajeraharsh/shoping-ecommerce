'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye, Plus, Zap, TrendingUp } from 'lucide-react';
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
  
  // Enhanced Badge logic for fashion store
  const getBadge = () => {
    if (product.isNew) return { text: 'NEW', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: Zap };
    if (product.isTrending) return { text: 'TRENDING', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: TrendingUp };
    if (product.discount > 30) return { text: 'HOT DEAL', color: 'bg-gradient-to-r from-red-500 to-orange-500', icon: Zap };
    if (product.stock < 10) return { text: 'LOW STOCK', color: 'bg-gradient-to-r from-orange-500 to-yellow-500', icon: null };
    return null;
  };
  
  const badge = getBadge();

  // Enhanced image cycling effect
  useEffect(() => {
    let interval;
    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1200);
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
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          {/* Enhanced Image Container - Larger aspect ratio for fashion */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"></div>
            )}
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Enhanced Image dots indicator */}
            {product.images.length > 1 && isHovered && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125 shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.discount && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm flex items-center gap-1">
                  <span>{product.discount}% OFF</span>
                </div>
              )}
              {badge && (
                <div className={`${badge.color} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm flex items-center gap-1`}>
                  {badge.icon && <badge.icon className="h-3 w-3" />}
                  <span>{badge.text}</span>
                </div>
              )}
            </div>

            {/* Enhanced Stock indicator */}
            {product.stock <= 5 && (
              <div className="absolute top-3 right-16 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
                Only {product.stock} left!
              </div>
            )}

            {/* Enhanced Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2.5 rounded-full transition-all transform hover:scale-110 z-10 shadow-xl backdrop-blur-sm ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${
                  inWishlist ? 'fill-current scale-110' : 'hover:scale-110'
                }`}
              />
            </button>

            {/* Enhanced Quick Actions */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-105"
              >
                <ShoppingBag className="h-4 w-4" />
                Quick Add
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white/95 text-gray-700 p-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
                title="Quick View"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            {/* Fashion-focused overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Enhanced Product Info */}
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>

          {/* Enhanced Rating and Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {product.rating}
              </span>
              <span className="text-sm text-gray-400">({product.reviews})</span>
            </div>
            {product.stock <= 10 && (
              <span className="text-xs text-orange-600 font-bold bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                Low Stock
              </span>
            )}
          </div>

          {/* Enhanced Price Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="text-sm text-green-600 font-bold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Colors and Sizes Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer ring-1 ring-gray-200 dark:ring-gray-600"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white shadow-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-bold ring-1 ring-gray-200 dark:ring-gray-600">
                    +{product.colors.length - 4}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Size indicator */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sizes:</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {product.sizes.length}
              </span>
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
