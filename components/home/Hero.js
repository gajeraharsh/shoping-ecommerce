'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import SmartImage from '@/components/ui/SmartImage';
import { getBanners } from '@/services/modules/banner/bannerService';

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
      imageMobile: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1080&auto=format&fit=crop",
      imageDesktop: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2340&auto=format&fit=crop",
      cta: "Shop Collection",
      link: "/products?collection=autumn"
    },
    {
      id: 2,
      title: "Evening Elegance",
      subtitle: "Luxury Redefined",
      description: "Exquisite evening wear crafted for the modern woman who values elegance",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2340&auto=format&fit=crop",
      imageMobile: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1080&auto=format&fit=crop",
      imageDesktop: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2340&auto=format&fit=crop",
      cta: "Explore Now",
      link: "/products?q=evening"
    },
    {
      id: 3,
      title: "Casual Sophistication",
      subtitle: "Effortless Style",
      description: "Premium casual wear that transitions seamlessly from day to night",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2340&auto=format&fit=crop",
      imageMobile: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1080&auto=format&fit=crop",
      imageDesktop: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2340&auto=format&fit=crop",
      cta: "Shop Now",
      link: "/products?q=casual"
    }
  ], []);
  
  const [bannerSlides, setBannerSlides] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getBanners({ limit: 50 });
        const mapped = (res?.banners || [])
          .map((b) => ({
            id: b.id,
            title: b.name || '',
            image: b.desktop_image_url || b.mobile_image_url || '',
            imageMobile: b.mobile_image_url || b.desktop_image_url || '',
            imageDesktop: b.desktop_image_url || b.mobile_image_url || '',
            link: b.link_url || '#',
            position: Number.isFinite(b?.position) ? b.position : 9999,
          }))
          .filter((s) => s.image)
          .sort((a, b) => a.position - b.position);
        setBannerSlides(mapped);
      } catch (e) {
        // fail silently and keep static slides
      }
    })();
    return () => { mounted = false };
  }, []);

  const slidesToRender = bannerSlides;

  const categories = useMemo(() => [
    {
      title: "New Arrivals",
      description: "Latest trends and seasonal favorites",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K6582SDF4VDSDDCRB3J3WNVM', page: 1 } }
    },
    {
      title: "Bestsellers",
      description: "Customer favorites and top-rated pieces",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K65824AQ7PKJV8ZAM9E5RB71', page: 1 } }
    },
    {
      title: "Sale",
      description: "Limited time offers on premium pieces",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop",
      link: { pathname: '/products', query: { collection_id: 'pcol_01K6583CAWE3N7JPS55M881G0B', page: 1 } }
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: "Loved the fit of the Anarkali kurti — lightweight, elegant, and perfect for festive evenings.",
      author: "Priya Sharma",
      role: "Software Engineer",
      rating: 5
    },
    {
      quote: "The cotton straight-cut kurti is ideal for daily wear in Mumbai heat. Neat stitching and true to size!",
      author: "Aishwarya Iyer",
      role: "Teacher",
      rating: 5
    },
    {
      quote: "The rayon A-line kurti drapes beautifully — minimal yet classy. Received so many compliments at a family function.",
      author: "Neha Verma",
      role: "Marketing Manager",
      rating: 5
    }
  ], []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Slider - now image-only (no overlay text/buttons) */}
      <section className="relative h-[60vh] safe-area-top">
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
          {slidesToRender.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <div className="absolute inset-0">
                  <picture>
                    <source media="(max-width: 767px)" srcSet={slide.imageMobile || slide.image} />
                    <img
                      src={slide.imageDesktop || slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Styles */}
        <style jsx global>{`
          .swiper-pagination {
            bottom: 16px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            text-align: center !important;
          }
          @media (min-width: 640px) {
            .swiper-pagination {
              bottom: 20px !important;
            }
          }
          @media (max-width: 374px) {
            .swiper-pagination {
              bottom: 12px !important;
            }
          }
        `}</style>
      </section>


      {/* Featured Categories */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
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
      </section> */}

        {/* Dynamic Collections: Best Sellers */}
        <CollectionProductsSection
          title="Best Sellers"
          description="Our most-loved pieces that customers can't get enough of."
          collectionId="pcol_01K65824AQ7PKJV8ZAM9E5RB71"
          limit={8}
        />

        {/* Dynamic Collections: New Arrivals */}
        <CollectionProductsSection
          title="New Arrivals"
          description="Fresh drops just in—discover the latest styles first."
          collectionId="pcol_01K6582SDF4VDSDDCRB3J3WNVM"
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
