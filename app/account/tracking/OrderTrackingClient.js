'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Calendar, Navigation, ArrowLeft, Copy, Search } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { listMyOrders, retrieveMyOrder } from '@/services/order/orderService';

export default function OrderTrackingClient() {
  const searchParams = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState(searchParams.get('orderId') || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState('');

  // Load recent orders once (limit 3) for quick selection
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listMyOrders({ limit: 3, offset: 0 });
        if (!active) return;
        setRecentOrders((res?.orders || []).map(o => ({ id: o.id, status: o.status, date: o.date })));
      } catch (_) {
        // errors globally handled by api client toasts
      }
    })();
    return () => { active = false; };
  }, []);

  // Track when orderId is present initially via query
  useEffect(() => {
    if (!selectedOrderId) return;
    fetchTrackingData(selectedOrderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderId]);

  const fetchTrackingData = async (orderId) => {
    try {
      setError('');
      setLoading(true);
      const { order } = await retrieveMyOrder(orderId);
      // Map order detail to the UI shape expected by this component without changing design
      const timelineIcons = (label) => {
        const s = (label || '').toLowerCase();
        if (s.includes('ship')) return Truck;
        if (s.includes('deliver')) return CheckCircle;
        if (s.includes('payment')) return CheckCircle;
        return Package; // default for order placed/packed
      };
      const timeline = Array.isArray(order.timeline)
        ? order.timeline.map((t, idx) => {
            const dateObj = t?.date ? new Date(t.date) : null;
            const validTs = dateObj && !isNaN(dateObj.getTime()) ? dateObj.toISOString() : null;
            return {
              status: t.status,
              description: t.description,
              timestamp: validTs,
              completed: !!t.completed,
              icon: timelineIcons(t.status),
              isCurrent: !t.completed && idx === 0, // simple current marker when not completed
            };
          })
        : [];

      const mapped = {
        orderId: order.id,
        status: order.status,
        estimatedDelivery: order.deliveryDate || order.date,
        trackingNumber: order.trackingNumber || '',
        carrier: order.shippingProvider || '',
        courierPhone: '',
        courierName: '',
        currentLocation: '',
        deliveryAddress: {
          name: order.shippingAddress?.name || '—',
          street: order.shippingAddress?.address || '—',
          city: order.shippingAddress?.city || '—',
          state: order.shippingAddress?.state || '—',
          pincode: order.shippingAddress?.pincode || '—',
          phone: order.shippingAddress?.phone || '—',
        },
        timeline,
        items: Array.isArray(order.items) ? order.items.map(i => ({
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })) : [],
      };
      setTrackingData(mapped);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to fetch tracking');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingNumber = () => {
    if (trackingData?.trackingNumber) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString('en-IN');
  };

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
                placeholder="Enter order ID"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base touch-manipulation min-h-[56px]"
              />
            </div>
            <button onClick={() => fetchTrackingData(selectedOrderId)} disabled={!selectedOrderId || loading} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter order ID"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full pl-12 pr-32 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm touch-manipulation"
              />
              <button onClick={() => fetchTrackingData(selectedOrderId)} disabled={!selectedOrderId || loading} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
            {error && (
              <div className="mt-2 text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
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
                {trackingData.trackingNumber ? (
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
                ) : null}
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
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                    <SmartImage src={item.image} alt={item.name} className="object-cover" />
                  </div>
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
