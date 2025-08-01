'use client';

import { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/useToast';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const inWishlist = isInWishlist(product?.id);

  useEffect(() => {
    if (product) {
      // Get available sizes and colors from variants or fallback to direct arrays
      const availableSizes = product.variants && product.variants.length > 0 
        ? [...new Set(product.variants.map(v => v.size))] 
        : (product.sizes || []);
      const availableColors = product.variants && product.variants.length > 0 
        ? [...new Set(product.variants.map(v => v.color))] 
        : (product.colors || []);
      
      setSelectedSize(availableSizes[0] || '');
      setSelectedColor(availableColors[0] || '');
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Add escape key handler
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

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
    showToast(`Added ${quantity} item(s) to cart`, 'success');
    onClose();
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

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-700 rounded-full transition-colors shadow-lg"
          aria-label="Close modal"
          type="button"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Image Gallery */}
          <div className="relative bg-gray-50">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex]?.url || product.images?.[selectedImageIndex] || '/api/placeholder/400/400'}
                alt={product.images?.[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              {product.comparePrice && product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image?.url || image || '/api/placeholder/400/400'}
                      alt={image?.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 overflow-y-auto">
            <div className="mb-4">
              <h2 id="quickview-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating || 0}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviewCount || product.reviews || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">₹{parseFloat(product.price || 0).toFixed(2)}</span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{parseFloat(product.comparePrice || 0).toFixed(2)}
                  </span>
                )}
                {product.comparePrice && product.price && (
                  <span className="text-green-600 text-sm font-medium">
                    Save ₹{(parseFloat(product.comparePrice) - parseFloat(product.price)).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                (product.stock || product.quantity || 0) > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {(product.stock || product.quantity || 0) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const availableSizes = product.variants && product.variants.length > 0 
                    ? [...new Set(product.variants.map(v => v.size))] 
                    : (product.sizes || []);
                  return availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 text-gray-700 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ));
                })()}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const availableColors = product.variants && product.variants.length > 0 
                    ? [...new Set(product.variants.map(v => v.color))] 
                    : (product.colors || []);
                  return availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ));
                })()}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 border rounded-lg transition-colors ${
                  inWishlist
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Free shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span>30-day returns & exchanges</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure payment & 2-year warranty</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="border-t pt-6 mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
