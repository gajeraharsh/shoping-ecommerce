'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import SmartImage from '@/components/ui/SmartImage';
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowLeft,
  Filter,
  Search,
  Grid3X3,
  List,
  Share2,
  Trash2,
  Plus,
  Minus,
  Eye,
  AlertCircle,
  TrendingDown,
  Tag,
  Clock
} from 'lucide-react';
import Private from '@/components/auth/Private';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // Client-side pagination (Load More)
  const PAGE_SIZE = 9; // items per batch
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let filtered = [...wishlistItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredItems(filtered);
    // Reset visible count whenever the filtered list changes
    setVisibleCount(PAGE_SIZE);
  }, [wishlistItems, searchQuery, sortBy]);

  const handleAddToCart = (item) => {
    addToCart(item, 'M', 'Black', 1);
    // Could show a toast notification here
  };

  const handleAddAllToCart = () => {
    selectedItems.forEach(item => {
      addToCart(item, 'M', 'Black', 1);
    });
    setSelectedItems([]);
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(p => p.id === item.id);
      if (isSelected) {
        return prev.filter(p => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredItems]);
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(item => {
      removeFromWishlist(item.id);
    });
    setSelectedItems([]);
  };

  const calculateTotalValue = () => {
    return wishlistItems.reduce((total, item) => total + item.price, 0);
  };

  if (wishlistItems.length === 0) {
    return (
      <Private>
        <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/account"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-gray-600 dark:text-gray-400">Your saved items</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding items you love to keep track of them
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
        </div>
      </Private>
    );
  }

  return (
    <Private>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} •
                ₹{calculateTotalValue().toLocaleString()} total value
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="p-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm touch-manipulation"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm min-h-[48px] touch-manipulation"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleRemoveSelected}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select All */}
      {filteredItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedItems.length === filteredItems.length
              ? 'bg-black dark:bg-white border-black dark:border-white'
              : 'border-gray-300 dark:border-gray-600'
              }`}>
              {selectedItems.length === filteredItems.length && (
                <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>
        </div>
      )}

      {/* Items Grid/List */}
      <div className={`${viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
        }`}>
        {filteredItems.slice(0, visibleCount).map((item) => {
          const isSelected = selectedItems.find(p => p.id === item.id);

          if (viewMode === 'list') {
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border transition-all duration-200 hover:shadow-2xl ${isSelected
                  ? 'border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleSelectItem(item)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                      ? 'bg-black dark:bg-white border-black dark:border-white'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 relative">
                      <SmartImage src={item.image} alt={item.name} className="object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating || 4.5}</span>
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${isSelected
                ? 'border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20'
                : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              <div className="relative">
                <button
                  onClick={() => handleSelectItem(item)}
                  className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors backdrop-blur-sm ${isSelected
                    ? 'bg-black dark:bg-white border-black dark:border-white'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600'
                    }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                </button>

                <Link href={`/products/${item.id}`}>
                  <div className="w-full h-64 relative overflow-hidden">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {item.originalPrice && item.originalPrice > item.price && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-6">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating || 4.5}</span>
                  </div>
                  {item.addedAt && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {visibleCount < filteredItems.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredItems.length))}
            className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Load more ({filteredItems.length - visibleCount} left)
          </button>
        </div>
      )}

      {filteredItems.length === 0 && searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search query
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
    </Private>
  );
}
