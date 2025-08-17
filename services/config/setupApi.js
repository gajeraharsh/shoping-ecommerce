// /services/config/setupApi.js
import { createApiClient } from './apiClient'
import { setAuth } from '@/services/utils/authStorage'

// Determine base URLs
const storeBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/store'

// Derive auth base from an explicit env or by stripping '/store' from store base
const derivedRoot = storeBase.replace(/\/store\/?$/, '')
const authBase =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || derivedRoot || 'http://localhost:9000'

// Axios instances
// - apiClient: for Medusa Store endpoints (expects base like http://.../store)
// - authApiClient: for authentication endpoints (expects base like http://...)
export const apiClient = createApiClient(storeBase)
export const authApiClient = createApiClient(authBase)

// Persist token/user automatically from any auth response when running in browser
authApiClient.interceptors.response.use(
  (data) => {
    // data is already response.data from our base interceptor
    try {
      // If the API returns a raw token string
      const isStringToken = typeof data === 'string' && data.length > 0
      const token = isStringToken
        ? data
        : data?.token || data?.access_token || data?.data?.token
      const user = isStringToken ? null : data?.user || data?.data?.user
      if (token || user) setAuth({ token, user })
    } catch (_) {}
    return data
  },
  (error) => Promise.reject(error)
)
