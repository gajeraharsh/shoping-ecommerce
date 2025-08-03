'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Package,
  Heart,
  Star,
  Gift,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Check,
  Clock,
  Calendar,
  Settings
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock notifications data
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          type: 'order',
          title: 'Order Delivered Successfully',
          message: 'Your order ORD-2024-001 has been delivered to your address.',
          timestamp: '2024-01-15T14:30:00Z',
          read: false,
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
        },
        {
          id: 2,
          type: 'promotion',
          title: 'Special Offer - 30% Off',
          message: 'Limited time offer on all summer collection. Use code SUMMER30.',
          timestamp: '2024-01-15T10:00:00Z',
          read: false,
          icon: Gift,
          color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
        },
        {
          id: 3,
          type: 'shipping',
          title: 'Order Shipped',
          message: 'Your order ORD-2024-002 is on its way. Track your package.',
          timestamp: '2024-01-14T16:45:00Z',
          read: true,
          icon: Truck,
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
        },
        {
          id: 4,
          type: 'wishlist',
          title: 'Price Drop Alert',
          message: 'The item in your wishlist "Designer Bag" is now 25% off!',
          timestamp: '2024-01-14T09:15:00Z',
          read: true,
          icon: Heart,
          color: 'text-red-600 bg-red-100 dark:bg-red-900/30'
        },
        {
          id: 5,
          type: 'review',
          title: 'Review Reminder',
          message: 'How was your recent purchase? Share your experience.',
          timestamp: '2024-01-13T11:30:00Z',
          read: true,
          icon: Star,
          color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
        },
        {
          id: 6,
          type: 'payment',
          title: 'Payment Successful',
          message: 'Payment of ₹2,499 has been processed successfully.',
          timestamp: '2024-01-12T18:20:00Z',
          read: true,
          icon: CreditCard,
          color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30'
        },
        {
          id: 7,
          type: 'system',
          title: 'Security Alert',
          message: 'New login detected from a different device.',
          timestamp: '2024-01-10T22:45:00Z',
          read: true,
          icon: AlertCircle,
          color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
        }
      ];
      
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Filter by type
    if (filter !== 'all') {
      if (filter === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = filtered.filter(n => n.type === filter);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter, searchQuery]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { value: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { value: 'promotion', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length },
    { value: 'shipping', label: 'Shipping', count: notifications.filter(n => n.type === 'shipping').length }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
            <Link
              href="/account/settings"
              className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm touch-manipulation"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all ${
                  filter === option.value
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{option.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === option.value 
                    ? 'bg-white/20 dark:bg-black/20' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || filter !== 'all' ? 'No notifications found' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'We\'ll notify you when something important happens'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl ${
                  notification.read 
                    ? 'border-gray-200 dark:border-gray-700' 
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className={`font-semibold text-lg ${
                        notification.read 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />
                        )}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Mark as read
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      
                      {(notification.type === 'order' || notification.type === 'shipping') && (
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
                        >
                          <Package className="w-4 h-4" />
                          View Order
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Summary</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {notifications.filter(n => n.type === 'order').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {notifications.filter(n => n.type === 'promotion').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Offers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
