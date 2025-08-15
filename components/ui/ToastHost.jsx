// /components/ui/ToastHost.jsx
'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '@/features/ui/uiSlice'

export default function ToastHost() {
  const dispatch = useDispatch()
  const toasts = useSelector(s => s.ui.toasts)

  useEffect(() => {
    // Auto-dismiss each toast by its own duration
    const timers = toasts.map(t => setTimeout(() => dispatch(hideToast(t.id)), t.duration))
    return () => timers.forEach(clearTimeout)
  }, [toasts, dispatch])

  return (
    <div className="fixed z-[9999] top-4 right-4 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          className={`rounded-2xl shadow p-3 min-w-[240px] text-sm bg-white border ${
            t.type === 'success' ? 'border-green-300' : t.type === 'error' ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <strong className="block capitalize">{t.type}</strong>
          <span className="block mt-1">{t.message}</span>
          <button
            className="mt-2 text-xs underline"
            onClick={() => dispatch(hideToast(t.id))}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}
