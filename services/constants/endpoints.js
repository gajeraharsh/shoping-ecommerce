// /services/constants/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: (provider = 'local') => `/auth/customer/${provider}`,
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/store/auth/forgot-password',
    RESET_PASSWORD: (provider = 'emailpass') => `/store/auth/reset-password/${provider}`,
  },
  CATEGORY: {
    // Medusa Store API for product categories
    LIST: '/product-categories',
    CREATE: '/product-categories',
    DETAILS: (idOrHandle) => `/product-categories/${idOrHandle}`,
  },
  PRODUCT: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    REVIEWS: (id) => `/products/${id}/reviews`,
  },
  CUSTOMER: {
    ME: '/customers/me',
  },
  REVIEW: {
    CREATE: '/reviews',
  },
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    DELETE: (id) => `/wishlist/${id}`,
    DELETE_BY_PRODUCT: (productId) => `/wishlist/by-product/${productId}`,
    TOGGLE: '/wishlist/toggle',
  },
}