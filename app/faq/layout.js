export const metadata = {
  title: 'FAQs | Faxio',
  description: 'Find answers to frequently asked questions about shopping with Faxio.',
  keywords: ['FAQ', 'help center', 'shipping FAQs', 'returns FAQs', 'Faxio support'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQs | Faxio',
    description: 'Common questions and answers about shopping at Faxio.',
    type: 'website',
    url: '/faq',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs | Faxio',
    description: 'Common questions and answers about shopping at Faxio.',
  },
};

export default function FAQLayout({ children }) {
  return children;
}
