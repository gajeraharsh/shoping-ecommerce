// /services/constants/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: (provider = 'local') => `/auth/customer/${provider}`,
    REGISTER: '/store/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/store/auth/verify-otp',
    FORGOT_PASSWORD: '/store/auth/forgot-password',
    RESET_PASSWORD: (provider = 'emailpass') => `/store/auth/reset-password/${provider}`,
    CHANGE_PASSWORD: '/store/auth/change-password',
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
  BLOG: {
    LIST: '/blogs',
    DETAILS: (id) => `/blogs/${id}`,
  },
  BLOG_CATEGORY: {
    LIST: '/blog-categories',
  },
  CUSTOMER: {
    ME: '/customers/me',
  },
  REVIEW: {
    CREATE: '/reviews',
  },
  CONTACT: {
    SUBMIT: '/contact',
  },
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter',
  },
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    DELETE: (id) => `/wishlist/${id}`,
    DELETE_BY_PRODUCT: (productId) => `/wishlist/by-product/${productId}`,
    TOGGLE: '/wishlist/toggle',
  },
}