export const metadata = {
  title: 'Contact Us | Faxio',
  description: 'Get in touch with Faxio for support, order inquiries, partnerships, and general questions.',
  keywords: ['contact Faxio', 'customer support', 'order support', 'partnerships'],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Faxio',
    description: 'Reach our team for support, orders, and partnerships.',
    type: 'website',
    url: '/contact',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Faxio',
    description: 'Reach our team for support, orders, and partnerships.',
  },
};

export default function ContactLayout({ children }) {
  return children;
}
