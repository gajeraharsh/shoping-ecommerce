'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Tag, Check, X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { formatINR } from '@/utils/money';

export default function OrderSummary() {
  const { cart, items, totals, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  // Display values exactly as provided (major units) in INR

  // Use API-provided totals as the single source of truth to avoid double-counting.
  // Fallback to simple computed values only when API totals are absent.
  const computedItemsTotal = items.reduce(
    (sum, i) => sum + ((Number(i.unit_price) || 0) * (Number(i.quantity) || 0)),
    0
  );
  const totalsSource = totals ?? cart ?? {};
  const itemTotal = Number(
    totalsSource?.item_total ?? totalsSource?.item_subtotal ?? computedItemsTotal
  ) || 0;
  const shipping = Number(totalsSource?.shipping_total ?? 0) || 0;
  const tax = Number(totalsSource?.tax_total ?? 0) || 0;
  const discount = Number(totalsSource?.discount_total ?? 0) || 0;
  const finalTotal = Number(
    totalsSource?.total ?? (itemTotal + shipping + tax - discount)
  ) || 0;
  const totalQty = Array.isArray(items)
    ? items.reduce((acc, i) => acc + (Number(i?.quantity) || 0), 0)
    : 0;

  // Applied coupon codes from cart
  const appliedCodes = useMemo(() => {
    if (!cart) return [];
    if (Array.isArray(cart.promotions) && cart.promotions.length) {
      return cart.promotions.map(p => p.code).filter(Boolean);
    }
    if (Array.isArray(cart.discounts) && cart.discounts.length) {
      return cart.discounts.map(d => d.code || d?.promotion?.code).filter(Boolean);
    }
    return [];
  }, [cart]);

  const onApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setIsApplying(true);
      setCouponError('');
      const prevCodes = appliedCodes;
      const prevDiscount = discount;
      const code = couponCode.trim();
      const updated = await applyCoupon(code);
      // Determine if coupon was actually applied
      const newCodes = Array.isArray(updated?.promotions)
        ? updated.promotions.map(p => p.code).filter(Boolean)
        : Array.isArray(updated?.discounts)
          ? updated.discounts.map(d => d.code || d?.promotion?.code).filter(Boolean)
          : [];
      const newDiscount = updated?.totals?.discount_total ?? updated?.discount_total ?? 0;
      const applied = (newCodes?.length || 0) > (prevCodes?.length || 0) || newDiscount > prevDiscount;
      if (!applied) {
        setCouponError('Invalid or ineligible coupon');
      } else {
        setCouponCode('');
      }
    } catch (e) {
      const msg =
        e?.message ||
        e?.payload ||
        e?.data?.message ||
        e?.response?.data?.message ||
        (typeof e === 'string' ? e : null) ||
        'Invalid or ineligible coupon';
      setCouponError(msg);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <SmartImage src={item?.metadata?.image_url || item.thumbnail} alt={item.title} className="object-cover" />
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
              {formatINR((Number(item.unit_price) || 0) * (Number(item.quantity) || 0))}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section (real API) */}
      <div className="border-t pt-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Have a coupon?</span>
        </div>

        <div className="min-h-[96px]">
          {appliedCodes.length > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Coupon Applied</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1 break-all">
                    {appliedCodes.join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => removeCoupon(appliedCodes[0])}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Remove coupon"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label htmlFor="coupon" className="sr-only">Coupon code</label>
              <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:items-stretch gap-2 sm:gap-3">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  aria-invalid={!!couponError}
                  aria-describedby={couponError ? 'coupon-error' : undefined}
                  className="flex-1 w-full h-12 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black touch-manipulation box-border"
                  onKeyDown={(e) => e.key === 'Enter' && onApplyCoupon()}
                />
                <button
                  onClick={onApplyCoupon}
                  disabled={isApplying || !couponCode.trim()}
                  className="inline-flex items-center justify-center h-12 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold disabled:opacity-50 sm:min-w-[100px] touch-manipulation whitespace-nowrap box-border shrink-0 sm:self-stretch"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {couponError && (
                <div id="coupon-error" role="alert" className="text-xs text-red-600">{couponError}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Totals (driven by API totals) */}
      <div className="space-y-3 text-sm border-t pt-4">
        <div className="flex justify-between">
          <span>Total Product Price ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
          <span className="tabular-nums">{formatINR(itemTotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Total Discount</span>
            <span className="tabular-nums">-{formatINR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span className={shipping === 0 ? 'text-green-600' : ''}>
            {shipping === 0 ? 'FREE' : formatINR(shipping)}
          </span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatINR(finalTotal)}</span>
          </div>
          {discount > 0 && (
            <div className="text-xs text-green-600 mt-1">
              You saved {formatINR(discount)}!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
