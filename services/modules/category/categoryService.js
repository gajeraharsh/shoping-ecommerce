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
