// /services/modules/product/productService.js
import { apiClient } from '@/services/config/setupApi'
import { ENDPOINTS } from '@/services/constants/endpoints'

function getStoredCartId() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('cart_id')
  } catch (_) {
    return null
  }
}

export const getProducts = (params = {}) => {
  const region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
  const sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL
  const cart_id = params.cart_id || getStoredCartId() || undefined

  // Default fields to include common expansions if not explicitly provided
  const defaultFields = '+variants,+variants.options,+options,+images,+tags,+collection,+categories,+wishlist,+metadata'

  // Ensure region_id and optional sales_channel_id are passed; allow caller to override
  const merged = {
    region_id,
    ...(sales_channel_id ? { sales_channel_id } : {}),
    ...(cart_id ? { cart_id } : {}),
    fields: params.fields || defaultFields,
    ...params,
  }

  return apiClient.get(ENDPOINTS.PRODUCT.LIST, { params: merged })
}

export const getProductById = (id, config = {}) => {
  const region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
  const sales_channel_id = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL

  // Helper to ensure "+metadata" is always present in fields param
  const ensurePlusMetadata = (fields) => {
    const parts = String(fields || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!parts.includes('+metadata')) parts.push('+metadata')
    return parts.join(',')
  }

  const incomingParams = config?.params || {}
  const params = {
    ...incomingParams,
    region_id,
    ...(sales_channel_id ? { sales_channel_id } : {}),
    fields: ensurePlusMetadata(incomingParams.fields || '+variants,+variants.options,+options,+images,+tags,+collection,+categories'),
  }

  return apiClient.get(ENDPOINTS.PRODUCT.DETAILS(id), { ...config, params })
}

export const createProduct = (payload) =>
  apiClient.post(ENDPOINTS.PRODUCT.LIST, payload, {
    meta: { successMessage: 'Product created successfully' },
  })

export const updateProduct = (id, payload) =>
  apiClient.put(ENDPOINTS.PRODUCT.DETAILS(id), payload, {
    meta: { successMessage: 'Product updated successfully' },
  })

export const deleteProduct = (id) =>
  apiClient.delete(ENDPOINTS.PRODUCT.DETAILS(id), {
    meta: { successMessage: 'Product deleted successfully' },
  })
