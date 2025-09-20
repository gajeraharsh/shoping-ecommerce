export const metadata = {
  title: 'Cookie Policy | Faxio',
  description: 'Understand how Faxio uses cookies and similar technologies on our website.',
  keywords: ['cookie policy', 'cookies', 'tracking technologies', 'privacy cookies'],
  alternates: { canonical: '/cookies' },
  openGraph: {
    title: 'Cookie Policy | Faxio',
    description: 'How Faxio uses cookies and your choices.',
    type: 'website',
    url: '/cookies',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | Faxio',
    description: 'How Faxio uses cookies and your choices.',
  },
};

export default function CookiesLayout({ children }) {
  return children;
}
