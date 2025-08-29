// /services/modules/blogCategory/blogCategoryService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getBlogCategories = (params = {}) => {
  const merged = {
    limit: 50,
    offset: 0,
    search: undefined,
    ...params,
  }
  return apiClient.get(ENDPOINTS.BLOG_CATEGORY.LIST, { params: merged })
}
