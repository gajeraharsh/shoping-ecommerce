'use client';

import { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Plus, Minus, Truck, Shield, RotateCcw, Award, Clock, Zap, Check, Eye, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/useToast';
import { BRAND } from '@/lib/brand';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const inWishlist = isInWishlist(product?.id);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
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

  const handleImageChange = (index) => {
    setIsImageLoading(true);
    setSelectedImageIndex(index);
    setTimeout(() => setIsImageLoading(false), 200);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in safe-area-top safe-area-bottom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full mx-2 sm:mx-4 max-h-[90vh] sm:max-h-[95vh] overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black px-3 py-1.5 rounded-lg font-bold text-sm tracking-wide">
                {BRAND.name}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quick View</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Share Product"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 pt-16 sm:pt-20" style={{ height: 'calc(95vh - 4rem)' }}>
          {/* Enhanced Image Gallery */}
          <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            <div className="aspect-square relative overflow-hidden group">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse z-10" />
              )}
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onLoad={() => setIsImageLoading(false)}
              />
              
              {/* Premium Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                    {discountPercentage}% OFF
                  </div>
                )}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  In Stock
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="absolute bottom-6 left-6">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Premium Quality</span>
                  </div>
                </div>
              </div>

              {/* Quick Action - Wishlist */}
              <div className="absolute top-6 right-6">
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 border ${
                    inWishlist
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white/90 border-gray-200 text-gray-600 hover:bg-white hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="p-3 sm:p-6 bg-white dark:bg-gray-900">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                        selectedImageIndex === index
                          ? 'border-black dark:border-white shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Product Details */}
          <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white dark:bg-gray-900 max-h-full">
            {/* Product Header */}
            <div className="mb-8">
              <h2 id="quickview-title" className="heading-md text-gray-900 dark:text-white mb-4 text-shadow-premium">
                {product.name}
              </h2>
              
              {/* Enhanced Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{product.rating}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviews} verified reviews)
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <Eye className="h-3 w-3" />
                  <span>{Math.floor(Math.random() * 50) + 20} viewing now</span>
                </div>
              </div>

              {/* Enhanced Pricing */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-bold">
                      Save ₹{savings.toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enhanced Size Selection */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Size</h4>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-sm text-black dark:text-white underline hover:no-underline font-medium touch-manipulation min-h-[44px] flex items-center"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 touch-manipulation min-h-[44px] ${
                      selectedSize === size
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Color Selection */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Color</h4>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 touch-manipulation min-h-[44px] min-w-[44px] ${
                      selectedColor === color
                        ? 'border-black dark:border-white shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check className="h-4 w-4 text-white mx-auto" style={{
                        color: ['white', 'yellow', 'light'].some(c => color.toLowerCase().includes(c)) ? 'black' : 'white'
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Quantity Selector */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Quantity</h4>
              <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl w-fit overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[60px] sm:min-w-[80px] font-bold border-x-2 border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Maximum 10 items per order</p>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary btn-premium mb-4 h-12 sm:h-14 text-base sm:text-lg font-bold tracking-wide flex items-center justify-center gap-3 group touch-manipulation"
              >
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="truncate">Add to Cart - ₹{(product.price * quantity).toLocaleString()}</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="btn-outline h-12 text-sm font-bold flex items-center justify-center gap-2 touch-manipulation">
                  <Zap className="h-4 w-4" />
                  Buy Now
                </button>
                <button className="btn-secondary h-12 text-sm font-bold flex items-center justify-center gap-2 touch-manipulation">
                  <Clock className="h-4 w-4" />
                  Save for Later
                </button>
              </div>
            </div>

            {/* Premium Trust Indicators */}
            <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-8 mb-8">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-6">Why Choose {BRAND.name}?</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-green-800 dark:text-green-200">Free Express Delivery</div>
                    <div className="text-xs text-green-600 dark:text-green-300">On orders over ₹{BRAND.features.shipping.free}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <RotateCcw className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-blue-800 dark:text-blue-200">{BRAND.features.returns.days}-Day Returns</div>
                    <div className="text-xs text-blue-600 dark:text-blue-300">{BRAND.features.returns.policy}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="bg-purple-500 p-2 rounded-full">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-purple-800 dark:text-purple-200">Secure Payment</div>
                    <div className="text-xs text-purple-600 dark:text-purple-300">SSL encrypted & fraud protection</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-8">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Product Details</h4>
                <p className="body-base text-gray-600 dark:text-gray-400 leading-relaxed">
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
