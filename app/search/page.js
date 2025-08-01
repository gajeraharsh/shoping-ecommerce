'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { searchProducts, setSearchQuery } from '@/store/slices/productsSlice';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import SearchBar from '@/components/search/SearchBar';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { searchResults, searchQuery, loading, error, pagination } = useAppSelector((state) => ({
    searchResults: state.products.searchResults,
    searchQuery: state.products.searchQuery,
    loading: state.products.loading.search,
    error: state.products.error.search,
    pagination: state.products.pagination,
  }));

  const [sortBy, setSortBy] = useState('relevance');
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query && query !== searchQuery) {
      dispatch(setSearchQuery(query));
      dispatch(searchProducts({ 
        q: query, 
        sort: sortBy === 'relevance' ? undefined : sortBy,
        limit: 20 
      }));
    }
  }, [query, sortBy, dispatch, searchQuery]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (query) {
      dispatch(searchProducts({ 
        q: query, 
        sort: newSort === 'relevance' ? undefined : newSort,
        limit: 20 
      }));
    }
  };

  const handleRetry = () => {
    if (query) {
      dispatch(searchProducts({ 
        q: query, 
        sort: sortBy === 'relevance' ? undefined : sortBy,
        limit: 20 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar 
              className="w-full"
              placeholder="Search for products..."
            />
          </div>
          
          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {loading ? 'Searching...' : `Results for "${query}"`}
                </p>
                {!loading && searchResults.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Found {searchResults.length} {pagination.totalItems ? `of ${pagination.totalItems}` : ''} products
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="min-h-[400px]">
          {!query ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start your search
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Enter a product name, category, or brand to find what you're looking for
              </p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Search failed
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error}
              </p>
              <button 
                onClick={handleRetry}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We couldn't find any products matching "{query}"
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Try:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using different keywords</li>
                  <li>• Searching for a broader term</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Load More / Pagination */}
        {searchResults.length > 0 && pagination.totalPages > 1 && (
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </p>
            {pagination.currentPage < pagination.totalPages && (
              <button 
                onClick={() => {
                  // Implement load more functionality
                  dispatch(searchProducts({ 
                    q: query, 
                    sort: sortBy === 'relevance' ? undefined : sortBy,
                    page: pagination.currentPage + 1,
                    limit: 20 
                  }));
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
              >
                Load More Products
              </button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
