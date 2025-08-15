// /services/constants/endpoints.js
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  CATEGORY: {
    LIST: '/categories',
    CREATE: '/categories',
    DETAILS: (id) => `/categories/${id}`,
  },
  PRODUCT: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
  },
}
