// /store/store.js
import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/features/ui/uiSlice'
import categoryReducer from '@/features/category/categorySlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    category: categoryReducer,
  },
  // add middleware customization if needed
})

export const dispatch = store.dispatch
export const getState = store.getState
