// services/customer/addressService.js
import { createApiClient } from '@/services/config/apiClient'

const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'

const api = createApiClient(BASE_URL)

// Helpers to map between UI model and Medusa model
function uiToMedusaPayload(ui) {
  // Split name to first/last (best-effort)
  const parts = (ui.name || '').trim().split(' ')
  const first_name = parts.shift() || ''
  const last_name = parts.length ? parts.join(' ') : ''

  return {
    first_name,
    last_name,
    phone: ui.phone || '',
    company: ui.company || '',
    address_1: ui.street || '',
    address_2: ui.landmark || '',
    city: ui.city || '',
    // Medusa expects province as ISO-3166-2 (lowercase); we pass as-is for now
    province: (ui.state || '').toLowerCase(),
    postal_code: ui.pincode || '',
    // TODO: set a real country code; default to 'us' if not provided
    country_code: ui.country_code || 'us',
    address_name: ui.type || 'other',
    is_default_shipping: !!ui.isDefault,
    is_default_billing: !!ui.isDefault,
    metadata: {
      type: ui.type || 'other',
      landmark: ui.landmark || '',
    },
  }
}

// Build a partial payload for PATCH updates: only include keys present in ui input
function uiToMedusaPartial(ui) {
  const out = {}
  if (typeof ui.name === 'string') {
    const parts = ui.name.trim().split(' ')
    out.first_name = parts.shift() || ''
    out.last_name = parts.length ? parts.join(' ') : ''
  }
  if (typeof ui.phone === 'string') out.phone = ui.phone
  if (typeof ui.company === 'string') out.company = ui.company
  if (typeof ui.street === 'string') out.address_1 = ui.street
  if (typeof ui.landmark === 'string') {
    out.address_2 = ui.landmark
    out.metadata = { ...(ui.metadata || {}), landmark: ui.landmark }
  }
  if (typeof ui.city === 'string') out.city = ui.city
  if (typeof ui.state === 'string') out.province = ui.state.toLowerCase()
  if (typeof ui.pincode === 'string') out.postal_code = ui.pincode
  if (typeof ui.country_code === 'string') out.country_code = ui.country_code
  if (typeof ui.type === 'string') {
    out.address_name = ui.type
    out.metadata = { ...(out.metadata || {}), type: ui.type }
  }
  if (typeof ui.isDefault === 'boolean') {
    out.is_default_shipping = ui.isDefault
    out.is_default_billing = ui.isDefault
  }
  return out
}

function medusaToUiAddress(m) {
  const name = [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || m.company || '—'
  return {
    id: m.id,
    type: m.metadata?.type || m.address_name || 'other',
    name,
    phone: m.phone || '',
    street: m.address_1 || '',
    landmark: m.address_2 || m.metadata?.landmark || '',
    city: m.city || '',
    state: m.province || '',
    pincode: m.postal_code || '',
    isDefault: !!(m.is_default_shipping || m.is_default_billing),
    raw: m,
  }
}

export async function getMe(params = {}) {
  return api.get('/customers/me', { params })
}

export async function listAddresses(params = {}) {
  const res = await api.get('/customers/me/addresses', { params })
  const list = Array.isArray(res.addresses) ? res.addresses : []
  return {
    ...res,
    addresses: list.map(medusaToUiAddress),
  }
}

export async function retrieveAddress(addressId, params = {}) {
  const res = await api.get(`/customers/me/addresses/${addressId}`, { params })
  return { address: medusaToUiAddress(res.address) }
}

export async function createAddress(uiAddress, options = {}) {
  const payload = uiToMedusaPayload(uiAddress)
  const res = await api.post(
    '/customers/me/addresses',
    payload,
    { meta: { successMessage: options.successMessage || 'Address added successfully' } }
  )
  return res
}

export async function deleteAddress(addressId, options = {}) {
  return api.delete(
    `/customers/me/addresses/${addressId}`,
    { meta: { successMessage: options.successMessage || 'Address removed' } }
  )
}

export async function updateAddress(addressId, uiPartial, options = {}) {
  const payload = uiToMedusaPartial(uiPartial)
  return api.post(
    `/customers/me/addresses/${addressId}`,
    payload,
    { meta: { successMessage: options.successMessage || 'Address updated' } }
  )
}

// Note: Medusa API docs excerpt didn't show an update endpoint for addresses.
// If/when available, add `updateAddress(addressId, uiAddress)` here and wire to the page.
