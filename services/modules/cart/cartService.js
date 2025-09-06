// /services/modules/cart/cartService.js
import { apiClient as api } from '@/services/config/setupApi'
import { getToken } from '@/services/utils/authStorage'

// use the preconfigured store api client from setupApi

// Utilities
function getStoredCartId() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cart_id')
}

function setStoredCartId(id) {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart_id', id)
}

function requireAuth() {
  const token = getToken()
  if (!token) {
    // No guest cart allowed
    const err = new Error('Authentication required')
    // Mark as 401-like for consumers if they check
    err.response = { status: 401, data: { message: 'Please log in to use the cart' } }
    throw err
  }
}

export const cartService = {
  async ensureCart() {
    requireAuth()
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

  async createCart() {
    requireAuth()
    // Always create a new empty cart and overwrite stored id
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
    const payload = regionId ? { region_id: regionId } : {}
    const { cart } = await api.post('/carts', payload, { meta: { successMessage: null, silent: true } })
    setStoredCartId(cart.id)
    return cart
  },

  async retrieve(id) {
    requireAuth()
    const cartId = id || getStoredCartId()
    if (!cartId) return this.ensureCart()
    const { cart } = await api.get(`/carts/${cartId}`)
    return cart
  },

  async updateCart({ cartId, data, meta = { successMessage: null } }) {
    requireAuth()
    const id = cartId || getStoredCartId()
    if (!id) throw new Error('No cart to update')
    const { cart } = await api.post(`/carts/${id}`, data, { meta })
    setStoredCartId(cart.id)
    return cart
  },

  async addLineItem({ cartId, variant_id, quantity = 1, metadata }) {
    requireAuth()
    let id = cartId || getStoredCartId()
    // If no cart yet, create/ensure one first
    if (!id) {
      const ensured = await this.ensureCart()
      id = ensured?.id
    }
    try {
      const { cart } = await api.post(
        `/carts/${id}/line-items`,
        { variant_id, quantity, metadata },
        { meta: { successMessage: 'Added to cart' } }
      )
      setStoredCartId(cart.id)
      return cart
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message || err?.message || ''
      const notFound = status === 404 || /cart id not found/i.test(String(msg))
      if (notFound) {
        // Create a fresh cart and retry once
        const fresh = await this.ensureCart()
        const freshId = fresh?.id
        const { cart } = await api.post(
          `/carts/${freshId}/line-items`,
          { variant_id, quantity, metadata },
          { meta: { successMessage: 'Added to cart' } }
        )
        setStoredCartId(cart.id)
        return cart
      }
      throw err
    }
  },

  async updateLineItem({ cartId, line_id, quantity, metadata }) {
    requireAuth()
    const id = cartId || getStoredCartId()
    const { cart } = await api.post(`/carts/${id}/line-items/${line_id}`, { quantity, metadata }, {
      meta: { successMessage: null },
    })
    return cart
  },

  async deleteLineItem({ cartId, line_id }) {
    requireAuth()
    const id = cartId || getStoredCartId()
    await api.delete(`/carts/${id}/line-items/${line_id}`, { meta: { successMessage: 'Removed from cart' } })
    // After delete, fetch cart for latest state
    return this.retrieve(id)
  },

  async addPromotion({ cartId, code }) {
    requireAuth()
    let id = cartId || getStoredCartId()
    if (!id) {
      const cart = await this.ensureCart()
      id = cart.id
    }
    if (!code) throw new Error('Promotion code is required')
    const { cart } = await api.post(
      `/carts/${id}/promotions`,
      { promo_codes: [code] },
      { meta: { successMessage: null } }
    )
    setStoredCartId(cart.id)
    return cart
  },

  async removePromotion({ cartId, code }) {
    requireAuth()
    let id = cartId || getStoredCartId()
    if (!id) {
      const cart = await this.ensureCart()
      id = cart.id
    }
    if (!code) throw new Error('Promotion code is required to remove')
    // Use DELETE with body { promo_codes } as per Medusa v2
    await api.delete(`/carts/${id}/promotions`, { data: { promo_codes: [code] }, meta: { successMessage: null } })
    return this.retrieve(id)
  },

  async completeCart({ cartId, query = '' } = {}) {
    requireAuth()
    const id = cartId || getStoredCartId()
    if (!id) throw new Error('No cart to complete')
    const url = `/carts/${id}/complete${query ? `?${query}` : ''}`
    // Raw response shape differs based on success: { type: 'order', order } or { type: 'cart', cart, error }
    const data = await api.post(url, undefined, { meta: { successMessage: null } })
    return data
  },
}
