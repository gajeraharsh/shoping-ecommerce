import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"
import { Suspense } from "react"

export const metadata = {
  title: "Reels | Faxio",
}

export default function ReelsPage() {
  return (
    <main>
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading reels…</div>}>
        <InfiniteReelsGrid title="Reels" filters={{ type: 'video' }} pageSize={16} order="-created_at" />
      </Suspense>
    </main>
  )
}
