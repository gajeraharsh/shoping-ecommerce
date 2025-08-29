// /services/modules/customer/customerService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const getMe = () => apiClient.get(ENDPOINTS.CUSTOMER.ME)

// Update the logged-in customer's profile
// Medusa v2 Store API typically accepts POST on /store/customers/me
// Payload supports: first_name, last_name, phone, company_name, metadata
export const updateMe = (payload) => apiClient.post(ENDPOINTS.CUSTOMER.ME, payload)
