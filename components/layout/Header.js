'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const router = useRouter();
  const profileDropdownRef = useRef(null);

  const cartCount = getCartItemsCount();
  const wishlistCount = wishlistItems.length;

  // Handle click outside for profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileDropdownOpen]);

  const handleSearch = (searchTerm) => {
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kurtis', href: '/products?category=kurtis' },
    { name: 'Dresses', href: '/products?category=dresses' },
    { name: 'Ethnic', href: '/products?category=ethnic' }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 transition-colors w-full">
      <div className="mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-lg">
              F
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">Fashionista</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => setShowAdvancedSearch(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer text-sm"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Mobile Search */}
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <div className="hidden sm:block">
            <DarkModeToggle />
          </div>

            {/* User Account */}
            <div className="relative hidden sm:block" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              <div className={`absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg transition-all duration-200 z-50 ${
                isProfileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-primary flex items-center justify-center"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleSearch}
      />
    </header>
  );
}
