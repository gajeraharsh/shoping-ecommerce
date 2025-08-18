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
