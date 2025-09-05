'use client'
import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

export default function SuccessModal({ onClose, title = 'Order placed successfully', message = 'Thank you for your purchase!', orderId, onViewOrder, onContinue }) {
  const firstButtonRef = useRef(null)

  useEffect(() => {
    // Autofocus primary action for accessibility
    firstButtonRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        className="relative bg-white rounded-2xl p-7 sm:p-9 shadow-2xl w-full max-w-[560px] border animate-scale-in"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center shrink-0">
            <Check className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 id="success-title" className="text-2xl font-semibold tracking-tight">{title}</h3>
            {orderId && <p className="text-xs text-gray-500 mt-0.5">Order ID: {orderId}</p>}
            <p className="text-base text-gray-700 mt-4">{message}</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            ref={firstButtonRef}
            onClick={onViewOrder}
            className="px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 active:scale-[0.98] transition-all text-sm sm:text-base whitespace-nowrap"
          >
            View Order
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2.5 rounded-xl border hover:bg-gray-50 active:scale-[0.98] transition-all text-sm sm:text-base whitespace-nowrap"
          >
            Continue
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border hover:bg-gray-50 active:scale-[0.98] transition-all text-sm sm:text-base whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      </div>
      <style jsx global>{`
        .animate-fade-in { animation: fade-in 180ms ease-out both; }
        .animate-scale-in { animation: scale-in 200ms ease-out both; }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}
