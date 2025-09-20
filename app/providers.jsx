// /app/providers.jsx
'use client'
import { Provider, useSelector } from 'react-redux'
import { store } from '@/store/store'
import ToastHost from '@/components/ui/ToastHost'
import ModalManager from '@/components/ui/ModalManager'
import { useEffect, useRef } from 'react'
import { fetchCategoryTree } from '@/features/category/categorySlice'
import { ensureCart, fetchCart } from '@/features/cart/cartSlice'
import { fetchCollections } from '@/features/collection/collectionSlice'

function InitBoot() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const bootEnsuredRef = useRef(false)
  const didInitRef = useRef(false)
  useEffect(() => {
    // Guard against React 18 StrictMode double-invoking effects in development
    if (didInitRef.current) return
    didInitRef.current = true

    // Preload categories on app init (header/menu) only if not already loaded
    const catStatus = store.getState()?.category?.status
    if (catStatus !== 'succeeded' && catStatus !== 'loading') {
      store.dispatch(fetchCategoryTree())
    }

    // Preload collections globally for filter label mapping
    const colStatus = store.getState()?.collection?.status
    if (colStatus !== 'succeeded' && colStatus !== 'loading') {
      store.dispatch(fetchCollections())
    }

    // AuthContext handles /me hydration; avoid duplicate fetchMe here

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
