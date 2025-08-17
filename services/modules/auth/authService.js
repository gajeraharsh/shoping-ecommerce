// /services/modules/auth/authService.js
import { authApiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const login = (credentials, provider = 'emailpass') =>
  authApiClient.post(ENDPOINTS.AUTH.LOGIN(provider), credentials, {
    meta: { successMessage: 'Login successful' },
  })

export const register = (userData) =>
  authApiClient.post(ENDPOINTS.AUTH.REGISTER, userData, {
    meta: { successMessage: 'OTP sent to your email' },
  })

export const logout = () =>
  authApiClient.post(ENDPOINTS.AUTH.LOGOUT, {}, {
    meta: { successMessage: 'Logged out successfully' },
  })

export const verifyOtp = (payload) =>
  authApiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, payload, {
    meta: { successMessage: 'Email verified successfully' },
  })
