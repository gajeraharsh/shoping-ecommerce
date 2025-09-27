import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"
import { Suspense } from "react"
import PageJsonLd from '@/components/seo/PageJsonLd.jsx'

export const metadata = {
  title: "Feed | Faxio",
  description: "Discover the latest looks, reels, and product highlights from Faxio. Like and share your favorite fashion moments.",
  alternates: { canonical: "/feed" },
  openGraph: {
    title: "Faxio Feed",
    description: "Discover the latest looks, reels, and product highlights from Faxio.",
    url: "/feed",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faxio Feed",
    description: "Discover the latest looks, reels, and product highlights from Faxio.",
  },
}

export default function FeedPage() {
  return (
    <main>
      {(() => {
        const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
        const url = `${base}/feed`;
        return (
          <PageJsonLd
            type="WebPage"
            title="Feed | Faxio"
            description="Discover the latest looks, reels, and product highlights from Faxio. Like and share your favorite fashion moments."
            url={url}
            breadcrumbs={[
              { name: 'Home', item: `${base}/` },
              { name: 'Feed', item: url },
            ]}
          />
        );
      })()}
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading feed…</div>}>
        <InfiniteReelsGrid title="Feed" filters={{ type: 'image' }} pageSize={16} order="-created_at" />
      </Suspense>
    </main>
  )
}
