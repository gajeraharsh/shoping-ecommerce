'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { mockProducts } from '@/utils/mockData';
import { ChevronDown, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    color: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    if (filters.size) {
      filtered = filtered.filter(product => product.sizes.includes(filters.size));
    }

    if (filters.color) {
      filtered = filtered.filter(product => product.colors.includes(filters.color));
    }

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Our Collections</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium fashion pieces, 
              crafted for the modern woman who values quality and style.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px] text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors touch-manipulation ${viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors touch-manipulation ${viewMode === 'list' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm min-h-[44px] touch-manipulation"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50">
              {/* Backdrop with fade animation */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-elegant transition-all duration-300 ease-out"
                style={{
                  animation: showFilters ? 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => setShowFilters(false)}
              />

              {/* Drawer with slide animation */}
              <div
                className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-out transform"
                style={{
                  animation: showFilters ? 'slideInLeft 0.3s ease-out' : 'slideOutLeft 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with enhanced styling */}
                <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Filters</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Refine your search</p>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                    </button>
                  </div>
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                </div>

                {/* Scrollable content with enhanced padding */}
                <div className="overflow-y-auto h-[calc(100vh-120px)] bg-gray-50/30 dark:bg-gray-800/30">
                  <div className="p-6">
                    <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </div>

                {/* Apply button at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-98 touch-manipulation shadow-lg"
                  >
                    Apply Filters ({filteredProducts.length} items)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => setFilters({ category: '', priceRange: '', size: '', color: '', sortBy: 'newest' })}
                  className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
