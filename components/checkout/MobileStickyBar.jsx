"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";

/**
 * Sticky bottom bar for mobile: shows total and submit CTA.
 * Props: { submittingState: { isSubmitting, visualSubmitting } }
 */
export default function MobileStickyBar({ submittingState }) {
  const { totals } = useCart();
  const total = Math.max(
    0,
    Number(totals?.total ?? (totals?.subtotal || 0) + (totals?.shipping_total || 0) + (totals?.tax_total || 0) - (totals?.discount_total || 0))
  );

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-base font-semibold tabular-nums">₹{total}</div>
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
      <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
    </div>
  );
}
