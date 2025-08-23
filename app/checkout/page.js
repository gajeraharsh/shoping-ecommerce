'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/hooks/useModal';
import { MODAL_TYPES } from '@/features/ui/modalTypes';
import SuccessModal from '@/components/ui/SuccessModal';
import Private from '@/components/auth/Private';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, items, status, ensure } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submittingState, setSubmittingState] = useState({ isSubmitting: false, visualSubmitting: false });
  const [redirecting, setRedirecting] = useState(false);
  // Only show the full-page skeleton on the first visit
  const [hasSeenCheckoutPage, setHasSeenCheckoutPage] = useState(false);
  const modal = useModal();

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('checkout_page_seen');
      if (seen === 'true') setHasSeenCheckoutPage(true);
    } catch {}
  }, []);

  useEffect(() => {
    // If not authenticated, Private will handle redirect to login.
    // Ensure cart exists before making any redirect decision.
    if ((status === 'idle' || !cart?.id) && typeof ensure === 'function') {
      ensure();
      return;
    }
    if (status === 'succeeded') {
      // Mark page as seen to avoid full-page skeleton on subsequent short loads
      if (!hasSeenCheckoutPage) {
        try { sessionStorage.setItem('checkout_page_seen', 'true'); } catch {}
        setHasSeenCheckoutPage(true);
      }
      if (items.length === 0) {
        setRedirecting(true);
        router.push('/cart');
      }
    }
  }, [items.length, router, status, ensure, cart?.id, hasSeenCheckoutPage]);

  const handlePlaceOrder = async (formData) => {
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      const orderId = 'ORD' + Date.now();
      clearCart();
      // Open branded success modal instead of immediate redirect
      modal.open({
        type: MODAL_TYPES.CUSTOM,
        props: {
          Component: SuccessModal,
          title: 'Success',
          message: 'Order placed successfully (demo)',
          orderId,
          onViewOrder: () => {
            modal.close();
            router.push(`/order-confirmation?orderId=${orderId}`);
          },
          onContinue: () => {
            modal.close();
            router.push('/products');
          },
          onClose: () => {
            modal.close();
          },
        },
      });
      setLoading(false);
    }, 2000);
  };

  // Only show full-page skeleton before the page has been seen once, or when redirecting
  if ((status === 'idle' || (!hasSeenCheckoutPage && status === 'loading')) || redirecting) {
    return (
      <Private>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-5xl">
            <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
              </div>
              <div className="lg:col-span-1">
                <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Private>
    );
  }

  return (
    <Private>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-x-hidden">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm onSubmit={handlePlaceOrder} loading={loading} onSubmittingChange={setSubmittingState} />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary />
              {/* Mobile-only Place Order button, after Order Summary */}
              <button
                type="submit"
                form="checkout-form"
                disabled={submittingState.isSubmitting}
                className="mt-4 w-full bg-black text-white py-4 px-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl lg:hidden"
              >
                <span className="inline-flex justify-center min-w-[140px]">
                  {submittingState.visualSubmitting ? 'Processing...' : 'Place Order'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </Private>
  );
}
