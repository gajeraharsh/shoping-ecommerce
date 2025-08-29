'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartSummary() {
  const { items, totals, cart } = useCart();
  const totalsSource = totals ?? cart ?? {};
  const shipping = Number(totalsSource?.shipping_total || 0);
  const tax = Number(totalsSource?.tax_total || 0);
  const discount = Number(totalsSource?.discount_total || 0);
  const computedItemsTotal = Array.isArray(items)
    ? items.reduce((sum, i) => sum + (Number(i?.unit_price) || 0) * (Number(i?.quantity) || 0), 0)
    : 0;
  const itemTotal = Number(
    totalsSource?.item_total ?? totalsSource?.item_subtotal ?? computedItemsTotal
  ) || 0;
  const totalQty = Array.isArray(items)
    ? items.reduce((acc, i) => acc + (Number(i?.quantity) || 0), 0)
    : 0;
  const finalTotal = Number(
    totalsSource?.total ?? (itemTotal - discount + shipping + tax)
  ) || 0;

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Total Product Price ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
          <span>₹{itemTotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Total Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span className={shipping === 0 ? 'text-green-600' : ''}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{finalTotal}</span>
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
