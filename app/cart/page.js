'use client';

import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import CartItemsSkeleton from '@/components/cart/CartItemsSkeleton';
import CartSummarySkeleton from '@/components/cart/CartSummarySkeleton';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CartPage() {
  const { items, status, cart } = useCart();

  // Show skeletons during the initial cart load to prevent empty-state flash
  const isInitialLoading = status === 'loading' && !cart;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="mb-8">
            <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsSkeleton />
            </div>
            <div className="lg:col-span-1">
              <CartSummarySkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="heading-lg text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="body-lg text-fade mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="heading-lg text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="body-base text-fade">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
