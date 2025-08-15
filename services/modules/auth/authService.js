// /services/modules/auth/authService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const login = (credentials) =>
  apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials, {
    meta: { successMessage: 'Login successful' },
  })

export const register = (userData) =>
  apiClient.post(ENDPOINTS.AUTH.REGISTER, userData, {
    meta: { successMessage: 'Registration successful' },
  })

export const logout = () =>
  apiClient.post(ENDPOINTS.AUTH.LOGOUT, {}, {
    meta: { successMessage: 'Logged out successfully' },
  })
