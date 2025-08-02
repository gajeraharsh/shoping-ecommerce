import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { SocialProvider } from '@/contexts/SocialContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'StyleSphere - Fashion Social & Shopping Platform',
  description: 'Connect with fashion creators, discover trending styles, and shop directly from social posts. The ultimate fashion community.',
  keywords: 'fashion social network, style influencers, fashion creators, fashion shopping, outfit inspiration, fashion community, style trends, social commerce',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  robots: 'index, follow',
  author: 'StyleSphere',
  openGraph: {
    title: 'StyleSphere - Fashion Social & Shopping Platform',
    description: 'Connect with fashion creators, discover trending styles, and shop directly from social posts.',
    type: 'website',
    locale: 'en_US',
    siteName: 'StyleSphere',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleSphere - Fashion Social & Shopping Platform',
    description: 'Connect with fashion creators, discover trending styles, and shop directly from social posts.',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} transition-colors overflow-x-hidden`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <RecentlyViewedProvider>
                  {children}
                  <Toaster />
                </RecentlyViewedProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
