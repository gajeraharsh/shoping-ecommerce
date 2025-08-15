// /hooks/useModal.js
'use client'
import { useDispatch } from 'react-redux'
import { openModal, closeModal } from '@/features/ui/uiSlice'

export function useModal() {
  const dispatch = useDispatch()
  return {
    open: (payload) => dispatch(openModal(payload)),
    close: () => dispatch(closeModal()),
  }
}
