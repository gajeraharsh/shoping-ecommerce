export const metadata = {
  title: 'Reels | Faxio',
  description: 'Watch Faxio reels for fashion inspiration and styling ideas.',
  keywords: ['fashion reels', 'style videos', 'outfit inspiration', 'Faxio reels'],
  alternates: {
    canonical: '/reels',
  },
  openGraph: {
    title: 'Reels | Faxio',
    description: 'Bite-sized fashion videos with styling tips and outfit ideas from Faxio.',
    type: 'website',
    url: '/reels',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reels | Faxio',
    description: 'Bite-sized fashion videos with styling tips and outfit ideas from Faxio.',
  },
};

export default function ReelsLayout({ children }) {
  return children;
}
