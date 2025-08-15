// /hooks/useToast.js
'use client'
import { useDispatch } from 'react-redux'
import { showToast } from '@/features/ui/uiSlice'

export function useToast() {
  const dispatch = useDispatch()
  return {
    success: (message, duration) => dispatch(showToast({ type: 'success', message, duration })),
    error:   (message, duration) => dispatch(showToast({ type: 'error', message, duration })),
    info:    (message, duration) => dispatch(showToast({ type: 'info', message, duration })),
  }
}