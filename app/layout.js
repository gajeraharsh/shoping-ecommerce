import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from './providers';
import Header from '@/components/layout/Header';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import CookieConsent from '@/components/common/CookieConsent';
import StructuredData from '@/components/seo/StructuredData';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Faxio - Premium Fashion & Style',
  description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair. Curated collections for the modern woman.',
  keywords: 'fashion, women clothing, premium fashion, elegant dresses, luxury fashion, online shopping, style, faxio',
  icons: {
    icon: '/favicon.svg',
  },
  robots: 'index, follow',
  author: 'Faxio',
  openGraph: {
    title: 'Faxio - Premium Fashion & Style',
    description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faxio - Premium Fashion & Style',
    description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair.',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} transition-colors overflow-x-hidden min-h-screen antialiased`}>
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <Header />
                    {children}
                    <ConditionalFooter />
                    <Toaster />
                    <CookieConsent />
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
