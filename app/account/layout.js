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
  CreditCard,
  Bell,
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
    // Demo login for testing
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Access Required</h1>
            <p className="text-gray-600">Please log in to access your account dashboard</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Demo Login (For Testing)
            </button>

            <Link
              href="/auth/login"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block"
            >
              Go to Login Page
            </Link>

            <Link
              href="/"
              className="w-full text-gray-500 py-2 px-4 text-center block hover:text-gray-700 transition-colors"
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
      name: 'Payment Methods', 
      href: '/account/payments', 
      icon: CreditCard,
      description: 'Saved cards and payment options'
    },
    { 
      name: 'Notifications', 
      href: '/account/notifications', 
      icon: Bell,
      description: 'Email and SMS preferences'
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile menu button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Menu className="h-5 w-5" />
            <span className="font-medium">Account Menu</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* User Profile Section */}
              <div className="bg-gradient-to-r from-primary via-pink-500 to-purple-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-pink-100 text-sm">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-pink-100">Active Member</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-pink-50 text-pink-700 shadow-sm border border-pink-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className={`text-xs ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="relative flex flex-col w-80 bg-white shadow-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary via-pink-500 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Account Menu</h2>
                    <button
                      onClick={closeSidebar}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold backdrop-blur-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-pink-100 text-sm">{user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                          isActive
                            ? 'bg-pink-50 text-pink-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
