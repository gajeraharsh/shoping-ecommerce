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
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🛒</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
