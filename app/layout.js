import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fashionista - Premium Fashion Store',
  description: 'Discover the latest trends in fashion with our curated collection of dresses, kurtis, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
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
