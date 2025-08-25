'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  RotateCcw,
  Truck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  CreditCard,
  Gift,
  Home
} from 'lucide-react';
import Link from 'next/link';

export default function AccountLayout({ children }) {
  const { user, logout, login, isAuthenticated, isInitializing, tokenPresent } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const safeName = typeof user?.name === 'string' ? user.name : ''
  const safeEmail = typeof user?.email === 'string' ? user.email : ''
  const userInitial = safeName && safeName.charAt ? safeName.charAt(0).toUpperCase() : (safeEmail && safeEmail.charAt ? safeEmail.charAt(0).toUpperCase() : 'U')

  // Redirect unauthenticated users once initialization completes.
  // IMPORTANT: If a token is present, do NOT redirect; allow hydration to complete.
  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !tokenPresent) {
      router.push('/auth/login');
    }
  }, [isInitializing, isAuthenticated, tokenPresent, router]);

  // While initializing OR (token exists but user profile not yet hydrated), show a minimal loading state
  if (isInitializing || (tokenPresent && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white animate-spin" />
          <span className="text-sm">Loading your account…</span>
        </div>
      </div>
    );
  }

  // If not authenticated (post-redirect), render nothing
  if (!isAuthenticated) return null;

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/account', 
      icon: Home,
      description: 'Overview & quick actions',
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      name: 'My Orders', 
      href: '/account/orders', 
      icon: Package,
      description: 'Track your purchases',
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      name: 'Order Tracking', 
      href: '/account/tracking', 
      icon: Truck,
      description: 'Real-time delivery updates',
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      name: 'Addresses', 
      href: '/account/addresses', 
      icon: MapPin,
      description: 'Delivery locations',
      color: 'text-purple-600 dark:text-purple-400'
    },
    { 
      name: 'Wishlist', 
      href: '/account/wishlist', 
      icon: Heart,
      description: 'Saved items',
      color: 'text-red-600 dark:text-red-400'
    },
    // {
    //   name: 'Payments',
    //   href: '/account/payments',
    //   icon: CreditCard,
    //   description: 'Payment methods',
    //   color: 'text-indigo-600 dark:text-indigo-400'
    // },
    // {
    //   name: 'Returns',
    //   href: '/account/returns',
    //   icon: RotateCcw,
    //   description: 'Return requests',
    //   color: 'text-amber-600 dark:text-amber-400'
    // },
    // {
    //   name: 'Notifications',
    //   href: '/account/notifications',
    //   icon: Bell,
    //   description: 'Alerts & updates',
    //   color: 'text-teal-600 dark:text-teal-400'
    // },
    {
      name: 'Settings',
      href: '/account/settings',
      icon: Settings,
      description: 'Account preferences',
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Account</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">
                {userInitial}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{safeName || 'Account User'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Member</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden sticky top-24 border border-gray-200 dark:border-gray-700">
              {/* User Profile Section */}
              <div className="bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 text-white dark:text-black p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                    {userInitial}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{safeName || 'Account User'}</h2>
                    <p className="text-white/70 dark:text-black/70 text-sm">{safeEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 dark:bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Premium Member</span>
                  <Gift className="w-4 h-4 ml-auto" />
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-6">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-lg border border-gray-200 dark:border-gray-600'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-1'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500 dark:text-gray-400 group-hover:' + item.color}`} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className={`text-xs ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>
                        {!isActive && <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Logout Button */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 font-semibold group"
                >
                  <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out"
                style={{
                  animation: sidebarOpen ? 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={closeSidebar} 
              />
              <div 
                className="relative flex flex-col w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out rounded-r-3xl"
                style={{
                  animation: sidebarOpen ? 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Mobile Header */}
                <div className="bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 text-white dark:text-black p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">My Account</h2>
                    <button
                      onClick={closeSidebar}
                      className="p-2 hover:bg-white/20 dark:hover:bg-black/20 rounded-xl transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center font-bold text-lg backdrop-blur-sm">
                      {userInitial}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{safeName || 'Account User'}</div>
                      <div className="text-white/70 dark:text-black/70 text-sm">{safeEmail}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">Premium Member</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeSidebar}
                          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-md'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-95'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500 dark:text-gray-400'}`} />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className={`text-xs ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.description}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Logout */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 font-semibold active:scale-95"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
