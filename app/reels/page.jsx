import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"

export const metadata = {
  title: "Reels | Faxio",
}

export default function ReelsPage() {
  return (
    <main>
      <InfiniteReelsGrid title="Reels" filters={{ type: 'video' }} pageSize={16} order="-created_at" />
    </main>
  )
}
