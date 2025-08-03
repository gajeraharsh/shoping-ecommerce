'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductTabs from '@/components/products/ProductTabs';
import RelatedProducts from '@/components/products/RelatedProducts';
import RecentlyViewed from '@/components/products/RecentlyViewed';
import { mockProducts } from '@/utils/mockData';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === parseInt(params.id));
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Breadcrumb Skeleton */}
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-64 rounded mb-6 sm:mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 lg:h-[600px] rounded-2xl"></div>
            <div className="space-y-6">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/products?category=${product.category}` },
    { name: product.name, href: '#', current: true }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Breadcrumbs - Properly Aligned Flat Structure */}
        <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            {breadcrumbs.map((breadcrumb, index) => (
              <>
                {index > 0 && (
                  <ChevronRight key={`separator-${index}`} className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                {breadcrumb.current ? (
                  <span 
                    key={breadcrumb.name}
                    className="text-gray-500 dark:text-gray-400 text-sm font-medium max-w-[120px] sm:max-w-[180px] md:max-w-[240px] truncate flex-shrink-0" 
                    title={breadcrumb.name}
                  >
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    key={breadcrumb.name}
                    href={breadcrumb.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </>
            ))}
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
          <ProductImageGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
        
        {/* Product Tabs */}
        <ProductTabs product={product} />
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
        
        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>
      
      <Footer />
    </div>
  );
}
