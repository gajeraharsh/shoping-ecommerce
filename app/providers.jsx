// /app/providers.jsx
'use client'
import { Provider, useSelector } from 'react-redux'
import { store } from '@/store/store'
import ToastHost from '@/components/ui/ToastHost'
import ModalManager from '@/components/ui/ModalManager'
import { useEffect, useRef } from 'react'
import { fetchCategoryTree } from '@/features/category/categorySlice'
import { fetchMeUser } from '@/features/auth/authThunks'
import { ensureCart, fetchCart } from '@/features/cart/cartSlice'

function InitBoot() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const bootEnsuredRef = useRef(false)
  useEffect(() => {
    // Preload categories on app init
    store.dispatch(fetchCategoryTree())

    // If a token exists (from previous session), fetch current user profile
    try {
      const state = store.getState()
      const token = state?.auth?.token
      if (token) {
        store.dispatch(fetchMeUser())
      }
    } catch (_) {}

    // Always ensure cart on boot so header can show count immediately
    store.dispatch(ensureCart())
    bootEnsuredRef.current = true
  }, [])  

  // Whenever auth state flips to authenticated (e.g., after login), ensure cart again
  useEffect(() => {
    if (isAuthenticated) {
      // Avoid back-to-back ensure if we just ensured on boot
      const state = store.getState()
      const cartId = state?.cart?.cart?.id || state?.cart?.id
      if (cartId) {
        store.dispatch(fetchCart(cartId))
      } else if (!bootEnsuredRef.current) {
        store.dispatch(ensureCart())
      }
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
