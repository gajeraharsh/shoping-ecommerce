'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Download,
  RotateCcw,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Star
} from 'lucide-react';

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2499,
      items: [
        {
          id: 1,
          name: 'Floral Summer Dress',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=300',
          price: 1899,
          quantity: 1,
          size: 'M',
          color: 'Blue'
        },
        {
          id: 2,
          name: 'Cotton Casual Shirt',
          image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300',
          price: 600,
          quantity: 1,
          size: 'L',
          color: 'White'
        }
      ],
      deliveryDate: '2024-01-18',
      canReturn: true,
      canReview: true
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-12',
      status: 'shipped',
      total: 1899,
      items: [
        {
          id: 3,
          name: 'Designer Kurta Set',
          image: 'https://images.pexels.com/photos/8674628/pexels-photo-8674628.jpeg?auto=compress&cs=tinysrgb&w=300',
          price: 1899,
          quantity: 1,
          size: 'XL',
          color: 'Navy'
        }
      ],
      expectedDelivery: '2024-01-16',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-10',
      status: 'processing',
      total: 3299,
      items: [
        {
          id: 4,
          name: 'Premium Silk Saree',
          image: '/api/placeholder/100/100',
          price: 2999,
          quantity: 1,
          size: 'Free Size',
          color: 'Gold'
        },
        {
          id: 5,
          name: 'Matching Blouse',
          image: '/api/placeholder/100/100',
          price: 300,
          quantity: 1,
          size: 'M',
          color: 'Gold'
        }
      ],
      canCancel: true
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-08',
      status: 'cancelled',
      total: 1299,
      items: [
        {
          id: 6,
          name: 'Denim Jacket',
          image: '/api/placeholder/100/100',
          price: 1299,
          quantity: 1,
          size: 'S',
          color: 'Blue'
        }
      ],
      cancelledDate: '2024-01-09'
    }
  ];

  const statusConfig = {
    processing: {
      label: 'Processing',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-blue-100 text-blue-800',
      icon: Truck
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeFilter !== 'all' && order.status !== activeFilter) return false;
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.total - a.total;
    if (sortBy === 'amount-low') return a.total - b.total;
    return 0;
  });

  const getOrderStatusIcon = (status) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage all your fashion purchases</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === option.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === option.id ? 'bg-blue-200' : 'bg-gray-200'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          sortedOrders.map(order => {
            const currentStatusConfig = statusConfig[order.status] || statusConfig.processing;
            const StatusIcon = currentStatusConfig.icon;

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        Order #{order.id}
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {currentStatusConfig.label}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{order.total}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <div className="text-sm text-gray-500">
                            {item.size} | {item.color} | Qty: {item.quantity}
                          </div>
                          <div className="text-sm font-medium text-gray-900">₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>

                    {order.trackingNumber && (
                      <Link
                        href={`/account/tracking?order=${order.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Truck className="h-4 w-4" />
                        Track Order
                      </Link>
                    )}

                    {order.canReturn && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                        <RotateCcw className="h-4 w-4" />
                        Return
                      </button>
                    )}

                    {order.canReview && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        <Star className="h-4 w-4" />
                        Review
                      </button>
                    )}

                    {order.canCancel && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      <Download className="h-4 w-4" />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
