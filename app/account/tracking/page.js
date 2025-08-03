'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  ExternalLink,
  Copy,
  Calendar,
  Navigation,
  Star,
  MessageCircle,
  Search
} from 'lucide-react';

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState(searchParams.get('orderId') || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Mock recent orders for quick selection
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
    
    // Mock tracking data
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
        deliveryAddress: {
          name: 'John Doe',
          street: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 98765 43210'
        },
        timeline: [
          {
            status: 'Order Confirmed',
            description: 'Your order has been confirmed and is being prepared',
            timestamp: '2024-01-12T10:00:00Z',
            completed: true,
            icon: CheckCircle
          },
          {
            status: 'Order Packed',
            description: 'Your items have been carefully packed and labeled',
            timestamp: '2024-01-12T14:30:00Z',
            completed: true,
            icon: Package
          },
          {
            status: 'Shipped',
            description: 'Your order is on its way to the delivery location',
            timestamp: '2024-01-13T09:15:00Z',
            completed: true,
            icon: Truck,
            isCurrent: true
          },
          {
            status: 'Out for Delivery',
            description: 'Your order is out for delivery and will arrive soon',
            timestamp: null,
            completed: false,
            icon: Navigation
          },
          {
            status: 'Delivered',
            description: 'Your order has been successfully delivered',
            timestamp: null,
            completed: false,
            icon: CheckCircle
          }
        ],
        items: [
          {
            name: 'Elegant Black Dress',
            image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
            price: 1299,
            quantity: 1
          },
          {
            name: 'Designer Handbag',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
            price: 1200,
            quantity: 1
          }
        ]
      };
      
      setTrackingData(mockData);
      setLoading(false);
    }, 1000);
  };

  const copyTrackingNumber = () => {
    if (trackingData?.trackingNumber) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
      // You could add a toast notification here
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/account"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your deliveries in real-time</p>
          </div>
        </div>

        {/* Order Search */}
        <div className="space-y-4">
          {/* Mobile Layout */}
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
            <button
              onClick={() => fetchTrackingData(selectedOrderId)}
              disabled={!selectedOrderId || loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          {/* Desktop Layout */}
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
              <button
                onClick={() => fetchTrackingData(selectedOrderId)}
                disabled={!selectedOrderId || loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </div>

          {/* Quick Select Recent Orders */}
          {recentOrders.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recent Orders:</p>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedOrderId === order.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                    Expected: {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-IN')}
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tracking Number</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {trackingData.trackingNumber}
                      </p>
                    </div>
                    <button
                      onClick={copyTrackingNumber}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    Your order is on the way!
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                    Currently at: {trackingData.currentLocation}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Handled by {trackingData.carrier}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Tracking Timeline</h3>
            
            <div className="relative">
              {trackingData.timeline.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === trackingData.timeline.length - 1;
                
                return (
                  <div key={index} className="relative flex gap-6 pb-8">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className={`absolute left-6 top-12 w-0.5 h-full ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                    
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                      step.completed 
                        ? 'bg-green-500 border-green-200 dark:border-green-800' 
                        : step.isCurrent
                        ? 'bg-blue-500 border-blue-200 dark:border-blue-800 animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        step.completed || step.isCurrent ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-lg mb-2 ${
                        step.completed || step.isCurrent 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.status}
                        {step.isCurrent && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        step.completed || step.isCurrent 
                          ? 'text-gray-600 dark:text-gray-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(step.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delivery Address</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{trackingData.deliveryAddress.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trackingData.deliveryAddress.street}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trackingData.deliveryAddress.city}, {trackingData.deliveryAddress.state} - {trackingData.deliveryAddress.pincode}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {trackingData.deliveryAddress.phone}
                </div>
              </div>
            </div>

            {/* Courier Information */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delivery Partner</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{trackingData.courierName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trackingData.carrier}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {trackingData.courierPhone}
                </div>
                
                <div className="flex gap-2 pt-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Items in this Order</h3>
            
            <div className="space-y-4">
              {trackingData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!trackingData && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
          <Truck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Track</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your order ID above to start tracking your delivery
          </p>
        </div>
      )}
    </div>
  );
}
