"use client"

import { useEffect, useState } from "react"
import MobileReelsFeed from "@/components/social/MobileReelsFeed"
import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"

export default function ReelsPageClient() {
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const handle = () => setIsMobile(mql.matches)
    handle()
    try {
      mql.addEventListener("change", handle)
      return () => mql.removeEventListener("change", handle)
    } catch {
      // Safari fallback
      window.addEventListener("resize", handle)
      return () => window.removeEventListener("resize", handle)
    }
  }, [])

  if (isMobile === null) {
    return (
      <main>
        <div className="p-6 text-sm text-gray-500">Loading reels…</div>
      </main>
    )
  }

  return (
    <main>
      {isMobile ? (
        <MobileReelsFeed title="Trendzs" filters={{ type: "video" }} pageSize={10} order="-created_at" />
      ) : (
        <InfiniteReelsGrid title="Trendzs" filters={{ type: "video" }} pageSize={16} order="-created_at" />
      )}
    </main>
  )
}
