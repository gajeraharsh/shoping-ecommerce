'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { mockProducts } from '@/utils/mockData';
import Link from 'next/link';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts.slice(0, 8));
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Discover our handpicked selection of trending fashion pieces that define your style
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-primary to-primary/80 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base lg:text-lg"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
