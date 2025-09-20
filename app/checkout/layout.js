export const metadata = {
  title: 'Checkout | Faxio',
  description: 'Securely complete your purchase on Faxio’s checkout.',
  keywords: ['checkout', 'secure checkout', 'payment', 'Faxio checkout'],
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Checkout | Faxio',
    description: 'Secure payment and shipping details for your Faxio order.',
    type: 'website',
    url: '/checkout',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary',
    title: 'Checkout | Faxio',
    description: 'Secure payment and shipping details for your Faxio order.',
  },
};

export default function CheckoutLayout({ children }) {
  return children;
}
