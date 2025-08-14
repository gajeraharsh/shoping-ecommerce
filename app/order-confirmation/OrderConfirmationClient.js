'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails] = useState({
    id: orderId,
    total: 2499,
    items: 3,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    trackingNumber: 'TRK' + Date.now()
  });

  useEffect(() => {
    // Optionally add confetti/celebration effects here
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 px-4">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-sm sm:text-base text-gray-600">Thank you for your purchase. Your order has been received.</p>
          </div>

          <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{orderDetails.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium">{orderDetails.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">{orderDetails.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number:</span>
                <span className="font-medium">{orderDetails.trackingNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">View Order Details</Link>
            <Link href="/products" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
