import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import Newsletter from '@/components/home/Newsletter';
import TrustBadges from '@/components/ui/TrustBadges';
import SocialProof from '@/components/ui/SocialProof';
import { ProductRecommendationGrid } from '@/components/products/ProductRecommendations';
import RecentlyViewed from '@/components/products/RecentlyViewed';
import NewsletterSignup from '@/components/marketing/NewsletterSignup';
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup';
import InstagramFeed from '@/components/social/InstagramFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full overflow-x-hidden">
      <Header />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <TrustBadges variant="compact" />
        <Categories />
        <FeaturedProducts />
        <ProductRecommendationGrid />
        <TrustBadges variant="social" />
        <SocialProof variant="testimonials" />
        <RecentlyViewed />
        <NewsletterSignup />
        <SocialProof variant="reviews" />
        <InstagramFeed />
      </main>
      <Footer />

      {/* Modern Features */}
      <SocialProof variant="activity" />
      <ExitIntentPopup />
    </div>
  );
}
