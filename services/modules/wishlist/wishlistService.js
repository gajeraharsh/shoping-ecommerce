// /services/modules/wishlist/wishlistService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getWishlist = (params = {}) =>
  apiClient.get(ENDPOINTS.WISHLIST.LIST, { params })

export const addToWishlist = ({ product_id, notes }) =>
  apiClient.post(ENDPOINTS.WISHLIST.ADD, { product_id, notes }, {
    meta: { successMessage: 'Added to wishlist' },
  })

export const removeFromWishlist = (id) =>
  apiClient.delete(ENDPOINTS.WISHLIST.DELETE(id), {
    meta: { successMessage: 'Removed from wishlist' },
  })

export const removeByProduct = (product_id) =>
  apiClient.delete(ENDPOINTS.WISHLIST.DELETE_BY_PRODUCT(product_id), {
    meta: { successMessage: 'Removed from wishlist' },
  })

export const toggleWishlist = (product_id) =>
  apiClient.post(ENDPOINTS.WISHLIST.TOGGLE, { product_id }, {
    meta: { successMessage: 'Wishlist updated' },
  })
