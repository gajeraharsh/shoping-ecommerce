// /services/modules/payment/paymentService.js
import { createApiClient } from '@/services/config/apiClient'

const api = createApiClient()

export const paymentService = {
  async listProviders({ region_id, offset, limit } = {}) {
    const params = new URLSearchParams()
    const rid = region_id || process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
    if (rid) params.set('region_id', rid)
    if (typeof offset === 'number') params.set('offset', String(offset))
    if (typeof limit === 'number') params.set('limit', String(limit))
    const query = params.toString()

    const url = `/payment-providers${query ? `?${query}` : ''}`
    const data = await api.get(url)
    // Expect shape: { payment_providers, count, offset, limit }
    return data
  },

  // Medusa v2: Create Payment Collection for a cart
  async createPaymentCollection({ cartId }) {
    if (!cartId) throw new Error('cartId is required to create a payment collection')
    // POST /store/payment-collections { cart_id }
    const { payment_collection } = await api.post(`/payment-collections`, { cart_id: cartId }, {
      meta: { successMessage: null },
    })
    return payment_collection
  },

  // Medusa v2: Initialize a payment session for a collection
  async initPaymentSession({ payment_collection_id, provider_id, data }) {
    if (!payment_collection_id) throw new Error('payment_collection_id is required')
    if (!provider_id) throw new Error('provider_id is required')
    // POST /store/payment-collections/:id/sessions { provider_id, data? }
    const { payment_collection } = await api.post(
      `/payment-collections/${payment_collection_id}/payment-sessions`,
      { provider_id, data },
      { meta: { successMessage: null } }
    )
    return payment_collection
  },

  async createPaymentSession({ cartId, provider_id }) {
    if (!cartId) throw new Error('cartId is required to create a payment session')
    if (!provider_id) throw new Error('provider_id is required to create a payment session')
    // Medusa v2 store route to initialize a payment session for the cart
    // Shape: POST /store/carts/:id/payment-sessions { provider_id }
    // This route may be removed in v2. Prefer payment collections flow above.
    const { cart } = await api.post(`/carts/${cartId}/payment-sessions`, { provider_id }, { meta: { successMessage: null } })
    return cart
  },
}
