// /services/modules/banner/bannerService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getBanners = (params = {}) => {
  const merged = {
    limit: 50,
    offset: 0,
    ...params,
  }
  return apiClient.get(ENDPOINTS.BANNER.LIST, { params: merged })
}
