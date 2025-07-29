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
      description: '10% off on orders above ���500'
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
    <div className="bg-white border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

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

      {/* Coupon Section */}
      <div className="border-t pt-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Have a coupon?</span>
        </div>

        {appliedCoupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Coupon Applied
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {appliedCoupon.description}
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              />
              <button
                onClick={applyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <div className="text-xs text-red-600">{couponError}</div>
            )}
            <div className="text-xs text-gray-500">
              Try: WELCOME10, FLAT50, or FIRST20
            </div>
          </div>
        )}
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
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          {discount > 0 && (
            <div className="text-xs text-green-600 mt-1">
              You saved ₹{discount}!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
