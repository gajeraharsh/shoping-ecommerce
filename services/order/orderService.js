// services/order/orderService.js
import { apiClient as api } from '@/services/config/setupApi'

// Map Medusa v2 order to UI-friendly shape with safe fallbacks
export function medusaToUiOrder(m) {
  if (!m || typeof m !== 'object') return {
    id: '—',
    date: new Date().toISOString(),
    status: 'processing',
    total: 0,
    items: 0,
    deliveryDate: null,
    address: '—',
    items_detail: [],
    raw: m,
  }

  const items = Array.isArray(m.items || m.line_items) ? (m.items || m.line_items) : []
  const shippingAddr = m.shipping_address || m.shipping_address_id || {}
  const total = m.total ?? m.paid_total ?? m.subtotal ?? 0
  const fs = (m.fulfillment_status || '').toString().toLowerCase()
  const coreStatus = (m.status || '').toString().toLowerCase()
  // Prefer fulfillment_status for UI status as requested
  const uiStatus = (() => {
    if (fs === 'canceled' || fs === 'cancelled') return 'cancelled'
    if (fs === 'delivered') return 'delivered'
    if (fs.includes('ship') || fs === 'fulfilled' || fs === 'partially_fulfilled') return 'shipped'
    // fallback to core status mapping
    if (coreStatus === 'canceled' || coreStatus === 'cancelled') return 'cancelled'
    return 'processing'
  })()
  const deliveredAt = m.delivered_at || m.fulfilled_at || null

  return {
    id: m.id || '—',
    date: m.created_at || m.updated_at || new Date().toISOString(),
    status: uiStatus,
    total: Number(total) || 0,
    items: items.reduce((acc, it) => acc + (it.quantity || 0), 0) || items.length || 0,
    deliveryDate: uiStatus === 'delivered' ? (deliveredAt || null) : null,
    address: [
      shippingAddr.address_1,
      shippingAddr.address_2,
      shippingAddr.city,
      shippingAddr.province,
      shippingAddr.postal_code,
    ].filter(Boolean).join(', ') || '—',
    items_detail: items.map((it) => ({
      name: it.title || it.variant_title || 'Item',
      image: it.thumbnail || it.metadata?.image || '/images/placeholder.png',
      price: Number(it.total || it.unit_price || 0),
      quantity: it.quantity || 1,
    })),
    raw: m,
  }
}

export function medusaToUiOrderDetail(m) {
  const base = medusaToUiOrder(m)
  const subtotal = Number(m.subtotal ?? 0)
  const shipping = Number(m.shipping_total ?? 0)
  const tax = Number(m.tax_total ?? 0)
  const discount = Number(m.discount_total ?? 0)

  const shippingAddress = m.shipping_address || {}
  const billingAddress = m.billing_address || {}

  // Build a user-friendly timeline for UI. Ensure it's always an array to avoid runtime errors.
  const createdAt = m.created_at || m.updated_at || null
  const fulfillment = Array.isArray(m.fulfillments) && m.fulfillments.length > 0 ? m.fulfillments[0] : null
  const shippedAt = fulfillment?.shipped_at || fulfillment?.created_at || null
  const deliveredAt = m.delivered_at || fulfillment?.delivered_at || null
  const rawPaymentStatus = (m.payment_status || m.payment_collection?.status || '').toString().toLowerCase()
  const paymentStatus = rawPaymentStatus === 'captured' ? 'paid' : rawPaymentStatus
  const paidAt = m.captured_at || m.paid_at || m.payment_collection?.captured_at || null

  const timeline = [
    {
      status: 'Order Placed',
      date: createdAt ? new Date(createdAt).toLocaleString() : '—',
      description: 'We have received your order and it is being processed.',
      completed: !!createdAt,
    },
    {
      status: 'Payment',
      // Show the same date as order placed for Payment step as requested
      date: createdAt ? new Date(createdAt).toLocaleString() : '—',
      description: paymentStatus ? `Payment status: ${paymentStatus}` : 'Awaiting payment confirmation.',
      completed: ['paid', 'partially_refunded', 'refunded'].includes(paymentStatus),
    },
    {
      status: 'Shipped',
      date: shippedAt ? new Date(shippedAt).toLocaleString() : '—',
      description: m.fulfillment_status ? `Fulfillment: ${m.fulfillment_status}` : 'Your package is being prepared for shipment.',
      completed: ['shipped', 'fulfilled', 'partially_fulfilled', 'delivered'].includes((m.fulfillment_status || '').toString().toLowerCase()),
    },
    {
      status: 'Delivered',
      date: deliveredAt ? new Date(deliveredAt).toLocaleString() : '—',
      description: 'Your package has been delivered.',
      completed: (m.fulfillment_status || '').toString().toLowerCase() === 'delivered',
    },
  ]

  return {
    ...base,
    subtotal,
    shipping,
    tax,
    discount,
    paymentMethod: m.payment_collection?.payments?.[0]?.provider_id || m.payment_session?.provider_id || '—',
    paymentStatus: paymentStatus || '—',
    trackingNumber: m.fulfillments?.[0]?.tracking_links?.[0]?.tracking_number || m.fulfillments?.[0]?.tracking_numbers?.[0] || '',
    items: base.items_detail.map((i, idx) => ({
      id: idx + 1,
      name: i.name,
      description: '',
      image: i.image,
      price: i.price,
      originalPrice: i.price,
      quantity: i.quantity,
      size: '',
      color: '',
      sku: m.items?.[idx]?.variant?.sku || '',
      canReturn: false,
      canReview: false,
    })),
    timeline,
    shippingAddress: {
      name: [shippingAddress.first_name, shippingAddress.last_name].filter(Boolean).join(' ') || shippingAddress.company || '—',
      phone: shippingAddress.phone || '—',
      email: m.email || '—',
      address: [shippingAddress.address_1, shippingAddress.address_2].filter(Boolean).join(', ') || '—',
      city: shippingAddress.city || '—',
      state: shippingAddress.province || '—',
      pincode: shippingAddress.postal_code || '—',
      country: shippingAddress.country_code || '—',
    },
    billingAddress: {
      name: [billingAddress.first_name, billingAddress.last_name].filter(Boolean).join(' ') || billingAddress.company || '—',
      phone: billingAddress.phone || '—',
      email: m.email || '—',
      address: [billingAddress.address_1, billingAddress.address_2].filter(Boolean).join(', ') || '—',
      city: billingAddress.city || '—',
      state: billingAddress.province || '—',
      pincode: billingAddress.postal_code || '—',
      country: billingAddress.country_code || '—',
    },
  }
}

// List orders with pagination (public Store endpoint)
export async function listMyOrders(params = {}) {
  const {
    limit = 10,
    offset = 0,
    fields,
    order,
    id,
    status,
    with_deleted,
    $and,
    $or,
    ...rest // forward any additional supported filters in future
  } = params

  const sort = order ?? '-created_at'

  const query = {
    limit,
    offset,
    ...(fields ? { fields } : {}),
    order: sort,
    ...(typeof with_deleted !== 'undefined' ? { with_deleted } : {}),
    ...(id ? { id } : {}),
    ...(status ? { status } : {}),
    ...($and ? { $and } : {}),
    ...($or ? { $or } : {}),
    ...rest,
  }

  const res = await api.get('/orders', { params: query })
  const orders = Array.isArray(res.orders) ? res.orders : []
  return {
    count: Number(res.count ?? orders.length),
    limit: Number(res.limit ?? limit),
    offset: Number(res.offset ?? offset),
    orders: orders.map(medusaToUiOrder),
    raw: res,
  }
}

// Retrieve a single order by id (public Store endpoint)
export async function retrieveMyOrder(orderId, params = {}) {
  const { fields } = params
  const res = await api.get(`/orders/${orderId}`, { params: { fields } })
  const order = res.order || res
  return { order: medusaToUiOrderDetail(order), raw: res }
}
