export const metadata = {
  title: 'Trendzs | Faxio',
  description: 'Discover trending styles and fashion picks curated by Faxio.',
  keywords: ['fashion trends', 'trending styles', 'latest fashion', 'Faxio trendzs'],
  alternates: { canonical: '/trendzs' },
  openGraph: {
    title: 'Trendzs | Faxio',
    description: 'What’s trending now in fashion, curated by Faxio.',
    type: 'website',
    url: '/trendzs',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trendzs | Faxio',
    description: 'What’s trending now in fashion, curated by Faxio.',
  },
};

export default function TrendzsLayout({ children }) {
  return children;
}
