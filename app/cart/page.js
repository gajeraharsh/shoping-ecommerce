'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container-fluid section-padding">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container-fluid section-padding-sm">
        <div className="mb-8">
          <h1 className="heading-lg text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="body-base text-fade">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
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
      <Footer />
    </div>
  );
}
