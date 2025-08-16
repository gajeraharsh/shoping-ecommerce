// /services/constants/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
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
  REVIEW: {
    CREATE: '/reviews',
  },
}
