export const metadata = {
  title: 'Collections | Faxio',
  description: 'Explore curated fashion collections by Faxio for every occasion.',
  keywords: ['fashion collections', 'curated collections', 'shop collections', 'Faxio collections'],
  alternates: { canonical: '/collections' },
  openGraph: {
    title: 'Collections | Faxio',
    description: 'Curated edits and seasonal collections from Faxio.',
    type: 'website',
    url: '/collections',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Faxio',
    description: 'Curated edits and seasonal collections from Faxio.',
  },
};

export default function CollectionsLayout({ children }) {
  return children;
}
