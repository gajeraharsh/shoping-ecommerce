import { Suspense } from 'react';
import OrderTrackingClient from './OrderTrackingClient';

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading tracking...</div>}>
      <OrderTrackingClient />
    </Suspense>
  );
}
