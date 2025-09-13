import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"
import { Suspense } from "react"

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
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading feed…</div>}>
        <InfiniteReelsGrid title="Feed" filters={{ type: 'image' }} pageSize={16} order="-created_at" />
      </Suspense>
    </main>
  )
}
