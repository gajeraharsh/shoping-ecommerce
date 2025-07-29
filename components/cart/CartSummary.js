'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartSummary() {
  const { cartItems, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600' : ''}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
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

      {shipping > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          Add ₹{999 - subtotal} more to get FREE shipping!
        </div>
      )}

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
