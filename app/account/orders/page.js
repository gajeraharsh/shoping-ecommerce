'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Star,
  Download,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  Eye,
  ArrowLeft
} from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 2499,
          items: 2,
          deliveryDate: '2024-01-18',
          address: 'Home - 123 Main Street, Mumbai',
          items_detail: [
            { name: 'Elegant Black Dress', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', price: 1299, quantity: 1 },
            { name: 'Designer Handbag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', price: 1200, quantity: 1 }
          ]
        },
        {
          id: 'ORD-2024-002', 
          date: '2024-01-12',
          status: 'shipped',
          total: 1899,
          items: 1,
          deliveryDate: '2024-01-16',
          address: 'Office - 456 Business Park, Delhi',
          items_detail: [
            { name: 'Casual Summer Top', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', price: 1899, quantity: 1 }
          ]
        },
        {
          id: 'ORD-2024-003',
          date: '2024-01-08',
          status: 'processing',
          total: 3299,
          items: 3,
          deliveryDate: '2024-01-20',
          address: 'Home - 123 Main Street, Mumbai',
          items_detail: [
            { name: 'Designer Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', price: 2299, quantity: 1 },
            { name: 'Cotton T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', price: 599, quantity: 1 },
            { name: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', price: 1299, quantity: 1 }
          ]
        },
        {
          id: 'ORD-2024-004',
          date: '2024-01-05',
          status: 'cancelled',
          total: 999,
          items: 1,
          deliveryDate: null,
          address: 'Home - 123 Main Street, Mumbai',
          items_detail: [
            { name: 'Sports Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', price: 999, quantity: 1 }
          ]
        },
        {
          id: 'ORD-2024-005',
          date: '2024-01-02',
          status: 'delivered',
          total: 1599,
          items: 2,
          deliveryDate: '2024-01-05',
          address: 'Home - 123 Main Street, Mumbai',
          items_detail: [
            { name: 'Winter Scarf', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400', price: 799, quantity: 1 },
            { name: 'Woolen Gloves', image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400', price: 800, quantity: 1 }
          ]
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items_detail.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'processing':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">Track and manage your purchases</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              onClick={() => setLoading(true)}
              className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base touch-manipulation min-h-[56px]"
            />
          </div>

          {/* Filter Tabs */}
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory -mx-2 px-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all snap-start flex-shrink-0 min-w-max touch-manipulation min-h-[48px] ${
                    statusFilter === status
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                  }`}
                >
                  <span className="capitalize">{status === 'all' ? 'All' : status}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    statusFilter === status
                      ? 'bg-white/25 dark:bg-black/25 text-white dark:text-black'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none sm:hidden" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start shopping to see your orders here'
              }
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.id}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                  </div>
                </div>

                {order.deliveryDate && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {order.status === 'delivered' 
                        ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}` 
                        : `Expected delivery: ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}`
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {order.items_detail.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 relative">
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          className="object-cover"
                        />
                      </div>
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>

                  {order.status === 'delivered' && (
                    <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Star className="w-4 h-4" />
                      Rate & Review
                    </button>
                  )}

                  {(order.status === 'shipped' || order.status === 'processing') && (
                    <Link
                      href={`/account/tracking?orderId=${order.id}`}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Track Order
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
