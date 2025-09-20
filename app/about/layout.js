export const metadata = {
  title: 'About | Faxio',
  description: 'Learn about Faxio — our story, values, mission, and the team behind the brand delivering premium fashion & style.',
  keywords: ['about Faxio', 'fashion brand', 'our story', 'premium fashion'],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Faxio',
    description: 'Our story, values, and mission — meet the team behind Faxio.',
    type: 'website',
    url: '/about',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Faxio',
    description: 'Our story, values, and mission — meet the team behind Faxio.',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
