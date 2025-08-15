// /app/providers.jsx
'use client'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import ToastHost from '@/components/ui/ToastHost'
import ModalManager from '@/components/ui/ModalManager'

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <ToastHost />
      <ModalManager />
    </Provider>
  )
}
