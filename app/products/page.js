'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { mockProducts } from '@/utils/mockData';
import { ChevronDown, Grid3X3, List, SlidersHorizontal } from 'lucide-react';

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
        <div className="container-fluid section-padding-sm">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64">
              <div className="skeleton h-96 rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container-fluid">
          <div className="text-center">
            <h1 className="heading-xl mb-4">Our Collections</h1>
            <p className="body-lg text-fade max-w-2xl mx-auto">
              Discover our carefully curated selection of premium fashion pieces, 
              crafted for the modern woman who values quality and style.
            </p>
          </div>
        </div>
      </section>

      <div className="container-fluid py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            
            <div className="hidden sm:flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full p-1">
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
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
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
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="heading-sm mb-2">No products found</h3>
                <p className="text-fade">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => setFilters({ category: '', priceRange: '', size: '', color: '', sortBy: 'newest' })}
                  className="btn-outline mt-6"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
