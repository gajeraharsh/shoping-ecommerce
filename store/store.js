// /store/store.js
import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/features/ui/uiSlice'
import categoryReducer from '@/features/category/categorySlice'
import authReducer from '@/features/auth/authSlice'
import cartReducer from '@/features/cart/cartSlice'
import { setDispatcher } from '@/services/config/dispatcher'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    category: categoryReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  // add middleware customization if needed
})

// Register dispatcher for utilities that need dispatch without importing the store
setDispatcher(store.dispatch)

export const dispatch = store.dispatch
export const getState = store.getState
