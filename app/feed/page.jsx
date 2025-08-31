import InfiniteReelsGrid from "@/components/social/InfiniteReelsGrid"

export const metadata = {
  title: "Feed | Faxio",
}

export default function FeedPage() {
  return (
    <main>
      <InfiniteReelsGrid title="Feed" filters={{ type: 'image' }} pageSize={16} order="-created_at" />
    </main>
  )
}
