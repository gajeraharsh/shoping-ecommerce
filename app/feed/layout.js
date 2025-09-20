export const metadata = {
  title: 'Feed | Faxio',
  description: 'Browse the latest updates and featured looks from Faxio.',
  keywords: ['fashion feed', 'latest looks', 'updates', 'Faxio feed'],
  alternates: { canonical: '/feed' },
  openGraph: {
    title: 'Feed | Faxio',
    description: 'Latest updates, featured drops, and looks from Faxio.',
    type: 'website',
    url: '/feed',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feed | Faxio',
    description: 'Latest updates, featured drops, and looks from Faxio.',
  },
};

export default function FeedLayout({ children }) {
  return children;
}
