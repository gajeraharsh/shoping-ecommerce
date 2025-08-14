'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const { getCartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  const cartCount = getCartItemsCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    // Show on initial load
    setIsVisible(true);
    timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const navigationItems = [
    {
      icon: Search,
      label: 'Search',
      href: '/products',
      count: null
    },
    {
      icon: Heart,
      label: 'Wishlist',
      href: '/wishlist',
      count: wishlistCount
    },
    {
      icon: ShoppingBag,
      label: 'Cart',
      href: '/cart',
      count: cartCount
    },
    {
      icon: User,
      label: user ? 'Account' : 'Login',
      href: user ? '/account' : '/auth/login',
      count: null
    }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Always visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 py-1 safe-area-bottom">
        <div className="flex items-center justify-around">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg active:bg-gray-100 dark:active:bg-gray-800 transition-colors touch-manipulation"
              >
                <div className="relative">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                      {item.count > 9 ? '9+' : item.count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button - Shows/hides on scroll */}
      <div 
        className={`md:hidden fixed bottom-20 right-4 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow active:scale-95">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16 safe-area-bottom"></div>
    </>
  );
}

export function MobileSearchBar({ onSearch, placeholder = "Search products..." }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent touch-manipulation"
        />
      </form>
    </div>
  );
}
