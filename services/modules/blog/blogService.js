// /services/modules/blog/blogService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getBlogs = (params = {}) => {
  const merged = {
    limit: 9,
    offset: 0,
    search: undefined,
    category_id: undefined,
    ...params,
  }
  return apiClient.get(ENDPOINTS.BLOG.LIST, { params: merged })
}

export const getBlogById = (id, config = {}) =>
  apiClient.get(ENDPOINTS.BLOG.DETAILS(id), config)
