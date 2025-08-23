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
    <div className="fixed z-[9999] top-6 right-6 space-y-4" aria-live="polite" aria-atomic="false">
      {toasts.map(t => {
        const isError = t.type === 'error'
        const isSuccess = t.type === 'success'
        const isInfo = !isError && !isSuccess
        const icon = (
          <span
            className={
              isError
                ? 'inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700'
                : isSuccess
                ? 'inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700'
                : 'inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700'
            }
          >
            {t.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1 0 19.5 0 9.75 9.75 0 0 0-19.5 0Zm14.03-2.28a.75.75 0 0 0-1.06-1.06l-4.97 4.97-2.19-2.19a.75.75 0 1 0-1.06 1.06l2.72 2.72c.3.3.79.3 1.09 0l5.47-5.5Z" clipRule="evenodd" />
              </svg>
            )}
            {t.type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm3.53 12.72a.75.75 0 0 1-1.06 1.06L12 13.56l-2.47 2.47a.75.75 0 1 1-1.06-1.06L10.94 12 8.47 9.53a.75.75 0 1 1 1.06-1.06L12 10.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L13.06 12l2.47 2.47Z" clipRule="evenodd" />
              </svg>
            )}
            {(!t.type || (t.type !== 'success' && t.type !== 'error')) && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM10.875 9A1.125 1.125 0 1 1 12 10.125 1.125 1.125 0 0 1 10.875 9ZM12 11.625a.75.75 0 0 1 .75.75v3.375a.75.75 0 0 1-1.5 0v-3.375a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        )

        return (
          <div
            key={t.id}
            role={isError ? 'alert' : 'status'}
            className={
              `group relative min-w-[320px] max-w-md rounded-2xl border p-5 shadow-lg transition-all ` +
              (isError
                ? 'bg-red-50 border-red-200 text-red-900 shadow-red-100'
                : isSuccess
                ? 'bg-green-50 border-green-200 text-green-900 shadow-green-100'
                : 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100')
            }
          >
            <div className="flex items-start gap-4">
              {icon}
              <div className={`flex-1 text-[0.95rem] ${isError ? 'text-red-900' : isSuccess ? 'text-green-900' : 'text-blue-900'}`}>
                <div className="font-semibold tracking-tight text-base">
                  {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notice'}
                </div>
                <div className={`mt-1 leading-relaxed ${isError ? 'text-red-800' : isSuccess ? 'text-green-800' : 'text-blue-800'}`}>{t.message}</div>
              </div>
              <button
                aria-label="Dismiss notification"
                className={`ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                  isError
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                    : isSuccess
                    ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                    : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                }`}
                onClick={() => dispatch(hideToast(t.id))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm-2.47 6.78a.75.75 0 1 0-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 1 0 1.06 1.06L12 13.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L13.06 12l2.47-2.47a.75.75 0 0 0-1.06-1.06L12 10.94 9.53 9.03Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
