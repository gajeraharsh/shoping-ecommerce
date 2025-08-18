// /services/modules/cart/cartService.js
import { createApiClient } from '@/services/config/apiClient'

const api = createApiClient()

// Utilities
function getStoredCartId() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cart_id')
}

function setStoredCartId(id) {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart_id', id)
}

export const cartService = {
  async ensureCart() {
    // Try using existing cart id, otherwise create
    const existing = getStoredCartId()
    if (existing) {
      try {
        const { cart } = await api.get(`/carts/${existing}`)
        return cart
      } catch (_) {
        // fallthrough to create
      }
    }
    // Create the cart, passing only region_id if provided via env
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
    const payload = regionId ? { region_id: regionId } : {}
    const { cart } = await api.post('/carts', payload, { meta: { successMessage: null, silent: true } })
    setStoredCartId(cart.id)
    return cart
  },

  async retrieve(id) {
    const cartId = id || getStoredCartId()
    if (!cartId) return this.ensureCart()
    const { cart } = await api.get(`/carts/${cartId}`)
    return cart
  },

  async addLineItem({ cartId, variant_id, quantity = 1, metadata }) {
    const id = cartId || getStoredCartId()
    const { cart } = await api.post(`/carts/${id}/line-items`, { variant_id, quantity, metadata }, {
      meta: { successMessage: 'Added to cart' },
    })
    setStoredCartId(cart.id)
    return cart
  },

  async updateLineItem({ cartId, line_id, quantity, metadata }) {
    const id = cartId || getStoredCartId()
    const { cart } = await api.post(`/carts/${id}/line-items/${line_id}`, { quantity, metadata }, {
      meta: { successMessage: null },
    })
    return cart
  },

  async deleteLineItem({ cartId, line_id }) {
    const id = cartId || getStoredCartId()
    await api.delete(`/carts/${id}/line-items/${line_id}`, { meta: { successMessage: 'Removed from cart' } })
    // After delete, fetch cart for latest state
    return this.retrieve(id)
  },
}
