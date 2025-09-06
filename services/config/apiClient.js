// /services/config/apiClient.js
import axios from 'axios'
import { notify } from '@/utils/notify'
import { clearAuth } from '@/services/utils/authStorage'
import { getDispatcher } from '@/services/config/dispatcher'
import { clearCredentials } from '@/features/auth/authSlice'
import { resetCartState } from '@/features/cart/cartSlice'

export function createApiClient(baseURL) {
  const api = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000',
    timeout: 15000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      // Medusa Store publishable key (prefer env, fallback to provided key)
      'x-publishable-api-key':
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
        'pk_ce129f623f74ba7f36e262b28c48bbaf50f78600aa57da103da801d8758fa4cb',
    },
  })

  // Request
  api.interceptors.request.use((config) => {
    // Attach token if present
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Response
  api.interceptors.response.use(
    (response) => {
      // Optional success toast (only for non-GET or when opted-in via config)
      const method = (response.config.method || 'get').toLowerCase()
      const successMessage = response.config?.meta?.successMessage
      if (method !== 'get' && successMessage) {
        notify.success(successMessage)
      }
      return response.data
    },
    (error) => {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || error.message || 'Request failed'

      // Auto-toasting errors unless silenced
      if (!error.config?.meta?.silent) {
        notify.error(msg)
      }

      // Example: auth token expiration handling
      if (status === 401) {
        // clear local storage and redux auth, caller can redirect
        try {
          clearAuth()
          const dispatch = getDispatcher()
          // Also clear any cart data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart_id')
          }
          if (dispatch) {
            dispatch(clearCredentials())
            dispatch(resetCartState())
          }
        } catch (_) {
          if (typeof window !== 'undefined') localStorage.removeItem('token')
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}
