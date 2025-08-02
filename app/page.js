import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import InstagramFeed from '@/components/social/InstagramFeed';
import InstagramReelsFeed from '@/components/social/InstagramReelsFeed';
import TrustBadges from '@/components/ui/TrustBadges';
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
            <TrustBadges />
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

        {/* Testimonials */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-fluid">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">
                What Our Customers Say
              </h2>
              <p className="body-lg text-fade">
                Hear from women who've found their perfect style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The quality is exceptional and the fit is perfect. Every piece feels luxurious and well-crafted.",
                  author: "Sarah Chen",
                  role: "Creative Director",
                  rating: 5
                },
                {
                  quote: "Finally found a brand that understands elegance. The attention to detail is remarkable.",
                  author: "Priya Sharma",
                  role: "Entrepreneur",
                  rating: 5
                },
                {
                  quote: "These pieces have become staples in my wardrobe. The designs are timeless and sophisticated.",
                  author: "Emma Thompson",
                  role: "Fashion Consultant",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
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
