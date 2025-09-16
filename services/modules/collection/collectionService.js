// /services/modules/collection/collectionService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getCollections = (params = {}) => {
  // Support pagination/filters if needed; Medusa v2 store collections list
  return apiClient.get(ENDPOINTS.COLLECTION.LIST, { params })
}

export const getCollectionById = (id, params = {}) => {
  return apiClient.get(ENDPOINTS.COLLECTION.DETAILS(id), { params })
}
