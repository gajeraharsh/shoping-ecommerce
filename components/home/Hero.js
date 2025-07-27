'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts.slice(0, 8));
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-pink-50 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-2 sm:px-4 relative overflow-visible">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          navigation={{ nextEl: '.hero-swiper-next', prevEl: '.hero-swiper-prev' }}
          pagination={{ clickable: true, el: '.hero-swiper-pagination' }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {(loading ? Array.from({ length: 6 }) : products).map((product, index) => (
            <SwiperSlide key={index}>
              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 animate-pulse h-full flex flex-col">
                  <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] bg-gray-200 dark:bg-gray-700 rounded-t-2xl" />
                  <div className="p-3 sm:p-4 lg:p-5 flex flex-col gap-2 flex-grow">
                    <div className="h-4 w-24 bg-gray-300 rounded" />
                    <div className="h-6 w-3/4 bg-gray-300 rounded" />
                    <div className="h-5 w-1/2 bg-gray-300 rounded" />
                    <div className="h-10 bg-gray-300 rounded-lg mt-auto" />
                    <div className="h-10 bg-gray-300 rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                  <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      draggable={false}
                    />
                    {product.discount && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-1 text-xs sm:text-sm text-yellow-600">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg font-bold text-pink-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto space-y-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="block text-center bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold py-2 rounded-lg transition-all shadow group-hover:scale-105 group-hover:shadow-lg"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/products/${product.id}`}
                        className="block text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow group-hover:scale-105 group-hover:shadow-lg"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}

          {/* Arrows */}
          <button
            className="hero-swiper-prev absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full z-30 shadow transition"
            aria-label="Previous"
          >
            <svg
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className="hero-swiper-next absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full z-30 shadow transition"
            aria-label="Next"
          >
            <svg
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="hero-swiper-pagination absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30" />
        </Swiper>
      </div>
    </section>
  );
}
