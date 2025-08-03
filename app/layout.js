import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Modave - Premium Fashion & Style',
  description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair. Curated collections for the modern woman.',
  keywords: 'fashion, women clothing, premium fashion, elegant dresses, luxury fashion, online shopping, style, modave',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  robots: 'index, follow',
  author: 'Modave Fashion',
  openGraph: {
    title: 'Modave - Premium Fashion & Style',
    description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Modave',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modave - Premium Fashion & Style',
    description: 'Discover exceptional fashion pieces that blend timeless style with contemporary flair.',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Force light theme by default
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
          `
        }} />
      </head>
      <body className={`${inter.className} transition-colors overflow-x-hidden`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                {children}
                <Toaster />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
