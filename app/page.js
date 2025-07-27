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

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
