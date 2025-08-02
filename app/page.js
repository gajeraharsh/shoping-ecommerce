import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, ShoppingBag, Sparkles, TrendingUp, Star } from 'lucide-react';
import { getPlatformStats } from '@/lib/brand';
import Link from 'next/link';

export default function Home() {
  const stats = getPlatformStats();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        
        {/* Platform Features Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-fluid">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">
                Where Fashion Meets Community
              </h2>
              <p className="body-lg text-fade max-w-3xl mx-auto">
                StyleSphere brings together fashion lovers, creators, and brands in one vibrant social platform.
                Discover trends, share your style, and shop directly from your favorite creators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stats.creators}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fashion Creators</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stats.users}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stats.posts}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Style Posts</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stats.brands}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Partner Brands</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-8">
                <CardContent className="pt-6">
                  <TrendingUp className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="text-xl font-bold mb-3">Discover Trends</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Stay ahead of fashion trends with real-time updates from top creators and style influencers.
                  </p>
                  <Link href="/explore">
                    <Button variant="outline" size="sm">Explore Trends</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardContent className="pt-6">
                  <Users className="w-10 h-10 mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold mb-3">Connect & Share</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Follow your favorite creators, share your outfits, and build your fashion community.
                  </p>
                  <Link href="/feed">
                    <Button variant="outline" size="sm">Join Community</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardContent className="pt-6">
                  <ShoppingBag className="w-10 h-10 mb-4 text-green-600" />
                  <h3 className="text-xl font-bold mb-3">Shop the Look</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Buy products directly from posts with our seamless social commerce experience.
                  </p>
                  <Link href="/products">
                    <Button variant="outline" size="sm">Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Commerce Section */}
        <section className="section-padding bg-white dark:bg-gray-900">
          <div className="container-fluid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="heading-lg mb-6">
                  Social Commerce Redefined
                </h2>
                <p className="body-lg text-fade mb-8">
                  Experience the future of fashion shopping where social discovery meets seamless commerce.
                  Find your style inspiration and shop it instantly, all in one platform.
                </p>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Follow & Discover</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Follow your favorite fashion creators and discover new styles daily
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Tagged Products</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click on tagged products in posts to shop the exact look
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Creator Collaborations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Brands collaborate with creators for authentic style showcases
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/feed">
                  <Button className="mr-4">Explore Feed</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2340&auto=format&fit=crop"
                  alt="Social fashion platform"
                  className="w-full h-[600px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Spotlight */}
        <section className="section-padding">
          <div className="container-fluid">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">
                Featured Creators
              </h2>
              <p className="body-lg text-fade max-w-2xl mx-auto">
                Discover trending creators and their latest style inspirations that are shaping fashion conversations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "@fashionista_maya",
                  description: "125K followers • Street & Minimal Style",
                  image: "https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?q=80&w=1000&auto=format&fit=crop&crop=face",
                  link: "/profile/fashionista_maya"
                },
                {
                  title: "@styleguru_raj",
                  description: "98K followers • Vintage & Sustainable Fashion",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&crop=face",
                  link: "/profile/styleguru_raj"
                },
                {
                  title: "@elegance_official",
                  description: "156K followers • Luxury & Evening Wear",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&crop=face",
                  link: "/profile/elegance_official"
                }
              ].map((collection, index) => (
                <a
                  key={index}
                  href={collection.link}
                  className="group relative overflow-hidden rounded-2xl aspect-square block"
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
                      <span className="font-medium">View Profile</span>
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

        {/* Call to Action Section */}
        <section className="section-padding bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container-fluid text-center">
            <h2 className="heading-lg text-white mb-4">
              Ready to Join the StyleSphere Community?
            </h2>
            <p className="body-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with fashion creators, share your style, and discover your next favorite outfit.
              Join thousands of fashion enthusiasts already on StyleSphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Create Account
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Explore Feed
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Creator Testimonials */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-fluid">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">
                What Creators Are Saying
              </h2>
              <p className="body-lg text-fade max-w-2xl mx-auto">
                Hear from fashion creators who are building their communities on StyleSphere
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?w=80&h=80&fit=crop&crop=face"
                      alt="Creator"
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "StyleSphere helped me grow my following by 300% in just 6 months. The community engagement is amazing!"
                  </p>
                  <div>
                    <p className="font-semibold">Maya Sharma</p>
                    <p className="text-sm text-gray-500">@fashionista_maya</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                      alt="Creator"
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "The brand collaboration features are incredible. I've partnered with 15+ brands through StyleSphere."
                  </p>
                  <div>
                    <p className="font-semibold">Raj Patel</p>
                    <p className="text-sm text-gray-500">@styleguru_raj</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                      alt="Creator"
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "Love how easy it is to tag products in my posts. My followers can shop my looks instantly!"
                  </p>
                  <div>
                    <p className="font-semibold">Priya Singh</p>
                    <p className="text-sm text-gray-500">@elegance_official</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-padding">
          <div className="container-fluid">
            <div className="bg-black dark:bg-white rounded-3xl p-16 text-center">
              <h2 className="heading-md text-white dark:text-black mb-4">
                Stay in Style
              </h2>
              <p className="body-lg text-white/80 dark:text-black/80 mb-8 max-w-2xl mx-auto">
                Get the latest fashion trends, creator highlights, and exclusive community updates delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Join Community
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
