'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
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

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                inWishlist
                  ? 'bg-red-50 text-red-500'
                  : 'bg-white/90 text-gray-600 hover:text-red-500'
              } opacity-0 group-hover:opacity-100`}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-black text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white text-gray-900 p-2.5 hover:bg-gray-50 transition-colors rounded-lg"
                title="Quick View"
              >
                <Eye className="h-4 w-4" />
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
