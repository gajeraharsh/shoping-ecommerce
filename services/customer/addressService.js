// services/customer/addressService.js
import { apiClient as api } from '@/services/config/setupApi'
import states from '@/data/india-states.json'

// Build helpers for state <-> code mapping
const CODE_SET = new Set(states.map((s) => s.code))
const CODE_SET_LOWER = new Set(states.map((s) => s.code.toLowerCase()))
const NAME_TO_CODE = states.reduce((acc, s) => {
  acc[s.name] = s.code
  acc[s.name.toLowerCase()] = s.code
  return acc
}, {})
const LOWER_TO_CODE = states.reduce((acc, s) => {
  acc[s.code.toLowerCase()] = s.code
  return acc
}, {})

function toUiStateCode(input) {
  if (!input) return ''
  const raw = String(input)
  // If already a 2-letter code (any case), normalize to uppercase if recognized
  if (raw.length === 2 && CODE_SET_LOWER.has(raw.toLowerCase())) {
    return LOWER_TO_CODE[raw.toLowerCase()] || raw.toUpperCase()
  }
  // If looks like a name, try to map to code
  const mapped = NAME_TO_CODE[raw] || NAME_TO_CODE[raw.toLowerCase()]
  if (mapped) return mapped
  // Fallback: return original uppercased if 2 letters, else empty string
  return raw.length === 2 ? raw.toUpperCase() : ''
}

function toMedusaProvince(input) {
  // Expect 2-letter code; convert names to code and lowercase for Medusa
  const code = toUiStateCode(input)
  return code ? code.toLowerCase() : ''
}

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
    // Medusa expects province normalized; we send 2-letter code in lowercase
    province: toMedusaProvince(ui.state),
    postal_code: ui.pincode || '',
    // Use provided country code or default to India ('in')
    country_code: (ui.country_code || 'IN').toLowerCase(),
    address_name: ui.type || 'other',
    is_default_shipping: !!ui.isDefault,
    is_default_billing: !!ui.isDefault,
    metadata: {
      type: ui.type || 'other',
      landmark: ui.landmark || '',
      country: ui.country || 'India',
    },
  }
}

// Build a partial payload for PATCH updates: only include keys present in ui input
function uiToMedusaPartial(ui) {
  const out = {}
  if (typeof ui.firstName === 'string') out.first_name = ui.firstName
  if (typeof ui.lastName === 'string') out.last_name = ui.lastName
  if (typeof ui.address1 === 'string') out.address_1 = ui.address1
  if (typeof ui.address2 === 'string') {
    out.address_2 = ui.address2
    out.metadata = { ...(out.metadata || {}), landmark: ui.address2 }
  }
  if (typeof ui.city === 'string') out.city = ui.city
  if (typeof ui.state === 'string') out.province = toMedusaProvince(ui.state)
  if (typeof ui.pincode === 'string') out.postal_code = ui.pincode
  if (typeof ui.phone === 'string') out.phone = ui.phone
  if (typeof ui.country_code === 'string') out.country_code = ui.country_code.toLowerCase()
  if (typeof ui.country === 'string') {
    out.metadata = { ...(out.metadata || {}), country: ui.country }
  }
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
    // Normalize province from Medusa to uppercase 2-letter code for UI
    state: toUiStateCode(m.province || ''),
    pincode: m.postal_code || '',
    country_code: (m.country_code || 'IN').toLowerCase(),
    country: m.metadata?.country || undefined,
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
