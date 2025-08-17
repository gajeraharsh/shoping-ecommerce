'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: !!token });
    if (savedUser) {
      dispatch({ type: 'LOAD_USER', payload: JSON.parse(savedUser) });
    }
    // Mark hydration done so UIs can avoid flashing auth screens
    dispatch({ type: 'SET_INITIALIZING', payload: false });
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: 'SET_TOKEN_PRESENT', payload: true });
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('user');
    // token may be cleared by axios interceptor; reflect it locally too
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_TOKEN_PRESENT', payload: false });
    }
    dispatch({ type: 'LOGOUT' });
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