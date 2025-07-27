'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Eye, Zap, Plus } from 'lucide-react';
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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
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
    addToCart(product, product.sizes[0], product.colors[0], 1);
    showToast('Added to cart', 'success');
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-shimmer"></div>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {product.discount}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </button>
            <button className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              ></div>
            ))}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Sizes: {product.sizes.join(', ')}
        </div>
      </div>
    </div>
  );
}
