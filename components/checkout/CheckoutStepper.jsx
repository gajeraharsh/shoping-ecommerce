"use client";

import React from "react";

/**
 * Minimal, premium-style monochrome checkout stepper.
 * Usage: <CheckoutStepper current="payment" />
 * Steps: cart -> shipping -> payment -> review -> complete
 */
export default function CheckoutStepper({ current = "shipping" }) {
  const steps = [
    { id: "cart", label: "Cart" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
    { id: "complete", label: "Complete" },
  ];

  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === current)
  );

  return (
    <nav aria-label="Checkout progress" className="select-none" role="navigation">
      <ol className="hidden sm:flex items-center gap-4">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <li key={step.id} className="flex items-center">
              <div
                className={[
                  "text-xs tracking-wide uppercase",
                  isCurrent ? "text-black font-semibold" : "text-gray-500",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
              >
                {step.label}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={[
                    "mx-4 h-px w-10 sm:w-12",
                    isDone ? "bg-black" : "bg-gray-200",
                  ].join(" ")}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile segmented bar */}
      <div className="sm:hidden mt-2" aria-hidden>
        <div className="grid grid-cols-5 gap-1">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={[
                "h-1.5 rounded",
                idx <= currentIndex ? "bg-black" : "bg-gray-200",
              ].join(" ")}
            />
          ))}
        </div>
        <div className="mt-2 text-[11px] text-gray-600 uppercase tracking-wide">
          {steps[currentIndex]?.label}
        </div>
      </div>
    </nav>
  );
}
