'use client';

import { useEffect, useMemo, useState } from 'react';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, ShieldCheck, CreditCard, Lock, Leaf, Clock, MapPin, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { getProductById } from '@/services/modules/product/productService';
import { useToast } from '@/hooks/useToast';
import SizeGuideModal from '@/components/modals/SizeGuideModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductInfo({ product, selectedSize: cSelectedSize, setSelectedSize: cSetSelectedSize, selectedColor: cSelectedColor, setSelectedColor: cSetSelectedColor, activeVariant }) {
  // Support controlled or uncontrolled selection
  const [uSelectedSize, uSetSelectedSize] = useState('');
  const [uSelectedColor, uSetSelectedColor] = useState('');
  const selectedSize = typeof cSelectedSize !== 'undefined' ? cSelectedSize : uSelectedSize;
  const setSelectedSize = cSetSelectedSize || uSetSelectedSize;
  const selectedColor = typeof cSelectedColor !== 'undefined' ? cSelectedColor : uSelectedColor;
  const setSelectedColor = cSetSelectedColor || uSetSelectedColor;
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated, tokenPresent } = useAuth();
  const router = useRouter();
  const ensureAuthed = () => {
    const authed = Boolean(isAuthenticated || tokenPresent);
    if (!authed) {
      const next = typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : '/';
      try {
        router.push(`/auth/login?next=${encodeURIComponent(next)}`);
      } catch (_) {}
      return false;
    }
    return true;
  };
  
  // Use API-provided is_wishlist; manage optimistic local state
  const [inWishlist, setInWishlist] = useState(!!product?.is_wishlist);
  useEffect(() => {
    setInWishlist(!!product?.is_wishlist);
  }, [product?.id, product?.is_wishlist]);

  // Client-side hydrate of is_wishlist so SSR/ISR can stay cached without user-specific state
  useEffect(() => {
    let cancelled = false;
    async function hydrateWishlist() {
      if (!product?.id) return;
      try {
        const res = await getProductById(product.id, { params: { fields: '+wishlist' } });
        const fresh = !!res?.product?.is_wishlist;
        if (!cancelled) setInWishlist(fresh);
      } catch (_) {
        // ignore; keep SSR-provided state
      }
    }
    hydrateWishlist();
    return () => {
      cancelled = true;
    };
  }, [product?.id]);
  const hasSizes = Array.isArray(product?.sizes) && product.sizes.length > 0;
  const hasColors = Array.isArray(product?.colors) && product.colors.length > 0;

  // Display price info: prefer activeVariant if available
  const { displayPrice, displayOriginal, displayDiscount } = useMemo(() => {
    const vPrice = Number.isFinite(activeVariant?.price) ? Number(activeVariant.price) : null;
    const vOriginal = Number.isFinite(activeVariant?.originalPrice) ? Number(activeVariant.originalPrice) : null;
    const pPrice = Number(product?.price) || 0;
    const pOriginal = Number.isFinite(product?.originalPrice) ? Number(product.originalPrice) : null;
    const price = vPrice ?? pPrice;
    const original = vOriginal ?? pOriginal;
    const discount = original && price ? Math.round(((original - price) / original) * 100) : (Number.isFinite(product?.discount) ? Number(product.discount) : null);
    return { displayPrice: price, displayOriginal: original, displayDiscount: discount };
  }, [activeVariant?.price, activeVariant?.originalPrice, product?.price, product?.originalPrice, product?.discount]);

  // Find matching Medusa variant by selected options
  const resolveVariantId = () => {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    if (!variants.length) return null;
    // case-insensitive keys for matching
    const want = {};
    if (hasSizes && selectedSize) want.size = selectedSize.toLowerCase();
    if (hasColors && selectedColor) want.color = selectedColor.toLowerCase();
    const match = variants.find((v) => {
      const opts = v?.options || {};
      const entries = Object.entries(opts).reduce((acc, [k, v]) => {
        acc[k.toLowerCase()] = String(v).toLowerCase();
        return acc;
      }, {});
      const sizeOk = !want.size || entries.size === want.size;
      const colorOk = !want.color || entries.color === want.color;
      return sizeOk && colorOk;
    });
    return match?.id || null;
  };

  const handleAddToCart = () => {
    if (!ensureAuthed()) return;
    if (hasSizes && !selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    if (hasColors && !selectedColor) {
      showToast('Please select a color', 'error');
      return;
    }

    const variantId = resolveVariantId();
    if (!variantId) {
      showToast('Unable to determine product variant. Please try different options.', 'error');
      return;
    }

    // Prefer variant-specific image if available
    const variantPrimaryImage = Array.isArray(activeVariant?.images) && activeVariant.images.length
      ? activeVariant.images[0]
      : (activeVariant?.metadata?.thumbnail || (Array.isArray(product?.images) && product.images[0]) || undefined);

    addToCart({
      variant_id: variantId,
      quantity,
      metadata: {
        product_id: product?.id,
        size: hasSizes ? selectedSize : undefined,
        color: hasColors ? selectedColor : undefined,
        image_url: variantPrimaryImage,
      },
    });
    // Success toast is handled globally via API interceptors (cartService meta.successMessage)
  };

  const handleBuyNow = () => {
    if (!ensureAuthed()) return;
    if (hasSizes && !selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    if (hasColors && !selectedColor) {
      showToast('Please select a color', 'error');
      return;
    }
    const variantId = resolveVariantId();
    if (!variantId) {
      showToast('Unable to determine product variant. Please try different options.', 'error');
      return;
    }
    const variantPrimaryImage = Array.isArray(activeVariant?.images) && activeVariant.images.length
      ? activeVariant.images[0]
      : (activeVariant?.metadata?.thumbnail || (Array.isArray(product?.images) && product.images[0]) || undefined);

    addToCart({
      variant_id: variantId,
      quantity,
      metadata: {
        product_id: product?.id,
        size: hasSizes ? selectedSize : undefined,
        color: hasColors ? selectedColor : undefined,
        image_url: variantPrimaryImage,
      },
    });
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const handleWishlistToggle = () => {
    if (!ensureAuthed()) return;
    if (inWishlist) {
      setInWishlist(false); // optimistic UI
      removeFromWishlist(product.id);
    } else {
      setInWishlist(true); // optimistic UI
      addToWishlist(product);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Badge */}
      <div className="flex gap-2 flex-wrap">
        {product.isNew && (
          <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
            New Arrival
          </span>
        )}
        {product.isTrending && (
          <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
            Trending
          </span>
        )}
        {product.sustainable && (
          <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            Sustainable
          </span>
        )}
        {product.stock < 10 && (
          <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center">
            <div className="flex">
              {(() => {
                const raw = Number.isFinite(product?.rating) ? Number(product.rating) : Number.parseFloat(String(product?.rating || 0));
                const safe = Number.isFinite(raw) ? raw : 0;
                const oneDecimal = Number(safe.toFixed(1));
                const rounded = Math.round(oneDecimal);
                return [...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < rounded
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ));
              })()}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {Number.isFinite(product?.rating) ? Number(product.rating).toFixed(1) : Number.parseFloat(String(product?.rating || 0)).toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">SKU: MOD{product.id.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{Number(displayPrice || 0).toLocaleString()}</span>
        {Number.isFinite(displayOriginal) && displayOriginal > displayPrice && (
          <>
            <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
              ₹{Number(displayOriginal).toLocaleString()}
            </span>
            {Number.isFinite(displayDiscount) && displayDiscount > 0 && (
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                {displayDiscount}% OFF
              </span>
            )}
          </>
        )}
      </div>

      {/* Mini trust line near price */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        <span className="inline-flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Secure payment
        </span>
        <span className="inline-flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Free delivery over ₹999
        </span>
        <span className="inline-flex items-center gap-1">
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Easy returns
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`font-medium ${product.stock > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Size Selection */}
      {hasSizes && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Size</h3>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-accent font-medium underline hover:no-underline"
            >
              Size Guide
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-colors font-medium ${
                  selectedSize === size
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent bg-white dark:bg-gray-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {hasColors && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Color{selectedColor ? `: ${selectedColor}` : ''}</h3>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg transition-colors font-medium ${
                  selectedColor === color
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent bg-white dark:bg-gray-800'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 sm:w-12 sm:h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-xl touch-manipulation"
          >
            -
          </button>
          <span className="text-lg sm:text-lg font-semibold w-16 sm:w-16 text-center text-gray-900 dark:text-white">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 sm:w-12 sm:h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-xl touch-manipulation"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
        >
          <ShoppingBag className="h-5 w-5 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add to Cart</span>
        </button>
        <button
          onClick={handleWishlistToggle}
          className="px-4 sm:px-6 py-4 border border-accent text-accent bg-white dark:bg-gray-900 rounded-lg hover:bg-accent/5 transition-colors touch-manipulation min-h-[48px] min-w-[48px]"
        >
          <Heart className={`h-6 w-6 sm:h-5 sm:w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>
        </div>

        {/* Micro trust copy under CTA */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Secure checkout
          </span>
          <span className="inline-flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Fast delivery
          </span>
          <span className="inline-flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" /> Easy returns
          </span>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] text-sm sm:text-base"
        >
          Buy Now - Fast Checkout
        </button>
      </div>

      {/* Trust Strip: Responsive and compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">Secure Payments</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">SSL & PCI compliant</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">All Major Methods</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">UPI, Cards, NetBanking, COD</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">Easy Returns</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">7–30 days policy</div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Delivery & Returns</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="h-6 w-6 sm:h-5 sm:w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Free Delivery</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Enter your pincode for delivery date</div>
              <div className="text-sm text-black dark:text-white font-medium mt-1">Usually delivered in 7-10 days</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <RotateCcw className="h-6 w-6 sm:h-5 sm:w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Easy Returns</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">30-day return policy</div>
              <div className="text-sm text-black dark:text-white font-medium mt-1">No questions asked returns</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Package className="h-6 w-6 sm:h-5 sm:w-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Cash on Delivery</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Available for orders above ₹999</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Highlights</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 sm:h-5 sm:w-5 text-black dark:text-white flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Quality Assured</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Premium fabric & craftsmanship</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 sm:h-5 sm:w-5 text-black dark:text-white flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Estimated Delivery</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">7-10 days across India</div>
            </div>
          </div>
          
          {product.sustainable && (
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Eco-Friendly</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Made with sustainable materials</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </div>
  );
}
