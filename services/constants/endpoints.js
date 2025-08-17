// /services/constants/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: (provider = 'local') => `/auth/customer/${provider}`,
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
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
}
  