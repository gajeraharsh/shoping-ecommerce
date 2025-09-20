export const metadata = {
  title: 'Terms & Conditions | Faxio',
  description: 'Review Faxio’s Terms and Conditions for using our website and services.',
  keywords: ['terms and conditions', 'terms of service', 'user agreement', 'Faxio terms'],
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms & Conditions | Faxio',
    description: 'Understand the terms for using Faxio’s website and services.',
    type: 'website',
    url: '/terms',
    siteName: 'Faxio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | Faxio',
    description: 'Understand the terms for using Faxio’s website and services.',
  },
};

export default function TermsLayout({ children }) {
  return children;
}
