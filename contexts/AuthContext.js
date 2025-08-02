'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserRoles } from '@/lib/brand';

const AuthContext = createContext();

const USER_ROLES = getUserRoles();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };

    case 'LOAD_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };

    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };

    case 'UPDATE_ROLE':
      return { ...state, user: { ...state.user, role: action.payload } };

    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Ensure user has a valid role
          if (!userData.role || !Object.values(USER_ROLES).includes(userData.role)) {
            userData.role = USER_ROLES.user;
          }
          dispatch({ type: 'LOAD_USER', payload: userData });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    // Ensure user has a valid role
    if (!userData.role || !Object.values(USER_ROLES).includes(userData.role)) {
      userData.role = USER_ROLES.user;
    }

    // Add default profile data for social features
    const enhancedUserData = {
      ...userData,
      profile: {
        avatar: userData.avatar || null,
        bio: userData.bio || '',
        fashionTags: userData.fashionTags || [],
        followerCount: userData.followerCount || 0,
        followingCount: userData.followingCount || 0,
        postsCount: userData.postsCount || 0,
        verified: userData.verified || false,
        location: userData.location || '',
        website: userData.website || '',
        ...userData.profile
      },
      createdAt: userData.createdAt || new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(enhancedUserData));
    dispatch({ type: 'LOGIN', payload: enhancedUserData });
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (profileData) => {
    const updatedUser = {
      ...state.user,
      profile: { ...state.user.profile, ...profileData },
      lastActive: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
  };

  const updateRole = (newRole) => {
    if (!Object.values(USER_ROLES).includes(newRole)) {
      console.error('Invalid role:', newRole);
      return;
    }
    const updatedUser = { ...state.user, role: newRole };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_ROLE', payload: newRole });
  };

  const isRole = (role) => {
    return state.user?.role === role;
  };

  const hasRole = (roles) => {
    if (Array.isArray(roles)) {
      return roles.includes(state.user?.role);
    }
    return state.user?.role === roles;
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      login,
      logout,
      updateProfile,
      updateRole,
      isRole,
      hasRole,
      userRoles: USER_ROLES
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
