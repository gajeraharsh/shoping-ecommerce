import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import InstagramFeed from '@/components/social/InstagramFeed';
import InstagramReelsFeed from '@/components/social/InstagramReelsFeed';
import SimpleTrustSection from '@/components/ui/SimpleTrustSection';
import VerifiedTestimonials from '@/components/ui/VerifiedTestimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        
        {/* Brand Story Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-fluid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="heading-lg mb-6">
                  Crafted for the Modern Woman
                </h2>
                <p className="body-lg text-fade mb-8">
                  Every piece in our collection tells a story of meticulous craftsmanship, 
                  timeless design, and unwavering attention to detail. We believe fashion 
                  should empower, inspire, and celebrate the unique beauty within every woman.
                </p>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">500+</h3>
                    <p className="text-sm text-fade">Curated Pieces</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">10k+</h3>
                    <p className="text-sm text-fade">Happy Customers</p>
                  </div>
                </div>
                <a href="/about" className="btn-outline">
                  Our Story
                </a>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2340&auto=format&fit=crop"
                  alt="Fashion atelier"
                  className="w-full h-[600px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="section-padding-sm bg-white dark:bg-gray-900">
          <div className="container-fluid">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-4">
                Shop with Complete Confidence
              </h2>
              <p className="body-lg text-fade max-w-2xl mx-auto">
                Your security and satisfaction are our top priorities. We've implemented industry-leading measures to protect your data and ensure a seamless shopping experience.
              </p>
            </div>
            <SimpleTrustSection />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="section-padding">
          <div className="container-fluid">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">
                Featured Collections
              </h2>
              <p className="body-lg text-fade max-w-2xl mx-auto">
                Discover our most coveted pieces, carefully selected for their exceptional quality and timeless appeal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2">{collection.title}</h3>
                    <p className="text-white/90 mb-4">{collection.description}</p>
                    <div className="inline-flex items-center text-white group-hover:text-white transition-colors">
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
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-fluid">
            <VerifiedTestimonials />
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-padding">
          <div className="container-fluid">
            <div className="bg-black dark:bg-white rounded-3xl p-16 text-center">
              <h2 className="heading-md text-white dark:text-black mb-4">
                Stay Updated
              </h2>
              <p className="body-lg text-white/80 dark:text-black/80 mb-8 max-w-2xl mx-auto">
                Be the first to know about new collections, exclusive offers, and styling tips
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
