// /store/store.js
import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  // add middleware customization if needed
})

export const dispatch = store.dispatch
export const getState = store.getState
