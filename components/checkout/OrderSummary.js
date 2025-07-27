'use client';

import { useCart } from '@/contexts/CartContext';

export default function OrderSummary() {
  const { cartItems, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      {/* Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map(item => (
          <div key={item.cartId} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </div>
              <div className="text-xs text-gray-500">
                {item.size} | {item.color} | Qty: {item.quantity}
              </div>
            </div>
            <div className="text-sm font-medium">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>
      
      {/* Totals */}
      <div className="space-y-3 text-sm border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600' : ''}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{tax}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}