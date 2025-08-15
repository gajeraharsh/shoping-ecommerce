// /services/modules/category/categoryService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getCategories = (params = {}) =>
  apiClient.get(ENDPOINTS.CATEGORY.LIST, { params })

export const createCategory = (payload) =>
  apiClient.post(ENDPOINTS.CATEGORY.CREATE, payload, {
    meta: { successMessage: 'Category created successfully' },
  })

export const getCategoryById = (id) =>
  apiClient.get(ENDPOINTS.CATEGORY.DETAILS(id))

// Convenience: fetch hierarchical category tree for header/menu
export const getCategoryTree = async (options = {}) => {
  const params = {
    include_descendants_tree: true,
    limit: 100,
    ...options,
  }
  // Fetch silently to avoid header toast spam
  const data = await apiClient.get(ENDPOINTS.CATEGORY.LIST, { params, meta: { silent: true } })
  return data?.product_categories || []
}
