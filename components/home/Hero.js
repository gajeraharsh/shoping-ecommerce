'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { mockProducts } from '@/utils/mockData';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function Hero() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts.slice(0, 6));
      setLoading(false);
    }, 800);
  }, []);

  const featuredProducts = products.slice(0, 4); // Get first 4 products for swiper

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              New Collection 2024
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Discover Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {" "}Perfect Style
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Explore our exclusive collection of traditional kurties, modern dresses, and ethnic wear crafted for the modern woman.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/products?category=kurtis"
                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                View Kurties
              </Link>
            </div>
          </div>

          {/* Featured Products Swiper */}
          <div className="relative">
            {loading ? (
              <div className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-[500px] lg:h-[600px]"></div>
              </div>
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Autoplay, EffectFade, Pagination]}
                  effect="fade"
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-3 !h-3',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125',
                  }}
                  loop={true}
                  className="rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[600px]"
                >
                  {featuredProducts.map((product, index) => (
                    <SwiperSlide key={product.id || index}>
                      <div className="relative h-full group">
                        <div className="relative h-full overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          
                          {/* Discount Badge */}
                          {product.discount && (
                            <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                              {product.discount}% OFF
                            </div>
                          )}
                          
                          {/* Product Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating} ({product.reviews} reviews)</span>
                            </div>
                            
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">{product.name}</h3>
                            
                            <p className="text-gray-200 mb-4 max-w-md text-sm sm:text-base">
                              {product.description || 'Discover premium quality and elegant design in our exclusive collection.'}
                            </p>
                            
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl sm:text-4xl font-bold">₹{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-xl text-gray-300 line-through">₹{product.originalPrice}</span>
                                )}
                              </div>
                              
                              <Link
                                href={`/products/${product.id}`}
                                className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                              >
                                <ShoppingBag className="w-5 h-5" />
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Pagination Styles */}
                <style jsx global>{`
                  .swiper-pagination {
                    bottom: 20px !important;
                  }
                  .swiper-pagination-bullet {
                    opacity: 0.7 !important;
                    transition: all 0.3s ease !important;
                  }
                  .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {(loading ? Array.from({ length: 5 }) : products.slice(1, 6)).map((product, index) => (
            <div key={index} className="group">
              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-pulse">
                  <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:transform group-hover:-translate-y-2">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-pink-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-lg group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
