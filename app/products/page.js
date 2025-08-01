'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProducts, setActiveFilters, clearFilters } from '@/store/slices/productsSlice';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { allProducts, loading, error, pagination, activeFilters } = useAppSelector((state) => ({
    allProducts: state.products.allProducts,
    loading: state.products.loading.products,
    error: state.products.error.products,
    pagination: state.products.pagination,
    activeFilters: state.products.activeFilters,
  }));

  const [localFilters, setLocalFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    color: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Update Redux store when local filters change
    const apiFilters = {
      ...localFilters,
      sort: localFilters.sortBy,
    };
    
    // Remove empty filters
    Object.keys(apiFilters).forEach(key => {
      if (!apiFilters[key]) {
        delete apiFilters[key];
      }
    });
    
    dispatch(setActiveFilters(apiFilters));
    
    // Fetch products with new filters
    dispatch(fetchProducts(apiFilters));
  }, [dispatch, localFilters]);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: '',
      priceRange: '',
      size: '',
      color: '',
      sortBy: 'newest'
    });
    dispatch(clearFilters());
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64">
              <div className="animate-shimmer h-96 rounded-lg"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">All Products</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              Filters <ChevronDown className="h-4 w-4" />
            </button>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <ProductFilters filters={localFilters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters filters={localFilters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 px-1">
              Showing {allProducts.length} {pagination.totalItems ? `of ${pagination.totalItems}` : ''} products
            </div>

            {error ? (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Failed to load products</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                <button 
                  onClick={() => dispatch(fetchProducts())}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : allProducts.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your filters</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {allProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
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
