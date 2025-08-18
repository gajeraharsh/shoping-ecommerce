'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import { getMe as apiGetMe } from '@/services/modules/customer/customerService';

import { BRAND } from '@/lib/brand';
import { CATEGORY_TREE } from '@/lib/categories';
import { useSelector } from 'react-redux';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { getItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const profileDropdownRef = useRef(null);
  const categoriesRef = useRef(null);
  const panelRef = useRef(null);
  const hoverBridgeRef = useRef(null);

  const cartCount = getItemsCount();
  const [wishlistApiCount, setWishlistApiCount] = useState(null);
  const wishlistCount = (isAuthenticated && typeof wishlistApiCount === 'number')
    ? wishlistApiCount
    : wishlistItems.length;

  // Fetch wishlist_count from backend when authenticated
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setWishlistApiCount(null);
      return;
    }
    (async () => {
      try {
        const data = await apiGetMe();
        const count = Number(data?.wishlist_count ?? data?.customer?.wishlist_count);
        if (active) setWishlistApiCount(Number.isFinite(count) ? count : 0);
      } catch (_) {
        if (active) setWishlistApiCount(null);
      }
    })();
    return () => { active = false; };
  }, [isAuthenticated, wishlistItems.length]);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isMenuOpen]);

  // Detect scroll to apply compact header styling
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle escape key for mobile menu
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isMenuOpen]);

  const handleSearch = (searchTerm) => {
    router.push(`/products?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const navigation = [
    { name: 'Collections', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sale', href: '/products?sale=true' },
    { name: 'About', href: '/about' }
  ];

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCategoriesPinned, setIsCategoriesPinned] = useState(false); // kept for compatibility but no longer used to pin
  const closeTimer = useRef(null);
  const [categoriesTop, setCategoriesTop] = useState(0);
  const [categoriesRight, setCategoriesRight] = useState(0);
  const categoryTree = useSelector((state) => state.category?.items || []);

  const updateCategoriesTop = () => {
    const el = categoriesRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Use viewport coordinates for fixed-positioned dropdown
    setCategoriesTop(rect.bottom);
    setCategoriesRight(rect.right);
  };

  // Close categories on outside click or Escape (must be after state declarations)
  useEffect(() => {
    function handleDocClick(e) {
      if (!isCategoriesOpen) return;
      const target = e.target;
      // Treat clicks on the hover bridge as outside to allow closing
      if (hoverBridgeRef.current && hoverBridgeRef.current.contains(target)) {
        setIsCategoriesPinned(false);
        setIsCategoriesOpen(false);
        return;
      }
      // Only keep open for clicks inside the panel itself
      if (panelRef.current?.contains(target)) return;
      setIsCategoriesPinned(false);
      setIsCategoriesOpen(false);
    }
    function handleEsc(e) {
      if (e.key === 'Escape' && isCategoriesOpen) {
        setIsCategoriesPinned(false);
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isCategoriesOpen]);

  const openCategories = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    updateCategoriesTop();
    setIsCategoriesOpen(true);
  };

  const scheduleCloseCategories = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 300);
  };

  const handleMouseLeave = (e) => {
    const next = e.relatedTarget;
    if (!next) return scheduleCloseCategories();
    if (
      categoriesRef.current?.contains(next) ||
      panelRef.current?.contains(next)
    ) {
      // moving within menu; keep open
      return;
    }
    scheduleCloseCategories();
  };

  const handleMouseEnter = () => openCategories();
  const [mobileCatOpen, setMobileCatOpen] = useState({ top: null, sub: null });

  // Keep dropdown aligned on scroll/resize while open
  useEffect(() => {
    if (!isCategoriesOpen) return;
    const handler = () => updateCategoriesTop();
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [isCategoriesOpen]);

  // Categories are now preloaded at app init via Providers->InitBoot dispatching fetchCategoryTree

  return (
    <header
      className={`sticky top-0 z-50 safe-area-top relative transition-all duration-300
        ${isScrolled ? 'bg-white dark:bg-gray-900 border-b border-gray-200/60 dark:border-gray-800/60 shadow-lg shadow-black/5' : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'}
      `}
    >
      {/* Top Bar */}
      <div className={`hidden lg:block transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'} border-b border-gray-50 dark:border-gray-800`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              <span>Secure Shopping</span>
            </div>
            <span>•</span>
            <span>Free shipping on orders over ₹2,999</span>
            <span>•</span>
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>🇮🇳 English</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0 group">
            <div className="relative">
              <div className={`bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 text-white dark:text-black rounded-xl font-bold tracking-tight shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105
                ${isScrolled ? 'px-2.5 py-1.5 text-base sm:text-base md:text-lg' : 'px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-base sm:text-lg md:text-xl'}
              `}>
                M
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors
                ${isScrolled ? 'text-sm sm:text-base md:text-lg' : 'text-sm sm:text-base md:text-lg lg:text-xl'}
              `}>
                {BRAND.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center space-x-8 ml-12 transition-all duration-300`}>
            {/* Categories Trigger */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={categoriesRef}
            >
              <button
                className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold tracking-tight hover:opacity-90"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCategoriesOpen((prev) => !prev);
                }}
                aria-expanded={isCategoriesOpen}
              >
                Categories <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <>
                  {/* Hover bridge to prevent flicker when moving from trigger to panel */}
                  <div
                    className="fixed w-[90vw] max-w-2xl h-6 z-[70]"
                    style={{ top: categoriesTop - 1, left: categoriesRight }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => { setIsCategoriesPinned(false); setIsCategoriesOpen(false); }}
                    ref={hoverBridgeRef}
                  />
                  {/* Right-aligned horizontal dropdown panel */}
                  <div
                    className={`fixed bg-white dark:bg-gray-900
                      border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 z-[200] max-h-[70vh] overflow-y-auto w-[90vw] max-w-2xl`}
                    style={{ top: categoriesTop, left: categoriesRight }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={panelRef}
                  >
                  {(categoryTree.length ? categoryTree : CATEGORY_TREE).map((top, idx) => (
                    <div key={top.slug} className={`min-w-0 px-2 ${idx !== 0 ? 'lg:border-l border-gray-100 dark:border-gray-800' : ''}`}>
                      <Link href={`/products?category=${top.slug}`} className="block text-base font-semibold text-gray-900 dark:text-white mb-4 hover:text-black dark:hover:text-white" onClick={() => { setIsCategoriesPinned(false); setIsCategoriesOpen(false); }}>
                        {top.name}
                      </Link>
                      <div className="space-y-5">
                        {top.children?.map((sub) => (
                          <div key={sub.slug}>
                            <Link href={`/products?category=${top.slug}&sub=${sub.slug}`} className="block text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => { setIsCategoriesPinned(false); setIsCategoriesOpen(false); }}>
                              {sub.name}
                            </Link>
                            <div className="flex flex-wrap gap-2.5">
                              {sub.children?.map((leaf) => (
                                <Link
                                  key={leaf.slug}
                                  href={`/products?category=${top.slug}&sub=${sub.slug}&type=${leaf.slug}`}
                                  className="text-[13px] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
                                  onClick={() => { setIsCategoriesPinned(false); setIsCategoriesOpen(false); }}
                                >
                                  {leaf.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium tracking-tight relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className={`hidden lg:flex items-center flex-1 mx-8 transition-all duration-300 ${isScrolled ? 'max-w-sm' : 'max-w-md'}`}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => setShowAdvancedSearch(true)}
                className={`w-full pl-12 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all duration-300 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                  ${isScrolled ? 'py-2.5 border-gray-200/70' : 'py-3 border-gray-200'}
                `}
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Mobile Search */}
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className={`lg:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full touch-manipulation flex items-center justify-center
                ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-gray-800'}
              `}
              style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}
            >
              <Search className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} />
            </button>

            {/* Wishlist */}
            <Link href="/account/wishlist" className={`relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full touch-manipulation flex items-center justify-center ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-gray-800'}`} style={{ margin: 0, padding: 0, textDecoration: 'none' }}>
              <Heart className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium text-[10px] sm:text-[11px] min-w-[20px] min-h-[20px]">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className={`relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full touch-manipulation flex items-center justify-center ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-gray-800'}`} style={{ margin: 0, padding: 0, textDecoration: 'none' }}>
              <ShoppingBag className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium text-[10px] sm:text-[11px] min-w-[20px] min-h-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full touch-manipulation flex items-center justify-center ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}
              >
                <User className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} />
              </button>
              <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg transition-all duration-200 z-50 ${
                isProfileDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}>
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Account'}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Order History
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Wishlist
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-200 rounded-full touch-manipulation flex items-center justify-center hover:scale-105 active:scale-95 ${isScrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ?
                <X className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} /> :
                <Menu className="h-5 w-5" style={{ margin: 0, padding: 0, display: 'block' }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-out translate-x-0 animate-in slide-in-from-right-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 text-white dark:text-black px-3 py-2 rounded-xl font-bold text-lg tracking-tight">
                    M
                  </div>
                  <span id="mobile-menu-title" className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {BRAND.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center hover:scale-105 active:scale-95"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Categories (Mobile Accordion) */}
                <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Shop by Category</h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {CATEGORY_TREE.map((top, i) => (
                      <div key={top.slug} className="py-2">
                        <button
                          className="w-full flex items-center justify-between py-2 text-gray-700 dark:text-gray-300"
                          onClick={() => setMobileCatOpen((prev) => ({ top: prev.top === i ? null : i, sub: null }))}
                          aria-expanded={mobileCatOpen.top === i}
                        >
                          <span className="font-medium">{top.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen.top === i ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileCatOpen.top === i && (
                          <div className="pl-3">
                            {top.children?.map((sub) => (
                              <div key={sub.slug} className="py-1">
                                <button
                                  className="w-full flex items-center justify-between py-2 text-sm text-gray-600 dark:text-gray-400"
                                  onClick={() => setMobileCatOpen((prev) => ({ ...prev, sub: prev.sub === sub.slug ? null : sub.slug }))}
                                  aria-expanded={mobileCatOpen.sub === sub.slug}
                                >
                                  <span className="uppercase tracking-wide">{sub.name}</span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen.sub === sub.slug ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileCatOpen.sub === sub.slug && (
                                  <div className="pl-3 pb-2 flex flex-wrap gap-2">
                                    {sub.children?.map((leaf) => (
                                      <Link
                                        key={leaf.slug}
                                        href={`/products?category=${top.slug}&sub=${sub.slug}&type=${leaf.slug}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-1"
                                      >
                                        {leaf.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                <nav id="mobile-navigation" className="flex-1 px-6 py-6" aria-label="Main navigation">
                  <div className="space-y-2">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation transform hover:scale-[0.98] ${
                          isMenuOpen ? 'animate-in slide-in-from-right-5 fade-in' : ''
                        }`}
                        style={{
                          animationDelay: `${(index + 1) * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 px-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link
                        href="/account/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                      >
                        <Heart className="h-5 w-5" />
                        <span>Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="ml-auto bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full font-medium">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* User Section */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    {user ? (
                      <>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {user.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back!</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/account"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                          >
                            <User className="h-5 w-5" />
                            <span>My Account</span>
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                          >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Order History</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/auth/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-base font-medium transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100"
                        >
                          <User className="h-5 w-5" />
                          Sign in
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-base font-medium transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Create account
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-base font-medium transition-all duration-200"
                    >
                      Sign out
                    </button>
                  )}
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      © 2024 {BRAND.name}. All rights reserved.
                    </p>
                  </div>
                </div>
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
