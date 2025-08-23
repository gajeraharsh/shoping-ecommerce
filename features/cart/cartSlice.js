// /features/cart/cartSlice.js
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { cartService } from '@/services/modules/cart/cartService'

const initialState = {
  cart: null,
  status: 'idle',
  error: null,
}

export const ensureCart = createAsyncThunk('cart/ensureCart', async (_, { rejectWithValue }) => {
  try {
    const cart = await cartService.ensureCart()
    return cart
  } catch (e) {
    return rejectWithValue(e?.response?.data || e.message)
  }
})

export const updateCartEmail = createAsyncThunk(
  'cart/updateCartEmail',
  async ({ email, cartId }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      const cart = await cartService.updateCart({ cartId: id, data: { email }, meta: { successMessage: null } })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const completeCart = createAsyncThunk(
  'cart/completeCart',
  async ({ cartId, query }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      const data = await cartService.completeCart({ cartId: id, query })
      return data
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const applyPromotionCode = createAsyncThunk(
  'cart/applyPromotionCode',
  async ({ code, cartId }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      // Previous markers to verify effect
      const prevCart = state.cart?.cart || state.cart
      const prevCodes = Array.isArray(prevCart?.promotions)
        ? prevCart.promotions.map((p) => p.code).filter(Boolean)
        : Array.isArray(prevCart?.discounts)
          ? prevCart.discounts.map((d) => d.code || d?.promotion?.code).filter(Boolean)
          : []
      const prevDiscount = prevCart?.totals?.discount_total ?? prevCart?.discount_total ?? 0

      const cart = await cartService.addPromotion({ cartId: id, code })

      const newCodes = Array.isArray(cart?.promotions)
        ? cart.promotions.map((p) => p.code).filter(Boolean)
        : Array.isArray(cart?.discounts)
          ? cart.discounts.map((d) => d.code || d?.promotion?.code).filter(Boolean)
          : []
      const newDiscount = cart?.totals?.discount_total ?? cart?.discount_total ?? 0

      const applied = (newCodes?.length || 0) > (prevCodes?.length || 0) || newDiscount > prevDiscount
      if (!applied) {
        return rejectWithValue('Invalid or ineligible coupon')
      }
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const updateCartShippingAddress = createAsyncThunk(
  'cart/updateCartShippingAddress',
  async ({ address, cartId }, { getState, rejectWithValue }) => {
    try {
      if (!address) {
        throw new Error('No address selected')
      }
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      // Map saved customer address -> Medusa v2 address shape
      const mapped = {
        first_name: address.first_name || address.firstName || address.name || undefined,
        last_name: address.last_name || address.lastName || undefined,
        address_1: address.address_1 || address.street || address.address || undefined,
        address_2: address.address_2 || (address.landmark ? `Near ${address.landmark}` : undefined),
        city: address.city,
        province: address.province || address.state,
        postal_code: address.postal_code || address.pincode || address.zipCode,
        country_code: address.country_code,
        phone: address.phone,
        company: address.company,
        metadata: { ...(address.metadata || {}), type: address.type, customer_address_id: address.id },
      }
      const cart = await cartService.updateCart({
        cartId: id,
        data: { shipping_address: mapped },
        meta: { successMessage: null },
      })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const updateCartBillingAddress = createAsyncThunk(
  'cart/updateCartBillingAddress',
  async ({ address, cartId }, { getState, rejectWithValue }) => {
    try {
      if (!address) {
        throw new Error('No billing address selected')
      }
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      const mapped = {
        first_name: address.first_name || address.firstName || address.name || undefined,
        last_name: address.last_name || address.lastName || undefined,
        address_1: address.address_1 || address.street || address.address || undefined,
        address_2: address.address_2 || (address.landmark ? `Near ${address.landmark}` : undefined),
        city: address.city,
        province: address.province || address.state,
        postal_code: address.postal_code || address.pincode || address.zipCode,
        country_code: address.country_code,
        phone: address.phone,
        company: address.company,
        metadata: { ...(address.metadata || {}), type: address.type, customer_address_id: address.id },
      }
      const cart = await cartService.updateCart({
        cartId: id,
        data: { billing_address: mapped },
        meta: { successMessage: null },
      })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const removePromotionCode = createAsyncThunk(
  'cart/removePromotionCode',
  async ({ code, cartId }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const id = cartId || state.cart?.cart?.id || state.cart?.id
      const cart = await cartService.removePromotion({ cartId: id, code })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const fetchCart = createAsyncThunk('cart/fetchCart', async (cartId, { rejectWithValue }) => {
  try {
    const cart = await cartService.retrieve(cartId)
    return cart
  } catch (e) {
    return rejectWithValue(e?.response?.data || e.message)
  }
})

export const addLineItem = createAsyncThunk(
  'cart/addLineItem',
  async ({ variant_id, quantity = 1, metadata, cartId }, { rejectWithValue }) => {
    try {
      const cart = await cartService.addLineItem({ cartId, variant_id, quantity, metadata })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const updateLineItem = createAsyncThunk(
  'cart/updateLineItem',
  async ({ line_id, quantity, metadata, cartId }, { rejectWithValue }) => {
    try {
      const cart = await cartService.updateLineItem({ cartId, line_id, quantity, metadata })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

export const deleteLineItem = createAsyncThunk(
  'cart/deleteLineItem',
  async ({ line_id, cartId }, { rejectWithValue }) => {
    try {
      const cart = await cartService.deleteLineItem({ cartId, line_id })
      return cart
    } catch (e) {
      return rejectWithValue(e?.response?.data || e.message)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(ensureCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(ensureCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(ensureCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to ensure cart'
      })

      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load cart'
      })

      .addCase(applyPromotionCode.pending, (state) => {
        // Do not toggle global status; prevent skeleton flash on coupon apply
      })
      .addCase(applyPromotionCode.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(applyPromotionCode.rejected, (state, action) => {
        state.error = action.payload || 'Failed to apply coupon'
      })

      .addCase(removePromotionCode.pending, (state) => {
        // Do not toggle global status; prevent skeleton flash on coupon remove
      })
      .addCase(removePromotionCode.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(removePromotionCode.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove coupon'
      })

      .addCase(updateCartEmail.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateCartEmail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(updateCartEmail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to update cart email'
      })

      .addCase(updateCartShippingAddress.pending, (state) => {
        // keep UX smooth without full-page loading states
      })
      .addCase(updateCartShippingAddress.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(updateCartShippingAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to set shipping address'
      })

      .addCase(updateCartBillingAddress.pending, (state) => {
        // no global loading
      })
      .addCase(updateCartBillingAddress.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(updateCartBillingAddress.rejected, (state, action) => {
        state.error = action.payload || 'Failed to set billing address'
      })

      .addCase(addLineItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addLineItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(addLineItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to add item'
      })

      .addCase(updateLineItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateLineItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(updateLineItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to update item'
      })

      .addCase(deleteLineItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteLineItem.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(deleteLineItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to remove item'
      })

      .addCase(completeCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(completeCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const payload = action.payload
        // If server returns a cart (error case), keep latest cart in state for UI to show errors
        if (payload && payload.type === 'cart' && payload.cart) {
          state.cart = payload.cart
        }
      })
      .addCase(completeCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to complete cart'
      })
  },
})

export const { resetCartState } = cartSlice.actions

export default cartSlice.reducer

// Selectors (memoized to prevent new references)
const EMPTY_ARRAY = Object.freeze([])
const ZERO_TOTALS = Object.freeze({
  total: 0,
  subtotal: 0,
  tax_total: 0,
  shipping_total: 0,
  discount_total: 0,
})

const selectCartState = (state) => state.cart
const selectCartRaw = (state) => state.cart.cart

export const selectCart = selectCartRaw
export const selectCartStatus = createSelector([selectCartState], (s) => s.status)
export const selectCartError = createSelector([selectCartState], (s) => s.error)
export const selectCartItems = createSelector([selectCartRaw], (cart) => cart?.items ?? EMPTY_ARRAY)
export const selectCartTotals = createSelector([selectCartRaw], (cart) => {
  if (!cart) return ZERO_TOTALS
  const {
    total = 0,
    subtotal = 0,
    tax_total = 0,
    shipping_total = 0,
    discount_total = 0,
  } = cart
  return { total, subtotal, tax_total, shipping_total, discount_total }
})

// Sum of quantities for all items in cart (primitive return avoids referential warnings)
export const selectCartItemsCount = createSelector([selectCartItems], (items) =>
  Array.isArray(items) ? items.reduce((acc, i) => acc + (Number(i?.quantity) || 0), 0) : 0
)
