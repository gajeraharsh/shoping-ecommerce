'use client';

import { useState } from 'react';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/useToast';

export default function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    if (!selectedColor) {
      showToast('Please select a color', 'error');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    showToast('Added to cart successfully!', 'success');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 px-2 py-1 rounded text-sm font-semibold">
              {product.discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Size</h3>
        <div className="flex gap-2">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                selectedSize === size
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary bg-white dark:bg-gray-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Color</h3>
        <div className="flex gap-2">
          {product.colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                selectedColor === color
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary bg-white dark:bg-gray-800'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            -
          </button>
          <span className="text-lg font-semibold w-12 text-center text-gray-900 dark:text-white">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Add to Cart
        </button>
        <button
          onClick={handleWishlistToggle}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Product Features */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Free Shipping</div>
              <div className="text-sm text-gray-600">On orders over ₹999</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Easy Returns</div>
              <div className="text-sm text-gray-600">30-day return policy</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Secure Payment</div>
              <div className="text-sm text-gray-600">100% secure checkout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
