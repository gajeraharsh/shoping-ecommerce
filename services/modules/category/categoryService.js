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

// Home: fetch categories explicitly marked for home category section display
// Looks for metadata.is_category_list = true and supports optional limit/sorting
export const getHomeCategories = async (options = {}) => {
  const params = {
    limit: 20,
    ...options,
    // Medusa metadata filter style: metadata[key]=value
    // Allow caller to override but default to true
    ...(options?.metadata || { 'metadata[is_category_list]': true }),
  }
  const data = await apiClient.get(ENDPOINTS.CATEGORY.LIST, { params, meta: { silent: true } })
  const list = data?.product_categories || []
  // Extra safety: filter client-side too in case backend doesn't filter
  return list.filter((c) => {
    const m = c?.metadata || c?.meta || {}
    return m?.is_category_list === true || m?.is_category_list === 'true' || m?.is_category_list === 1 || m?.is_category_list === '1'
  })
}
