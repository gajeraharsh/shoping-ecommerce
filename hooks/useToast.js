// /hooks/useToast.js
'use client'
import { useDispatch } from 'react-redux'
import { showToast as showToastAction } from '@/features/ui/uiSlice'

export function useToast() {
  const dispatch = useDispatch()
  return {
    // Generic function compatible with existing calls: showToast(message, type)
    showToast: (message, type = 'info', duration) =>
      dispatch(showToastAction({ type, message, duration })),
    // Convenience helpers
    success: (message, duration) => dispatch(showToastAction({ type: 'success', message, duration })),
    error:   (message, duration) => dispatch(showToastAction({ type: 'error', message, duration })),
    info:    (message, duration) => dispatch(showToastAction({ type: 'info', message, duration })),
  }
}