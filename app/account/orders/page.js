'use client';

import { useState, useEffect, useRef } from 'react';
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
import { listMyOrders } from '@/services/order/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const didInit = useRef(false);
  const searchingRef = useRef(false);
  const currentQueryRef = useRef({}); // e.g., { id: 'order_...' } when server-side searching
  const requestIdRef = useRef(0);

  async function fetchOrders(reset = false, extraQuery = {}) {
    try {
      setError('');
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const res = await listMyOrders({
        limit,
        offset: reset ? 0 : offset,
        ...currentQueryRef.current,
        ...extraQuery,
      });
      const newOrders = res.orders || [];
      setHasMore((reset ? newOrders.length : orders.length + newOrders.length) < (res.count ?? Infinity));
      setOrders(reset ? newOrders : [...orders, ...newOrders]);
      setFilteredOrders(reset ? newOrders : [...orders, ...newOrders]);
      setOffset(reset ? newOrders.length : offset + newOrders.length);
    } catch (e) {
      // errors globally toasted by apiClient
      setError(e?.response?.data?.message || e.message || 'Failed to load orders');
      // prevent sentinel from hammering when there is an error
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchOrders(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search: server-side when it looks like an order id; otherwise client-side filter
  useEffect(() => {
    const qRaw = searchQuery.trim();
    const isIdQuery = /^order_/i.test(qRaw) || qRaw.length > 8; // heuristic for order id

    // Always apply status filter first on the baseline list we hold
    const applyStatusFilter = (list) => {
      if (statusFilter === 'all') return list;
      return list.filter(order => (order.status || '').toLowerCase() === statusFilter);
    };

    if (!qRaw) {
      // Clear server-side query and restore default pagination
      currentQueryRef.current = {};
      searchingRef.current = false;
      setHasMore(true);
      setFilteredOrders(applyStatusFilter(orders));
      // Ensure base list is refreshed to default if we had been in a filtered mode
      // Only refetch if we previously had a server query
      // eslint-disable-next-line no-unused-expressions
      // (If you want an immediate fresh list, uncomment the line below)
      // fetchOrders(true);
      return;
    }

    if (!isIdQuery) {
      // Client-side search on current orders; disable infinite scroll while searching
      searchingRef.current = false;
      const q = qRaw.toLowerCase();
      const filtered = applyStatusFilter(orders).filter(order =>
        (order.id || '').toLowerCase().includes(q) ||
        (order.items_detail || []).some(item => (item.name || '').toLowerCase().includes(q))
      );
      setFilteredOrders(filtered);
      setHasMore(false);
      return;
    }

    // Server-side ID search (debounced)
    const rid = ++requestIdRef.current;
    searchingRef.current = true;
    setError('');
    const timer = setTimeout(async () => {
      try {
        currentQueryRef.current = { id: qRaw };
        // Reset pagination and fetch server-filtered
        const res = await listMyOrders({ limit, offset: 0, ...currentQueryRef.current });
        if (requestIdRef.current !== rid) return; // ignore stale
        const base = res.orders || [];
        setOrders(base);
        const filtered = applyStatusFilter(base);
        setFilteredOrders(filtered);
        setOffset(base.length);
        setHasMore(base.length < (res.count ?? base.length));
      } catch (e) {
        if (requestIdRef.current !== rid) return;
        setError(e?.response?.data?.message || e.message || 'Search failed');
        setHasMore(false);
      } finally {
        if (requestIdRef.current === rid) searchingRef.current = false;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

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
              onClick={() => fetchOrders(true)}
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
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => fetchOrders(true)} className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
          </div>
        )}
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

                  {order.status === 'shipped' && (
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
        {/* Infinite loader skeletons */}
        {hasMore && !loading && !searchingRef.current && (
          <div className="space-y-3">
            {(loadingMore ? [1,2,3] : [1]).map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}
        {/* Observer sentinel */}
        <Sentinel
          hasMore={hasMore && !searchingRef.current}
          loading={loading || loadingMore}
          onVisible={() => !loading && !loadingMore && hasMore && !searchingRef.current && fetchOrders(false)}
        />
      </div>
    </div>
  );
}

function Sentinel({ hasMore, loading, onVisible }) {
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasMore || loading) return;

    // Disconnect any old observer before creating a new one
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Disconnect immediately to avoid multiple rapid triggers
        observer.disconnect();
        onVisible?.();
      }
    }, { rootMargin: '200px 0px' });

    observer.observe(el);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, loading, onVisible]);

  return <div ref={ref} className="h-1" aria-hidden />;
}
