'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartSummary() {
  const { items, totals, cart } = useCart();

  const subtotal = totals.subtotal || 0;
  const shipping = totals.shipping_total || 0;
  const tax = totals.tax_total || 0;
  const total = totals.total || subtotal + shipping + tax;

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (18%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Promo or shipping notice can be reintroduced with business logic if needed */}

      <Link
        href="/checkout"
        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold mt-6 block text-center"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="w-full text-center text-primary hover:underline mt-4 block"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
