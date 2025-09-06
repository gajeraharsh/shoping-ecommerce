import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"
import { Suspense } from "react"

export const metadata = {
  title: "Feed | Faxio",
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
