'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

export default function ProductCard({ product, priority = false, viewMode }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState('');
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(!!product?.is_wishlist);
  useEffect(() => {
    setInWishlist(!!product?.is_wishlist);
  }, [product?.id, product?.is_wishlist]);
  // Local state retained for image interactions only
  const rating = Number(product?.rating) || 0;
  const reviewCount = Number(product?.review_count) || 0;

  // Inline monochrome SVG placeholder to avoid missing file issues
  const FALLBACK_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 533">
      <rect width="400" height="533" fill="#f3f4f6" />
      <g fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="20" text-anchor="middle">
        <text x="200" y="266">No Image</text>
      </g>
    </svg>`
  );
  
  // Simple palette to ensure known color names render reliably
  const COLOR_PALETTE = {
    black: '#000000',
    white: '#ffffff',
    gray: '#808080',
    grey: '#808080',
    silver: '#c0c0c0',
    charcoal: '#36454F',
    offwhite: '#f5f5f5',
    off_white: '#f5f5f5',
    cream: '#f2efe6',
    ivory: '#fffff0',
    beige: '#f5f5dc',
    brown: '#8B4513',
    tan: '#d2b48c',
    navy: '#000080',
    blue: '#0000ff',
    sky: '#87ceeb',
    red: '#ff0000',
    maroon: '#800000',
    burgundy: '#800020',
    green: '#008000',
    olive: '#808000',
    mint: '#98ff98',
    teal: '#008080',
    purple: '#800080',
    violet: '#8F00FF',
    pink: '#ffc0cb',
    orange: '#ffa500',
    yellow: '#ffff00',
    gold: '#d4af37',
  };

  const normalizeName = (name = '') => String(name).toLowerCase().replace(/\s|-/g, '');

  const getSwatchStyle = (name) => {
    const key = normalizeName(name);
    const bg = COLOR_PALETTE[key] || (typeof name === 'string' ? name.toLowerCase() : '#000');
    const isLight = ['#ffffff', '#f5f5f5', '#f2efe6', '#fffff0', '#f5f5dc'].includes(bg) || /white/i.test(name || '');
    return {
      backgroundColor: bg,
      // Strengthen border for very light colors so it stays visible
      borderColor: isLight ? '#9ca3af' : undefined, // gray-400
    };
  };
  
  // (Removed wishlist state sync)

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

  // Note: do not reset imageLoaded on product/currentImageIndex directly,
  // we handle it via imgSrc change to avoid flicker during search updates.

  // Derive a safe image source and update when index/product changes
  useEffect(() => {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    const candidate = imgs[currentImageIndex] || imgs[0] || '';
    const safe = typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : FALLBACK_SVG;
    setImgSrc(safe);
  }, [product?.images, currentImageIndex]);

  // Failsafe: if onLoad/onError don't fire (rare), reveal image area after a short delay
  useEffect(() => {
    if (!imgSrc) return;
    setImageLoaded(false);
    const t = setTimeout(() => setImageLoaded(true), 500);
    return () => clearTimeout(t);
  }, [imgSrc]);

  // (Removed wishlist handler and Quick Add; product card now only links to product page)

  // (Removed variant resolution; actions are no longer present on card)

  // (Removed Quick Add handler)

  return (
    <div
      className="group relative card-minimal overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-xl">
          <Image
            key={`${product.id || 'prod'}:${imgSrc}`}
            src={imgSrc || FALLBACK_SVG}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImgSrc(FALLBACK_SVG); setImageLoaded(true); }}
            placeholder="blur"
            blurDataURL={FALLBACK_SVG}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            unoptimized
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-accent text-accent-foreground px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium rounded-lg shadow">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            type="button"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (inWishlist) {
                setInWishlist(false); // optimistic
                removeFromWishlist(product.id);
              } else {
                setInWishlist(true); // optimistic
                // For list cards, pass minimal product; WishlistContext should handle normalization
                addToWishlist(product);
              }
            }}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full border shadow-sm transition-colors ${
              inWishlist
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white/90 border-gray-200 text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
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
                className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-current text-accent' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs sm:text-sm text-gray-400">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
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
            {(Array.isArray(product.colors) ? product.colors : []).slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200 dark:border-gray-600"
                style={getSwatchStyle(color)}
                title={String(color)}
              />
            ))}
            {(Array.isArray(product.colors) ? product.colors : []).length > 4 && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <span className="text-[9px] sm:text-xs text-gray-500 font-medium">+{(product.colors?.length || 0) - 4}</span>
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
