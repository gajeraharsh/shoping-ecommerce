'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import SmartImage from '@/components/ui/SmartImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import CollectionProductsSection from './CollectionProductsSection';

export default function Hero() {

  const heroSlides = useMemo(() => [
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
      link: "/products?q=evening"
    },
    {
      id: 3,
      title: "Casual Sophistication",
      subtitle: "Effortless Style",
      description: "Premium casual wear that transitions seamlessly from day to night",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2340&auto=format&fit=crop",
      cta: "Shop Now",
      link: "/products?q=casual"
    }
  ], []);

  const categories = useMemo(() => [
    {
      title: "New Arrivals",
      description: "Latest trends and seasonal favorites",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K4DAC1GF65JJVCNHPQKNNTGJ', page: 1 } }
    },
    {
      title: "Bestsellers",
      description: "Customer favorites and top-rated pieces",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K4DADGWSMNKK1PE2299V95SV', page: 1 } }
    },
    {
      title: "Sale",
      description: "Limited time offers on premium pieces",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K4DAEBZ3594BTM7302Z75ABJ', page: 1 } }
    }
  ], []);

  const testimonials = useMemo(() => [
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
  ], []);

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
            bulletClass: 'swiper-pagination-bullet !bg-white/40 !w-2 !h-2 !mx-1.5 !border !border-white/20',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-12 !h-2 !rounded-full !border-white',
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          loop={true}
          className="h-full"
          style={{ willChange: 'auto' }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0">
                  <SmartImage
                    src={slide.image}
                    alt={slide.title}
                    className="object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 z-20 flex items-center safe-area-bottom">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-center sm:text-left">
                      <div className="space-y-1 mb-6 sm:mb-8">
                        <p className="text-white/70 text-xs sm:text-sm font-light tracking-[0.2em] uppercase opacity-90">
                          {slide.subtitle}
                        </p>
                        <div className="w-12 h-px bg-white/30 mt-2"></div>
                      </div>
                      <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-6 sm:mb-8 leading-[0.9] tracking-[-0.02em] px-2 sm:px-0">
                        <span className="font-extralight italic text-white/90">{slide.title.split(' ')[0]}</span>
                        <br />
                        <span className="font-bold">{slide.title.split(' ').slice(1).join(' ')}</span>
                      </h1>
                      <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto sm:mx-0 px-2 sm:px-0 font-light">
                        {slide.description}
                      </p>
                      <div className="px-2 sm:px-0">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <Link
                            href={slide.link}
                            className="relative inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-medium hover:bg-white/20 hover:border-white/30 transition-colors duration-300 group touch-manipulation min-h-[48px] text-sm sm:text-base overflow-hidden"
                          >
                            <span className="relative z-10">{slide.cta}</span>
                            <ArrowRight className="ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                          </Link>
                          <Link
                            href="/about"
                            className="inline-flex items-center text-white/80 hover:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-medium border border-white/10 hover:border-white/30 transition-colors duration-300 group touch-manipulation min-h-[48px] text-sm sm:text-base"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
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
            bottom: 60px !important;
            left: 20px !important;
            width: auto !important;
            text-align: left !important;
          }
          @media (min-width: 640px) {
            .swiper-pagination {
              left: 48px !important;
              bottom: 40px !important;
            }
          }
          @media (max-width: 374px) {
            .swiper-pagination {
              left: 16px !important;
              bottom: 80px !important;
            }
          }
        `}</style>
      </section>

      {/* Featured Categories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4 sm:px-0">
              Discover Our Collections
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Curated selections that define modern elegance and timeless sophistication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] block touch-manipulation shadow-sm"
                style={{ transform: 'translateZ(0)' }}
              >
                <div className="absolute inset-0">
                  <SmartImage
                    src={category.image}
                    alt={category.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-300"></div>
                <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-end">
                  <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-3">{category.title}</h3>
                    <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300">{category.description}</p>
                    <div className="inline-flex items-center text-white/90 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                      <span className="font-medium">Explore</span>
                      <div className="ml-3 w-6 h-6 rounded-full border border-white/30 group-hover:border-white flex items-center justify-center transition-all duration-300 group-hover:bg-white/10">
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

        {/* Dynamic Collections: Best Sellers */}
        <CollectionProductsSection
          title="Best Sellers"
          description="Our most-loved pieces that customers can't get enough of."
          collectionId="pcol_01K4DADGWSMNKK1PE2299V95SV"
          limit={8}
        />

        {/* Dynamic Collections: New Arrivals */}
        <CollectionProductsSection
          title="New Arrivals"
          description="Fresh drops just in—discover the latest styles first."
          collectionId="pcol_01K4DAC1GF65JJVCNHPQKNNTGJ"
          limit={8}
        />


      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4 sm:px-0">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 px-4 sm:px-0">
              Hear from women who've found their perfect style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/50 dark:border-gray-800/50 group">
                <div className="flex items-center mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current mr-1 opacity-90" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-lg sm:text-xl leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">{testimonial.author}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base tracking-wide">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
