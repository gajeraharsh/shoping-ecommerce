'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeByProduct as apiRemoveByProduct,
  toggleWishlist as apiToggleWishlist,
} from '@/services/modules/wishlist/wishlistService';

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

export function WishlistProvider({ children }) {
  const [wishlistItems, dispatch] = useReducer(wishlistReducer, []);
  const { isAuthenticated, isInitializing } = useAuth();

  // Initial load: if authenticated, load from API; else load from localStorage for graceful degrade
  useEffect(() => {
    if (isInitializing) return;
    if (isAuthenticated) {
      (async () => {
        try {
          const data = await apiGetWishlist();
          const items = Array.isArray(data?.items) ? data.items : [];
          // Store minimal shape compatible with existing UI (expects item.id === productId)
          const mapped = items.map((it) => ({ id: it.product_id }));
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
  }, [isAuthenticated, isInitializing]);

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