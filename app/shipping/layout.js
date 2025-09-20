export const metadata = {
  title: 'Shipping Information | Faxio',
  description: 'Learn about Faxio’s shipping options, delivery times, and related policies.',
  keywords: ['shipping information', 'delivery times', 'shipping policy', 'Faxio shipping'],
  alternates: { canonical: '/shipping' },
  openGraph: {
    title: 'Shipping Information | Faxio',
    description: 'Shipping options, timelines, and FAQs for Faxio orders.',
    type: 'website',
    url: '/shipping',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Information | Faxio',
    description: 'Shipping options, timelines, and FAQs for Faxio orders.',
  },
};

export default function ShippingLayout({ children }) {
  return children;
}
