// /services/modules/newsletter/newsletterService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const subscribeNewsletter = (email) =>
  apiClient.post(ENDPOINTS.NEWSLETTER.SUBSCRIBE, { email })
