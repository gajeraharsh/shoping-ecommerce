'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
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
      setProducts(mockProducts.slice(0, 8));
      setLoading(false);
    }, 800);
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: "Autumn Collection",
      subtitle: "Elegance Redefined",
      description: "Discover sophisticated pieces that blend timeless style with contemporary flair",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2340&auto=format&fit=crop",
      cta: "Shop Collection",
      link: "/products?collection=autumn"
    },
    {
      id: 2,
      title: "Evening Elegance",
      subtitle: "Luxury Redefined",
      description: "Exquisite evening wear crafted for the modern woman who values elegance",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2340&auto=format&fit=crop",
      cta: "Explore Now",
      link: "/products?category=evening"
    },
    {
      id: 3,
      title: "Casual Sophistication",
      subtitle: "Effortless Style",
      description: "Premium casual wear that transitions seamlessly from day to night",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2340&auto=format&fit=crop",
      cta: "Shop Now",
      link: "/products?category=casual"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Slider */}
      <section className="relative h-screen safe-area-top">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2 !h-2 !mx-1',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8 !h-2 !rounded-full',
          }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 z-20 flex items-center safe-area-bottom">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-center sm:text-left">
                      <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
                        {slide.title}
                      </h1>
                      <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto sm:mx-0 px-4 sm:px-0">
                        {slide.description}
                      </p>
                      <div className="px-4 sm:px-0">
                        <Link
                          href={slide.link}
                          className="inline-flex items-center bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 group touch-manipulation min-h-[44px]"
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
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
            bottom: 40px !important;
            left: 48px !important;
            width: auto !important;
            text-align: left !important;
          }
          @media (max-width: 768px) {
            .swiper-pagination {
              left: 16px !important;
              bottom: 80px !important;
            }
          }
        `}</style>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Our Collections
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Curated selections that define modern elegance and timeless sophistication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "New Arrivals",
                description: "Latest trends and seasonal favorites",
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
                link: "/products?sort=newest"
              },
              {
                title: "Bestsellers",
                description: "Customer favorites and top-rated pieces",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
                link: "/products?sort=popular"
              },
              {
                title: "Sale",
                description: "Limited time offers on premium pieces",
                image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop",
                link: "/products?sale=true"
              }
            ].map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-white/90 mb-4">{category.description}</p>
                  <div className="inline-flex items-center text-white group-hover:text-white transition-colors">
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured This Week
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handpicked favorites that showcase exceptional craftsmanship and design
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Hear from women who've found their perfect style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Absolutely stunning quality and the perfect fit. The attention to detail is remarkable.",
                author: "Sarah Chen",
                role: "Fashion Enthusiast",
                rating: 5
              },
              {
                quote: "Finally found a brand that understands elegance. Every piece feels like it was made just for me.",
                author: "Priya Sharma",
                role: "Working Professional",
                rating: 5
              },
              {
                quote: "The craftsmanship is exceptional. These pieces have become staples in my wardrobe.",
                author: "Emma Thompson",
                role: "Style Blogger",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
