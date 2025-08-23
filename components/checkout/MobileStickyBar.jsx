"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import OrderSummary from "@/components/checkout/OrderSummary";
import { formatINR } from "@/utils/money";
import { X } from "lucide-react";

/**
 * Sticky bottom bar for mobile: shows total and submit CTA.
 * Props: { submittingState: { isSubmitting, visualSubmitting } }
 */
export default function MobileStickyBar({ submittingState }) {
  const { totals } = useCart();
  // Treat incoming totals as MAJOR units (e.g., 10 => ₹10.00)
  const total = Math.max(
    0,
    Number(
      totals?.total ??
        (Number(totals?.subtotal) || 0) +
          (Number(totals?.shipping_total) || 0) +
          (Number(totals?.tax_total) || 0) -
          (Number(totals?.discount_total) || 0)
    )
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40">
      {/* Expandable Order Summary Drawer */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-summary"
        className={`fixed inset-x-0 bottom-0 z-[60] bg-white border-t shadow-2xl rounded-t-2xl overflow-hidden transform-gpu transition-transform duration-300 ease-in-out will-change-transform ${open ? "translate-y-0 pointer-events-auto" : "translate-y-[100%] pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Order summary"
        aria-hidden={!open}
      >
        {/* Drawer Header with Close */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold">Order Summary</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 active:bg-gray-200"
            aria-label="Close summary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] min-h-[35vh] overflow-auto px-3 pt-3 pb-2">
          <OrderSummary />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
      </div>
      {/* Sticky CTA Bar */}
      <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 pt-2">
          <div className="text-[11px] text-gray-600 flex items-center justify-between">
            <span>100% Secure Payment · Easy returns</span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-gray-900 font-medium text-xs"
              aria-expanded={open}
              aria-controls="mobile-summary"
            >
              {open ? "Hide summary" : "View summary"}
              <svg
                className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="py-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-base font-semibold tabular-nums">{formatINR(total)}</div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              aria-busy={submittingState?.isSubmitting}
              disabled={submittingState?.isSubmitting}
              className="inline-flex items-center justify-center min-w-[140px] h-12 px-5 rounded-xl bg-black text-white font-semibold text-sm shadow-lg hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {submittingState?.visualSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
      </div>
    </div>
  );
}
