// /services/modules/review/reviewService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getProductReviews = (productId, params = {}) =>
  apiClient.get(ENDPOINTS.PRODUCT.REVIEWS(productId), { params })

export const createReview = (payload) =>
  apiClient.post(ENDPOINTS.REVIEW.CREATE, payload, {
    meta: { successMessage: 'Review submitted successfully' },
  })
