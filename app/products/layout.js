export const metadata = {
  title: 'Shop Products | Faxio',
  description: 'Explore Faxio’s latest products and curated fashion pieces.',
  keywords: ['shop fashion', 'women clothing', 'premium fashion', 'buy dresses', 'Faxio products'],
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Shop Products | Faxio',
    description: 'Discover the latest fashion pieces curated by Faxio.',
    type: 'website',
    url: '/products',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Products | Faxio',
    description: 'Discover the latest fashion pieces curated by Faxio.',
  },
};

export default function ProductsLayout({ children }) {
  return children;
}
