// /app/providers.jsx
'use client'
import { Provider, useSelector } from 'react-redux'
import { store } from '@/store/store'
import ToastHost from '@/components/ui/ToastHost'
import ModalManager from '@/components/ui/ModalManager'
import { useEffect } from 'react'
import { fetchCategoryTree } from '@/features/category/categorySlice'
import { fetchMeUser } from '@/features/auth/authThunks'
import { ensureCart } from '@/features/cart/cartSlice'

function InitBoot() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  useEffect(() => {
    // Preload categories on app init
    store.dispatch(fetchCategoryTree())

    // If a token exists (from previous session), fetch current user profile
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (token) {
        store.dispatch(fetchMeUser())
      }
    } catch (_) {}

    // Always ensure cart on boot so header can show count immediately
    store.dispatch(ensureCart())
  }, [])  

  // Whenever auth state flips to authenticated (e.g., after login), ensure cart again
  useEffect(() => {
    if (isAuthenticated) {
      store.dispatch(ensureCart())
    }
  }, [isAuthenticated])
  return null
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <InitBoot />
      {children}
      <ToastHost />
      <ModalManager />
    </Provider>
  )
}
