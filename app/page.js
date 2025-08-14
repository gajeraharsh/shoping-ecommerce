import { ArrowRight } from 'lucide-react';
import Hero from '@/components/home/Hero';
import InstagramFeed from '@/components/social/InstagramFeed';
import InstagramReelsFeed from '@/components/social/InstagramReelsFeed';
import SimpleTrustSection from '@/components/ui/SimpleTrustSection';
import SimpleTestimonials from '@/components/ui/SimpleTestimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main>
        <Hero />
        
        {/* Brand Story Section */}
        <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-block">
                    <div className="w-16 h-px bg-black/20 dark:bg-white/20 mb-4"></div>
                    <p className="text-sm font-medium tracking-[0.1em] uppercase text-gray-500 dark:text-gray-400">Our Story</p>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 dark:text-white leading-[1.1] tracking-[-0.02em]">
                    Crafted for the
                    <br />
                    <span className="italic font-extralight text-gray-700 dark:text-gray-200">Modern</span> Woman
                  </h2>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 leading-relaxed font-light max-w-2xl">
                  Every piece in our collection tells a story of meticulous craftsmanship,
                  timeless design, and unwavering attention to detail. We believe fashion
                  should empower, inspire, and celebrate the unique beauty within every woman.
                </p>
                <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">500+</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Curated Pieces</p>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">10k+</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
                  </div>
                </div>
                <a href="/about" className="inline-flex items-center border border-black/20 dark:border-white/20 text-black dark:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-medium hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 text-sm sm:text-base touch-manipulation min-h-[48px] group">
                  <span>Our Story</span>
                  <div className="ml-3 w-4 h-4 rounded-full border border-current opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
              <div className="relative mt-12 lg:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/40 to-gray-300/40 dark:from-gray-600/20 dark:to-gray-700/20 rounded-3xl blur-xl"></div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2340&auto=format&fit=crop"
                    alt="Fashion atelier"
                    className="w-full h-80 sm:h-96 lg:h-[650px] object-cover rounded-2xl shadow-2xl"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Premium craftsmanship since 2020</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Shop with Complete Confidence
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your security and satisfaction are our top priorities. We've implemented industry-leading measures to protect your data and ensure a seamless shopping experience.
              </p>
            </div>
            <SimpleTrustSection />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-800/30 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-block mb-6">
                <div className="w-16 h-px bg-black/20 dark:bg-white/20 mb-4 mx-auto"></div>
                <p className="text-sm font-medium tracking-[0.1em] uppercase text-gray-500 dark:text-gray-400">Collections</p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8 leading-[1.1] tracking-[-0.02em]">
                Featured
                <br />
                <span className="italic font-extralight text-gray-700 dark:text-gray-200">Collections</span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                Discover our most coveted pieces, carefully selected for their exceptional quality and timeless appeal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {[
                {
                  title: "Evening Elegance",
                  description: "Sophisticated pieces for special occasions",
                  image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                  link: "/collections/evening"
                },
                {
                  title: "Casual Chic",
                  description: "Effortless style for everyday wear",
                  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
                  link: "/collections/casual"
                },
                {
                  title: "Workwear Essentials",
                  description: "Professional pieces that command attention",
                  image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop",
                  link: "/collections/workwear"
                }
              ].map((collection, index) => (
                <a
                  key={index}
                  href={collection.link}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/5] block touch-manipulation"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{collection.title}</h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">{collection.description}</p>
                    <div className="inline-flex items-center text-white group-hover:text-white transition-colors text-sm sm:text-base">
                      <span className="font-medium">Explore Collection</span>
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Reels Section */}
        <InstagramReelsFeed />

        {/* Instagram Feed Section */}
        <InstagramFeed />

        {/* Verified Testimonials */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SimpleTestimonials />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white rounded-3xl sm:rounded-[2rem] p-12 sm:p-16 lg:p-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-black/5 transform rotate-12 scale-150"></div>
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-px bg-white/30 dark:bg-black/30 mb-4 mx-auto"></div>
                  <p className="text-sm font-medium tracking-[0.1em] uppercase text-white/60 dark:text-black/60">Newsletter</p>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white dark:text-black mb-6 sm:mb-8 leading-[1.1] tracking-[-0.02em]">
                  Stay
                  <br />
                  <span className="italic font-extralight">Updated</span>
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/70 dark:text-black/70 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                  Be the first to know about new collections, exclusive offers, and styling tips
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-xl mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 sm:px-8 sm:py-5 rounded-full text-black bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white text-sm sm:text-base min-h-[48px] touch-manipulation font-medium placeholder:text-gray-500"
                  />
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white dark:text-black px-8 py-4 sm:px-10 sm:py-5 rounded-full font-medium hover:bg-white/20 hover:border-white/30 transition-colors duration-300 text-sm sm:text-base min-h-[48px] touch-manipulation group">
                    <span>Subscribe</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 inline" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
