export const metadata = {
  title: 'Privacy Policy | Faxio',
  description: 'Read Faxio’s Privacy Policy to understand how we collect, use, and protect your personal information.',
  keywords: ['privacy policy', 'data protection', 'user privacy', 'Faxio privacy'],
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Faxio',
    description: 'Learn how Faxio handles your personal data and privacy.',
    type: 'website',
    url: '/privacy',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Faxio',
    description: 'Learn how Faxio handles your personal data and privacy.',
  },
};

export default function PrivacyLayout({ children }) {
  return children;
}
