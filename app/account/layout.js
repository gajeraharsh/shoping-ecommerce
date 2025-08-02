'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AccountLayout({ children }) {
  const { user, logout, login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    const handleDemoLogin = () => {
      const demoUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210'
      };
      login(demoUser);
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="heading-md text-gray-900 dark:text-white mb-4">Account Access Required</h1>
            <p className="body-base text-fade">Please log in to access your account dashboard</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              className="btn-primary w-full"
            >
              Demo Login (For Testing)
            </button>

            <Link
              href="/auth/login"
              className="btn-secondary w-full text-center"
            >
              Go to Login Page
            </Link>

            <Link
              href="/"
              className="w-full text-gray-500 dark:text-gray-400 py-2 px-4 text-center block hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { 
      name: 'Profile', 
      href: '/account', 
      icon: User,
      description: 'Personal information and preferences'
    },
    { 
      name: 'Orders', 
      href: '/account/orders', 
      icon: Package,
      description: 'Track and manage your orders'
    },
    { 
      name: 'Order Tracking', 
      href: '/account/tracking', 
      icon: Truck,
      description: 'Real-time shipment tracking'
    },
    { 
      name: 'Addresses', 
      href: '/account/addresses', 
      icon: MapPin,
      description: 'Manage delivery addresses'
    },
    { 
      name: 'Wishlist', 
      href: '/account/wishlist', 
      icon: Heart,
      description: 'Your saved items'
    },
    {
      name: 'Returns',
      href: '/account/returns',
      icon: RotateCcw,
      description: 'Return and exchange requests'
    },
    {
      name: 'Settings',
      href: '/account/settings',
      icon: Settings,
      description: 'Account and security settings'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container-fluid section-padding-sm">
        {/* Mobile menu button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
          >
            <Menu className="h-5 w-5" />
            <span className="font-medium">Account Menu</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden sticky top-24">
              {/* User Profile Section */}
              <div className="bg-black dark:bg-white text-white dark:text-black p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-white/70 dark:text-black/70">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-white/70 dark:text-black/70">Active Member</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 mb-2 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-sm ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeSidebar} />
              <div className="relative flex flex-col w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="bg-black dark:bg-white text-white dark:text-black p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Account Menu</h2>
                    <button
                      onClick={closeSidebar}
                      className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-white/70 dark:text-black/70 text-sm">{user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className={`text-sm ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
