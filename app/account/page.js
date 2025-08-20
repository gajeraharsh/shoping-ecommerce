'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Link from 'next/link';
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Truck,
  ShoppingBag,
  User,
  Edit,
  ChevronRight,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import Private from '@/components/auth/Private';

export default function AccountDashboard() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalSpent: 45890,
    savedAmount: 8950,
    loyaltyPoints: 2450
  });

  useEffect(() => {
    // Mock recent orders
    setRecentOrders([
      {
        id: 'ORD-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 2499,
        items: 2,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
      },
      {
        id: 'ORD-2024-002', 
        date: '2024-01-12',
        status: 'shipped',
        total: 1899,
        items: 1,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
      },
      {
        id: 'ORD-2024-003',
        date: '2024-01-08',
        status: 'processing',
        total: 3299,
        items: 3,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Track Orders',
      description: 'Monitor your deliveries',
      icon: Truck,
      href: '/account/tracking',
      color: 'bg-blue-500',
      count: 3
    },
    {
      title: 'My Wishlist',
      description: 'Saved items',
      icon: Heart,
      href: '/account/wishlist',
      color: 'bg-red-500',
      count: wishlistItems.length
    },
    {
      title: 'Addresses',
      description: 'Manage locations',
      icon: MapPin,
      href: '/account/addresses',
      color: 'bg-green-500',
      count: 2
    },
    {
      title: 'Payment Methods',
      description: 'Cards & wallets',
      icon: CreditCard,
      href: '/account/payments',
      color: 'bg-purple-500',
      count: 3
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Private>
      <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 text-white dark:text-black rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-white/70 dark:text-black/70 text-sm sm:text-base">
                Ready for your next shopping adventure?
              </p>
            </div>
          </div>
          <Link
            href="/account/settings"
            className="flex items-center gap-2 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 px-4 py-2 rounded-xl transition-colors backdrop-blur-sm"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+12% this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalSpent.toLocaleString()}</div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
          <div className="flex items-center gap-1 mt-2">
            <Award className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">VIP Member</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.savedAmount.toLocaleString()}</div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
          <div className="flex items-center gap-1 mt-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Smart shopper!</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.loyaltyPoints.toLocaleString()}</div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
          <div className="flex items-center gap-1 mt-2">
            <Gift className="w-3 h-3 text-pink-500" />
            <span className="text-xs text-pink-600 dark:text-pink-400 font-medium">₹245 value</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{action.description}</p>
                
                {action.count > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {action.count}
                  </div>
                )}
                
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block p-4 sm:p-6 lg:p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group touch-manipulation"
            >
              {/* Mobile Layout */}
              <div className="flex items-start gap-4 sm:hidden">
                <img
                  src={order.image}
                  alt="Order"
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{order.id}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {order.items} items
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white text-lg">₹{order.total.toLocaleString()}</div>
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-6">
                <img
                  src={order.image}
                  alt="Order"
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.id}</h3>
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white text-xl">₹{order.total.toLocaleString()}</div>
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {recentOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        )}
      </div>
      </div>
    </Private>
  );
}
