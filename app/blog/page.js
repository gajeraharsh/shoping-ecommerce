import BlogCard from '@/components/blog/BlogCard';
import BlogHero from '@/components/blog/BlogHero';
import InstagramFeed from '@/components/social/InstagramFeed';
import InstagramReelsFeed from '@/components/social/InstagramReelsFeed';
import BlogListingClient from '@/components/blog/BlogListingClient';

export const revalidate = 300;

export async function generateMetadata() {
  const title = 'Blog | Faxio';
  const description = 'Read the latest fashion tips, trends, and stories from Faxio.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
  const url = `${siteUrl}/blog`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Faxio',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@faxio',
      creator: '@faxio',
    },
  };
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* <BlogHero /> */}
      <BlogListingClient />

      {/* Instagram Reels Section */}
      <InstagramReelsFeed />
      
      {/* Instagram Feed Section */}
      <InstagramFeed />
      
    </div>
  );
}
