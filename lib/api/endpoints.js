// API endpoint constants
export const API_ENDPOINTS = {
  // Product endpoints
  PRODUCTS: {
    GET_ALL: '/products',
    GET_FEATURED: '/products/featured',
    GET_NEW: '/products/new',
    GET_TRENDING: '/products/trending',
    GET_RECOMMENDATIONS: '/products/recommendations',
    SEARCH: '/products/search',
    GET_FILTERS: '/products/filters',
    GET_STATS: '/products/stats',
    GET_RECENTLY_VIEWED: '/products/recently-viewed',
    GET_BY_SLUG: (slug) => `/products/${slug}`,
    GET_BY_CATEGORY: (categorySlug) => `/products/category/${categorySlug}`,
    GET_BY_BRAND: (brandSlug) => `/products/brand/${brandSlug}`,
    MARK_VIEWED: (productId) => `/products/${productId}/view`,
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Categories endpoints
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id) => `/categories/${id}`,
    GET_BY_SLUG: (slug) => `/categories/${slug}`,
  },
  
  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: (cartItemId) => `/cart/${cartItemId}`,
    REMOVE: (cartItemId) => `/cart/${cartItemId}`,
    CLEAR: '/cart',
    SUMMARY: '/cart/summary',
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: (id) => `/orders/${id}`,
    TRACK: (id) => `/orders/${id}/track`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    RETURN: (id) => `/orders/${id}/return`,
    INVOICE: (id) => `/orders/${id}/invoice`,
  },
  
  // Search endpoints
  SEARCH: {
    PRODUCTS: '/search',
    SUGGESTIONS: '/search/suggestions',
    TRENDING: '/search/trending',
    HISTORY: '/search/history',
    CLEAR_HISTORY: '/search/history',
  },
  
  // Wishlist endpoints
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId) => `/wishlist/${productId}`,
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses',
    UPDATE_ADDRESS: (id) => `/user/addresses/${id}`,
    DELETE_ADDRESS: (id) => `/user/addresses/${id}`,
  },
};

// Query parameter helpers
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};
