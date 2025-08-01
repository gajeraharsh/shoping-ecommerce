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
        <div className="container-fluid section-padding">
          {/* Breadcrumb Skeleton */}
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-64 rounded mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
        <div className="container-fluid section-padding text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products" 
            className="btn-primary inline-flex items-center"
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
      
      <div className="container-fluid section-padding">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.name} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                )}
                {breadcrumb.current ? (
                  <span className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-[200px]">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm transition-colors"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
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
