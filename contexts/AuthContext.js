'use client';

import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setAuth as setAuthStorage, clearAuth as clearAuthStorage, getUser as getStoredUser, getToken as getStoredToken } from '@/services/utils/authStorage';
import { getMe as apiGetMe } from '@/services/modules/customer/customerService';
import { getDispatcher } from '@/services/config/dispatcher';
import { clearCredentials } from '@/features/auth/authSlice';
import { resetCartState } from '@/features/cart/cartSlice';

// Guards to avoid duplicate /me calls in React 18 Strict Mode (dev double-mount).
// Use window-scoped flags so a single request is guaranteed per page load even if modules re-evaluate.
let ME_HYDRATED_ONCE = false;
let ME_INFLIGHT_PROMISE = null;

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    
    case 'LOAD_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };

    case 'SET_TOKEN_PRESENT':
      return { ...state, tokenPresent: !!action.payload };

    case 'SET_INITIALIZING':
      return { ...state, isInitializing: !!action.payload };
    
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    tokenPresent: false,
    isInitializing: true,
  });
  const router = useRouter();

  useEffect(() => {
    const savedUser = getStoredUser();
    const token = getStoredToken();
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: !!token });
    if (savedUser) {
      dispatch({ type: 'LOAD_USER', payload: savedUser });
    }
    // Mark hydration done so UIs can avoid flashing auth screens
    dispatch({ type: 'SET_INITIALIZING', payload: false });
  }, []);

  // If we have a token but no user loaded yet, fetch profile to hydrate UI (e.g., header account menu)
  // Ref helps avoid re-entry during a single mount; module guards handle double-mount
  const fetchedMeOnce = useRef(false);
  useEffect(() => {
    let active = true;
    const token = getStoredToken();
    if (token && !state.user && !fetchedMeOnce.current && !ME_HYDRATED_ONCE) {
      fetchedMeOnce.current = true;
      // Resolve guards: prefer window flags if available, else fallback to module flags
      const w = typeof window !== 'undefined' ? window : null;
      const hydratedOnce = w ? Boolean(w.__ME_HYDRATED__) : ME_HYDRATED_ONCE;
      if (hydratedOnce) return;
      if (w) w.__ME_HYDRATED__ = true; else ME_HYDRATED_ONCE = true;
      // Ensure single-flight across mounts
      const inflight = w ? (w.__ME_INFLIGHT__ || null) : ME_INFLIGHT_PROMISE;
      if (inflight) {
        if (!w) ME_INFLIGHT_PROMISE = inflight;
      } else {
        const p = apiGetMe().then((me) => me).finally(() => { if (w) w.__ME_INFLIGHT__ = null; else ME_INFLIGHT_PROMISE = null; });
        if (w) w.__ME_INFLIGHT__ = p; else ME_INFLIGHT_PROMISE = p;
      }
      (async () => {
        try {
          const me = await (w ? w.__ME_INFLIGHT__ : ME_INFLIGHT_PROMISE);
          if (!active) return;
          if (me) {
            setAuthStorage({ user: me });
            dispatch({ type: 'LOAD_USER', payload: me });
          }
        } catch (err) {
          const status = err?.response?.status;
          if (status === 401) {
            try { clearAuthStorage(); } catch (_) {}
            dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
            dispatch({ type: 'LOGOUT' });
          } else {
            setTimeout(async () => {
              if (!active) return;
              try {
                const me2 = await apiGetMe();
                if (!active) return;
                if (me2) {
                  setAuthStorage({ user: me2 });
                  dispatch({ type: 'LOAD_USER', payload: me2 });
                }
              } catch (_) {}
            }, 500);
          }
        }
      })();
    }
    return () => { active = false; };
  }, [state.user, state.tokenPresent]);

  const login = (userData, token) => {
    // Persist via shared storage helper for consistency
    setAuthStorage({ token, user: userData });
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: !!token || !!getStoredToken() });
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    try {
      // Clear all auth artifacts using shared util
      clearAuthStorage();
    } catch (_) {}
    // Also clear cart artifacts and reset Redux state immediately
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_id');
      }
      const dispatch = getDispatcher();
      if (dispatch) {
        dispatch(clearCredentials());
        dispatch(resetCartState());
      }
    } catch (_) {}
    // Reflect cleared token in state immediately
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
    dispatch({ type: 'LOGOUT' });
    // Redirect to login
    try {
      router.push('/auth/login');
    } catch (_) {}
  };

  // Public method to re-fetch the current user (GET /me) and update context + storage.
  // Useful after profile updates so UI reflects latest values without reloads.
  const refreshUser = async () => {
    try {
      const me = await apiGetMe();
      if (me) {
        setAuthStorage({ user: me });
        dispatch({ type: 'LOAD_USER', payload: me });
      }
      return me;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        try { clearAuthStorage(); } catch (_) {}
        dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
        dispatch({ type: 'LOGOUT' });
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      tokenPresent: state.tokenPresent,
      isInitializing: state.isInitializing,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};