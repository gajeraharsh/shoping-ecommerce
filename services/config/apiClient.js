// /services/config/apiClient.js
import axios from 'axios'
import { notify } from '@/utils/notify'

export function createApiClient() {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
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
        // e.g., redirect to login or clear token
        if (typeof window !== 'undefined') localStorage.removeItem('token')
      }

      return Promise.reject(error)
    }
  )

  return api
}
