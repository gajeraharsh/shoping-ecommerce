// /services/modules/customer/customerService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getMe = () => apiClient.get(ENDPOINTS.CUSTOMER.ME)
