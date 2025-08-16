'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductTabs from '@/components/products/ProductTabs';
import RelatedProducts from '@/components/products/RelatedProducts';
import RecentlyViewed from '@/components/products/RecentlyViewed';
import { mockProducts } from '@/utils/mockData';
import { getProductReviews } from '@/services/modules/review/reviewService';

export default function ProductDetailClient({ initialProduct = null }) {
  const params = useParams();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [initialReviewsData, setInitialReviewsData] = useState(null);

  useEffect(() => {
    if (initialProduct) return; // already have server-fetched product
    // Simulate API call with mock data for fallback
    setLoading(true);
    const t = setTimeout(() => {
      const foundProduct = mockProducts.find((p) => p.id === parseInt(params.id));
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [params.id, initialProduct]);

  // Prefetch product reviews on initial page load (not on tab change)
  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      if (!product?.id) return;
      try {
        const res = await getProductReviews(product.id, { limit: 10, offset: 0, order: '-created_at' });
        if (mounted) setInitialReviewsData(res);
      } catch (e) {
        if (mounted) setInitialReviewsData(null);
      }
    };
    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [product?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
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
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
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
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.category?.charAt ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Category', href: `/products?category=${product.category || ''}` },
    { name: product.name, href: '#', current: true }
  ];

  // Helper to robustly parse JSON (handles single/double-encoded strings)
  const parseMaybeJson = (value) => {
    if (Array.isArray(value) || (value && typeof value === 'object')) return value;
    if (typeof value !== 'string') return value ?? null;
    let current = value.trim();
    for (let i = 0; i < 3; i++) {
      try {
        const parsed = JSON.parse(current);
        if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) return parsed;
        if (typeof parsed === 'string') { current = parsed; continue; }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Normalize product metadata so children always receive parsed objects/arrays
  const normalizedProduct = useMemo(() => {
    const meta = product?.metadata || {};
    const spec = parseMaybeJson(meta.specification);
    const highlights = parseMaybeJson(meta.highlights ?? meta.key_features) || [];
    return {
      ...product,
      metadata: {
        ...meta,
        specification: spec ?? null,
        highlights,
      },
    };
  }, [product]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* New Breadcrumb Component */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
          <ProductImageGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
        
        {/* Product Tabs */}
        <ProductTabs product={normalizedProduct} initialReviewsData={initialReviewsData} />
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
        
        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>
      
    </div>
  );
}
