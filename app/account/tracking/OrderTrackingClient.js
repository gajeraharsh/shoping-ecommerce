'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Calendar, Navigation, ArrowLeft, Copy, Search } from 'lucide-react';

export default function OrderTrackingClient() {
  const searchParams = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState(searchParams.get('orderId') || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setRecentOrders([
      { id: 'ORD-2024-001', status: 'delivered', date: '2024-01-15' },
      { id: 'ORD-2024-002', status: 'shipped', date: '2024-01-12' },
      { id: 'ORD-2024-003', status: 'processing', date: '2024-01-08' }
    ]);

    if (selectedOrderId) {
      fetchTrackingData(selectedOrderId);
    }
  }, [selectedOrderId]);

  const fetchTrackingData = async (orderId) => {
    setLoading(true);
    setTimeout(() => {
      const mockData = {
        orderId: orderId,
        status: 'shipped',
        estimatedDelivery: '2024-01-16',
        trackingNumber: 'TRK123456789',
        carrier: 'Express Delivery',
        courierPhone: '+91 98765 43210',
        courierName: 'Rajesh Kumar',
        currentLocation: 'Mumbai Distribution Center',
        deliveryAddress: { name: 'John Doe', street: '123 Main Street, Apartment 4B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 43210' },
        timeline: [
          { status: 'Order Confirmed', description: 'Your order has been confirmed and is being prepared', timestamp: '2024-01-12T10:00:00Z', completed: true, icon: CheckCircle },
          { status: 'Order Packed', description: 'Your items have been carefully packed and labeled', timestamp: '2024-01-12T14:30:00Z', completed: true, icon: Package },
          { status: 'Shipped', description: 'Your order is on its way to the delivery location', timestamp: '2024-01-13T09:15:00Z', completed: true, icon: Truck, isCurrent: true },
          { status: 'Out for Delivery', description: 'Your order is out for delivery and will arrive soon', timestamp: null, completed: false, icon: Navigation },
          { status: 'Delivered', description: 'Your order has been successfully delivered', timestamp: null, completed: false, icon: CheckCircle }
        ],
        items: [
          { name: 'Elegant Black Dress', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', price: 1299, quantity: 1 },
          { name: 'Designer Handbag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', price: 1200, quantity: 1 }
        ]
      };
      setTrackingData(mockData);
      setLoading(false);
    }, 1000);
  };

  const copyTrackingNumber = () => {
    if (trackingData?.trackingNumber) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/account" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your deliveries in real-time</p>
          </div>
        </div>

        {/* Order Search */}
        <div className="space-y-4">
          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter order ID (e.g., ORD-2024-001)"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base touch-manipulation min-h-[56px]"
              />
            </div>
            <button onClick={() => fetchTrackingData(selectedOrderId)} disabled={!selectedOrderId || loading} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter order ID (e.g., ORD-2024-001)"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full pl-12 pr-32 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm touch-manipulation"
              />
              <button onClick={() => fetchTrackingData(selectedOrderId)} disabled={!selectedOrderId || loading} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="relative">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recent Orders:</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                {recentOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors snap-start flex-shrink-0 min-w-max touch-manipulation min-h-[48px] ${
                      selectedOrderId === order.id
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                    }`}
                  >
                    {order.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{trackingData.orderId}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Expected: {formatDate(trackingData.estimatedDelivery)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {trackingData.items.length} items
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-5 00 dark:text-gray-400 mb-1">Tracking Number</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{trackingData.trackingNumber}</p>
                    </div>
                    <button onClick={copyTrackingNumber} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-8">
                {trackingData.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${event.isCurrent ? 'bg-green-100 border-green-500 text-green-600' : event.completed ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                      <event.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{event.status}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                      {event.timestamp && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Items in this order</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trackingData.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
