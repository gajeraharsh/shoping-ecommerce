'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Tag, Check, X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

export default function OrderSummary() {
  const { items, totals } = useCart();
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

  // Prefer Redux totals; fallback to computed values when absent
  const computedSubtotal = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0);
  const subtotal = totals?.subtotal ?? computedSubtotal;
  const shipping = totals?.shipping_total ?? (subtotal > 999 ? 0 : 99);
  const tax = totals?.tax_total ?? Math.round(subtotal * 0.18);

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = (totals?.total ?? (subtotal + shipping + tax)) - discount;

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
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <SmartImage src={item.thumbnail} alt={item.title} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </div>
              <div className="text-xs text-gray-500">
                {(() => {
                  const fromMeta = [item?.metadata?.size, item?.metadata?.color].filter(Boolean).join(' / ');
                  return (
                    item?.variant_title || item?.variant?.title || fromMeta || item?.description || 'Variant'
                  );
                })()} {`| Qty: ${item.quantity}`}
              </div>
            </div>
            <div className="text-sm font-medium">
              ₹{item.unit_price * item.quantity}
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
          <div className="space-y-3">
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:items-stretch gap-2 sm:gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 w-full h-12 px-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent touch-manipulation box-border"
                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              />
              <button
                onClick={applyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className="inline-flex items-center justify-center h-12 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold disabled:opacity-50 sm:min-w-[100px] touch-manipulation whitespace-nowrap box-border shrink-0 sm:self-stretch"
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
