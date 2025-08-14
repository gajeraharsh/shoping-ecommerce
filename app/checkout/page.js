'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      setRedirecting(true);
      router.push('/cart');
    } else if (!user) {
      setRedirecting(true);
      router.push('/auth/login?redirect=/checkout');
    }
  }, [cartItems, user, router]);

  const handlePlaceOrder = async (formData) => {
    setLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      const orderId = 'ORD' + Date.now();
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
      setLoading(false);
    }, 2000);
  };

  if (redirecting || cartItems.length === 0 || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handlePlaceOrder} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
