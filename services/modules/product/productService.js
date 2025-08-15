// /services/modules/product/productService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getProducts = (params = {}) =>
  apiClient.get(ENDPOINTS.PRODUCT.LIST, { params })

export const getProductById = (id) =>
  apiClient.get(ENDPOINTS.PRODUCT.DETAILS(id))

export const createProduct = (payload) =>
  apiClient.post(ENDPOINTS.PRODUCT.LIST, payload, {
    meta: { successMessage: 'Product created successfully' },
  })

export const updateProduct = (id, payload) =>
  apiClient.put(ENDPOINTS.PRODUCT.DETAILS(id), payload, {
    meta: { successMessage: 'Product updated successfully' },
  })

export const deleteProduct = (id) =>
  apiClient.delete(ENDPOINTS.PRODUCT.DETAILS(id), {
    meta: { successMessage: 'Product deleted successfully' },
  })
