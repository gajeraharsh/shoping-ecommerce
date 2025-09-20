export const metadata = {
  title: 'Wishlist | Faxio',
  description: 'Save your favorite Faxio items to your wishlist for later.',
  keywords: ['wishlist', 'saved items', 'favorites', 'Faxio wishlist'],
  alternates: { canonical: '/wishlist' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Wishlist | Faxio',
    description: 'Keep track of your favorite fashion pieces from Faxio.',
    type: 'website',
    url: '/wishlist',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wishlist | Faxio',
    description: 'Keep track of your favorite fashion pieces from Faxio.',
  },
};

export default function WishlistLayout({ children }) {
  return children;
}
