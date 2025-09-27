import ReelsPageClient from "@/components/social/ReelsPageClient"
import PageJsonLd from '@/components/seo/PageJsonLd.jsx'

export const metadata = {
  title: "Trendzs | Faxio",
}

export default function TrendzsPage() {
  return (
    <>
      {(() => {
        const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
        const url = `${base}/trendzs`;
        return (
          <PageJsonLd
            type="WebPage"
            title="Trendzs | Faxio"
            description="Short fashion reels and trends from Faxio."
            url={url}
            breadcrumbs={[
              { name: 'Home', item: `${base}/` },
              { name: 'Trendzs', item: url },
            ]}
          />
        );
      })()}
      <ReelsPageClient />
    </>
  )
}
