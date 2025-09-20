export const metadata = {
  title: 'Your Cart | Faxio',
  description: 'Review the items in your Faxio shopping cart before checkout.',
  keywords: ['shopping cart', 'bag', 'cart items', 'Faxio cart'],
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Your Cart | Faxio',
    description: 'Items you’re about to purchase from Faxio.',
    type: 'website',
    url: '/cart',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary',
    title: 'Your Cart | Faxio',
    description: 'Items you’re about to purchase from Faxio.',
  },
};

export default function CartLayout({ children }) {
  return children;
}
