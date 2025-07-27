'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Tag, Check, X } from 'lucide-react';

export default function OrderSummary() {
  const { cartItems, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Mock coupon data
  const validCoupons = {
    'WELCOME10': {
      type: 'percentage',
      value: 10,
      minOrder: 500,
      description: '10% off on orders above ₹500'
    },
    'FLAT50': {
      type: 'fixed',
      value: 50,
      minOrder: 200,
      description: '₹50 off on orders above ₹200'
    },
    'FIRST20': {
      type: 'percentage',
      value: 20,
      minOrder: 1000,
      description: '20% off on orders above ₹1000'
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = subtotal + shipping + tax - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponError('');

    // Simulate API call
    setTimeout(() => {
      const coupon = validCoupons[couponCode.toUpperCase()];

      if (!coupon) {
        setCouponError('Invalid coupon code');
      } else if (subtotal < coupon.minOrder) {
        setCouponError(`Minimum order amount ₹${coupon.minOrder} required`);
      } else {
        setAppliedCoupon(coupon);
        setCouponCode('');
        setCouponError('');
      }

      setIsApplying(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

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
