// /services/modules/contact/contactService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

export const submitContact = (payload) =>
  apiClient.post(ENDPOINTS.CONTACT.SUBMIT, payload, {
    meta: { successMessage: 'Thanks! Your message has been sent.' },
  })
