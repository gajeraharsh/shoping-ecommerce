'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  return (
    <div
      className="group relative card-minimal overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-xl">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
          )}
          <Image
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            priority={false}
            unoptimized
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-accent text-accent-foreground px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium rounded-lg shadow">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button - Always visible on mobile, hover on desktop */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
            <button
              onClick={handleWishlistToggle}
              className={`w-11 h-11 rounded-full transition-all flex items-center justify-center shadow-md border ${
                inWishlist
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'bg-white/90 text-gray-600 hover:text-accent border-transparent'
              }`}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{ margin: 0, padding: 0, border: 'none' }}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current text-accent' : ''}`} style={{ margin: 0, padding: 0, display: 'block' }} />
            </button>
          </div>

          {/* Quick Add Button - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="w-full btn-primary py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors rounded-lg touch-manipulation min-h-[48px] flex items-center justify-center shadow-md"
              style={{ margin: 0, border: 'none' }}
            >
              <ShoppingBag className="h-4 w-4 mr-2" style={{ margin: 0, padding: 0, display: 'block' }} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-accent transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current text-accent' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{Number(product.rating).toFixed(1)}</span>
          </div>
          <span className="text-xs sm:text-sm text-gray-400">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Colors and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <span className="text-[9px] sm:text-xs text-gray-500 font-medium">+{product.colors.length - 4}</span>
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
  );
}
