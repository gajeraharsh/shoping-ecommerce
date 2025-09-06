// /services/modules/shipping/shippingService.js
import { createApiClient } from '@/services/config/apiClient'

const api = createApiClient()

export const shippingService = {
  // List shipping options for a specific cart
  async listCartOptions({ cart_id, fields, offset, limit, order, is_return, $and, $or } = {}) {
    if (!cart_id) throw new Error('cart_id is required to list shipping options')

    const params = new URLSearchParams()
    params.set('cart_id', cart_id)
    if (fields) params.set('fields', fields)
    if (typeof offset === 'number') params.set('offset', String(offset))
    if (typeof limit === 'number') params.set('limit', String(limit))
    if (order) params.set('order', order)
    if (typeof is_return === 'boolean') params.set('is_return', String(is_return))
    // Note: $and / $or complex filters are omitted from URLSearchParams for simplicity

    const query = params.toString()
    const url = `/shipping-options${query ? `?${query}` : ''}`
    const data = await api.get(url)
    // Expected: { shipping_options, count?, offset?, limit? }
    return data
  },

  // Calculate price for a shipping option within a cart context
  async calculateOptionPrice({ id, cart_id, data }) {
    if (!id) throw new Error('id is required to calculate shipping option price')
    if (!cart_id) throw new Error('cart_id is required to calculate shipping option price')
    // POST /shipping-options/:id/prices { cart_id, data? }
    const res = await api.post(`/shipping-options/${id}/prices`, { cart_id, data }, { meta: { successMessage: null } })
    // Expected: { calculated_price } but we return whole response for flexibility
    return res
  },

  // Add a shipping method to the cart
  async addShippingMethod({ cartId, option_id, data }) {
    if (!cartId) throw new Error('cartId is required to add shipping method')
    if (!option_id) throw new Error('option_id is required to add shipping method')
    // POST /carts/:id/shipping-methods { option_id, data? }
    const { cart } = await api.post(`/carts/${cartId}/shipping-methods`, { option_id, data }, { meta: { successMessage: null } })
    return cart
  },
}
