// /app/providers.jsx
'use client'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import ToastHost from '@/components/ui/ToastHost'
import ModalManager from '@/components/ui/ModalManager'
import { useEffect } from 'react'
import { fetchCategoryTree } from '@/features/category/categorySlice'
import { fetchMeUser } from '@/features/auth/authThunks'

function InitBoot() {
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
  }, [])
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
