export const metadata = {
  title: 'Blog | Faxio',
  description: 'Read the latest fashion tips, trends, and stories from Faxio.',
  keywords: ['fashion blog', 'style tips', 'trends', 'Faxio blog'],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Faxio',
    description: 'Latest fashion tips, trends, and stories from Faxio.',
    type: 'website',
    url: '/blog',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Faxio',
    description: 'Latest fashion tips, trends, and stories from Faxio.',
  },
};

export default function BlogLayout({ children }) {
  return children;
}
