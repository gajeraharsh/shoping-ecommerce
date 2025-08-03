import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import InstagramFeed from '@/components/social/InstagramFeed';
import InstagramReelsFeed from '@/components/social/InstagramReelsFeed';
import SimpleTrustSection from '@/components/ui/SimpleTrustSection';
import SimpleTestimonials from '@/components/ui/SimpleTestimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        
        {/* Brand Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Crafted for the Modern Woman
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
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
                <a href="/about" className="inline-flex items-center border-2 border-black dark:border-white text-black dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 text-sm sm:text-base touch-manipulation min-h-[48px]">
                  Our Story
                </a>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2340&auto=format&fit=crop"
                  alt="Fashion atelier"
                  className="w-full h-64 sm:h-80 lg:h-[600px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
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
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Featured Collections
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Discover our most coveted pieces, carefully selected for their exceptional quality and timeless appeal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{collection.title}</h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">{collection.description}</p>
                    <div className="inline-flex items-center text-white group-hover:text-white transition-colors text-sm sm:text-base">
                      <span className="font-medium">Explore Collection</span>
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black dark:bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white dark:text-black mb-3 sm:mb-4">
                Stay Updated
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/80 dark:text-black/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Be the first to know about new collections, exclusive offers, and styling tips
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base min-h-[48px] touch-manipulation"
                />
                <button className="bg-white dark:bg-black text-black dark:text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base min-h-[48px] touch-manipulation">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
