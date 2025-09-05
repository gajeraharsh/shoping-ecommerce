'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeByProduct as apiRemoveByProduct,
  toggleWishlist as apiToggleWishlist,
} from '@/services/modules/wishlist/wishlistService';
// apiGetMe removed from here to avoid duplicate /me calls; rely on AuthContext.refreshUser

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_WISHLIST':
      return action.payload;
    
    case 'ADD_TO_WISHLIST':
      return [...state, action.payload];
    
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_WISHLIST':
      return [];
    
    default:
      return state;
  }
};

// Normalize Medusa product to UI shape expected by ProductCard / Wishlist UI
const normalizeProduct = (p) => {
  if (!p || typeof p !== 'object') return {};
  const id = p.id;
  const name = p.name || p.title || '';
  // Image URL normalizer to handle //, http->https, and backend-relative / paths
  const normalizeUrl = (u) => {
    if (!u) return '';
    let s = String(u);
    if (s.startsWith('//')) s = 'https:' + s;
    if (s.startsWith('http://')) s = s.replace(/^http:\/\//, 'https://');
    if (s.startsWith('/')) {
      const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '';
      return base ? `${base.replace(/\/$/, '')}${s}` : s;
    }
    return s;
  };
  // Images: array of urls; prefer images[].url, then thumbnail
  const imgArray = Array.isArray(p.images) ? p.images : [];
  const parsedImages = imgArray
    .map((im) => (typeof im === 'string' ? im : (im?.url || im?.src || '')))
    .filter(Boolean)
    .map(normalizeUrl);
  const tnRaw = typeof p.thumbnail === 'string' ? p.thumbnail : (p.thumbnail?.url || '');
  const tn = normalizeUrl(tnRaw);
  const images = parsedImages.length ? parsedImages : (tn ? [tn] : []);
  const image = images[0] || '/placeholder.png';

  // Price: choose the lowest available variant price (prefer INR) from all variants
  let price = p.price;
  let originalPrice = p.originalPrice;
  let discount = p.discount;
  const variants = Array.isArray(p.variants) ? p.variants : [];
  // Support both legacy prices array and new calculated_price objects
  if (price == null) {
    const variantPriceObjs = variants.map((v) => {
      // calculated_price object path
      if (v && typeof v.calculated_price === 'object' && v.calculated_price) {
        const obj = v.calculated_price;
        const cp = typeof obj.calculated_amount === 'number'
          ? obj.calculated_amount
          : (obj.raw_calculated_amount?.value != null ? Number(obj.raw_calculated_amount.value) : undefined);
        const op = typeof obj.original_amount === 'number'
          ? obj.original_amount
          : (obj.raw_original_amount?.value != null ? Number(obj.raw_original_amount.value) : undefined);
        return { cp, op };
      }
      // legacy prices array
      const pricesArr = Array.isArray(v?.prices) ? v.prices : [];
      const any = pricesArr.find(Boolean);
      if (any && typeof any.amount === 'number') {
        return {
          cp: Number(any.amount),
          op: typeof any.compare_at_amount === 'number' ? Number(any.compare_at_amount) : undefined,
        };
      }
      return { cp: undefined, op: undefined };
    }).filter(x => typeof x.cp === 'number');

    if (variantPriceObjs.length) {
      const minCp = Math.min(...variantPriceObjs.map(v => v.cp));
      price = Math.round(minCp);
      const anyOp = variantPriceObjs.find(v => typeof v.op === 'number' && v.op > minCp);
      if (anyOp) originalPrice = Math.round(anyOp.op);
    }
  }
  if (discount == null && originalPrice && price) {
    const d = Math.round(((originalPrice - price) / originalPrice) * 100);
    discount = isFinite(d) && d > 0 ? d : undefined;
  }

  // Options -> colors/sizes
  const options = Array.isArray(p.options) ? p.options : [];
  const colorOpt = options.find(o => /color/i.test(o?.title || ''));
  const sizeOpt = options.find(o => /size/i.test(o?.title || ''));
  const colors = Array.isArray(colorOpt?.values)
    ? colorOpt.values.map(v => v?.value || v).filter(Boolean)
    : (Array.isArray(p.colors) ? p.colors : []);
  const sizes = Array.isArray(sizeOpt?.values)
    ? sizeOpt.values.map(v => v?.value || v).filter(Boolean)
    : (Array.isArray(p.sizes) ? p.sizes : []);

  // Stock
  const firstVariant = variants[0] || {};
  const stock = typeof firstVariant.inventory_quantity === 'number'
    ? firstVariant.inventory_quantity
    : (p.stock ?? undefined);

  // Defaults
  // Rating/Reviews: support backend fields rating and review_count
  const rating = typeof p.rating === 'number' ? p.rating : (typeof p.avg_rating === 'number' ? p.avg_rating : 0);
  const reviews = typeof p.review_count === 'number'
    ? p.review_count
    : (typeof p.reviews === 'number' ? p.reviews : 0);
  const is_wishlist = !!p.is_wishlist;

  return { id, name, image, images, price, originalPrice, discount, colors, sizes, stock, rating, reviews, is_wishlist };
};

export function WishlistProvider({ children }) {
  const [wishlistItems, dispatch] = useReducer(wishlistReducer, []);
  // A monotonic counter that bumps on any wishlist mutation to notify listeners (e.g., Header)
  const [wishlistVersion, setWishlistVersion] = useState(0);
  const { isAuthenticated, isInitializing, refreshUser } = useAuth();
  const pathname = usePathname();
  const onWishlistPage = typeof pathname === 'string' && (
    pathname.startsWith('/wishlist') || pathname.startsWith('/account/wishlist')
  );

  // Initial load: if authenticated, load from API; else load from localStorage for graceful degrade
  useEffect(() => {
    if (isInitializing) return;
    // Only fetch wishlist from API when user is on the wishlist page
    if (isAuthenticated && onWishlistPage) {
      (async () => {
        try {
          const data = await apiGetWishlist({
            region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID,
            sales_channel_id: process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL,
          });
          // Prefer top-level products array if present for direct ProductCard rendering
          if (Array.isArray(data?.products) && data.products.length) {
            const mapped = data.products.map(normalizeProduct);
            dispatch({ type: 'LOAD_WISHLIST', payload: mapped });
            return;
          }
          const items = Array.isArray(data?.items) ? data.items : [];
          // Fallback: map items[].product if available
          const mapped = items.map((it) => {
            if (it && typeof it === 'object' && it.product) {
              return normalizeProduct(it.product);
            }
            return { id: it?.product_id };
          });
          dispatch({ type: 'LOAD_WISHLIST', payload: mapped });
        } catch (e) {
          // fall back to empty if API fails
          dispatch({ type: 'LOAD_WISHLIST', payload: [] });
        }
      })();
    } else {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(saved) });
      } else {
        dispatch({ type: 'LOAD_WISHLIST', payload: [] });
      }
    }
  }, [isAuthenticated, isInitializing, onWishlistPage]);

  // Persist only for non-auth or as a minor cache; server is source of truth when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const addToWishlist = (product) => {
    // If authenticated, hit API then update local state; otherwise local-only
    const doLocal = () => dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    if (!isAuthenticated) return doLocal();
    (async () => {
      try {
        await apiAddToWishlist({ product_id: product.id });
        doLocal();
        setWishlistVersion((v) => v + 1);
        // Fire-and-forget refresh of auth user to update header wishlist count without extra /me duplication
        try { await refreshUser?.(); } catch (_) {}
      } catch (_) {
        // ignore; interceptors will toast
      }
    })();
  };

  const removeFromWishlist = (productId) => {
    const doLocal = () => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    if (!isAuthenticated) return doLocal();
    (async () => {
      try {
        await apiRemoveByProduct(productId);
        doLocal();
        setWishlistVersion((v) => v + 1);
        // Fire-and-forget refresh of auth user to update header wishlist count without extra /me duplication
        try { await refreshUser?.(); } catch (_) {}
      } catch (_) {}
    })();
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistVersion,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};