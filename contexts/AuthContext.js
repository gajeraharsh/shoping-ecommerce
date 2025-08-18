'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAuth as setAuthStorage, clearAuth as clearAuthStorage, getUser as getStoredUser, getToken as getStoredToken } from '@/services/utils/authStorage';
import { getMe as apiGetMe } from '@/services/modules/customer/customerService';

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
  useEffect(() => {
    let active = true;
    const token = getStoredToken();
    if (token && !state.user) {
      (async () => {
        try {
          const me = await apiGetMe();
          if (!active) return;
          if (me) {
            // Persist and update context
            setAuthStorage({ user: me });
            dispatch({ type: 'LOAD_USER', payload: me });
          }
        } catch (err) {
          const status = err?.response?.status;
          if (status === 401) {
            // Token invalid/expired: clear and logout so app can recover
            try { clearAuthStorage(); } catch (_) {}
            dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
            dispatch({ type: 'LOGOUT' });
          } else {
            // Transient failure: keep token, try one quick retry after a short delay
            setTimeout(async () => {
              if (!active) return;
              try {
                const me2 = await apiGetMe();
                if (!active) return;
                if (me2) {
                  setAuthStorage({ user: me2 });
                  dispatch({ type: 'LOAD_USER', payload: me2 });
                }
              } catch (_) {
                // swallow; UI will continue to show loading until next navigation/login
              }
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
    // Reflect cleared token in state immediately
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
    dispatch({ type: 'LOGOUT' });
    // Redirect to login
    try {
      router.push('/auth/login');
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      tokenPresent: state.tokenPresent,
      isInitializing: state.isInitializing,
      login,
      logout
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