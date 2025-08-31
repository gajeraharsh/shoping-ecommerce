"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import SmartImage from "@/components/ui/SmartImage"
import { reelsService } from "@/services/modules/reels/reelsService"
import ReelsModal from "@/components/social/ReelsModal"
import ShareDialog from "@/components/social/ShareDialog"
import { Heart, Share2 } from "lucide-react"

export default function InfiniteReelsGrid({
  title = "Reels",
  filters = {},
  pageSize = 12,
  order = "-created_at",
  className = "",
}) {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [ended, setEnded] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const observerRef = useRef(null)
  const sentinelRef = useRef(null)
  const fetchingRef = useRef(false)
  const lastLoadAtRef = useRef(0)
  const itemsLenRef = useRef(0)
  const countRef = useRef(0)
  const idSetRef = useRef(new Set())
  const endedRef = useRef(false)
  const requestCountRef = useRef(0)
  const MAX_REQUESTS = 50

  const effectiveFilters = useMemo(() => ({ ...filters }), [JSON.stringify(filters)])

  const load = useCallback(async (reset = false) => {
    if (fetchingRef.current) return
    if (!reset && requestCountRef.current >= MAX_REQUESTS) { endedRef.current = true; setEnded(true); return }
    const now = Date.now()
    if (!reset && now - lastLoadAtRef.current < 500) {
      // rate limit to avoid burst calls
      return
    }
    // if not reset, ensure there is more to fetch
    if (!reset && (endedRef.current || (itemsLenRef.current >= countRef.current && countRef.current !== 0))) return
    fetchingRef.current = true
    try {
      if (reset) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }
      const currOffset = reset ? 0 : offset
      const { reels, count: total, offset: newOffset } = await reelsService.list({
        filters: effectiveFilters,
        limit: pageSize,
        offset: currOffset,
        order,
      })
      const incoming = Array.isArray(reels) ? reels : []
      // dedupe by id
      const filtered = incoming.filter((r) => {
        const id = r?.id
        if (!id || idSetRef.current.has(id)) return false
        idSetRef.current.add(id)
        return true
      })

      if (reset) {
        setItems(filtered)
        const inferredCount = typeof total === 'number' && total > 0
          ? total
          : (filtered.length < pageSize ? filtered.length : filtered.length + 1) // +1 implies more unknown
        setCount(inferredCount)
        setOffset((newOffset || 0) + filtered.length)
        const reachedEnd = (total === 0 && currOffset === 0) || filtered.length < pageSize
        setEnded(reachedEnd)
        endedRef.current = reachedEnd
      } else {
        setItems((prev) => [...prev, ...filtered])
        setCount((prev) => (typeof total === 'number' && total >= 0 ? total : prev))
        setOffset((prev) => prev + filtered.length)
      }

      // End conditions: if fewer than pageSize arrived, or nothing new added, clamp count to current length
      const noMore = filtered.length === 0 || filtered.length < pageSize
      if (noMore) {
        setCount(() => itemsLenRef.current + filtered.length)
        setEnded(true)
        endedRef.current = true
      }
    } catch (e) {
      setError(e?.message || "Failed to load")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      fetchingRef.current = false
      lastLoadAtRef.current = Date.now()
      requestCountRef.current += 1
    }
  }, [effectiveFilters, order, pageSize, offset])

  useEffect(() => {
    // initial/reset load when filters change
    setItems([])
    setCount(0)
    setOffset(0)
    idSetRef.current = new Set()
    setEnded(false)
    endedRef.current = false
    load(true)
  }, [effectiveFilters, order, pageSize])

  // keep refs in sync to avoid stale closures
  useEffect(() => { itemsLenRef.current = items.length }, [items.length])
  useEffect(() => { countRef.current = count }, [count])

  useEffect(() => {
    if (ended || isLoading) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        if (endedRef.current) { try { observerRef.current?.unobserve(entry.target) } catch {}; return }
        const hasMore = items.length < count
        if (!hasMore || isLoading || isLoadingMore) return
        // Unobserve immediately to avoid cascade triggers while loading
        try { observerRef.current?.unobserve(entry.target) } catch {}
        load(false)
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    )
    observerRef.current.observe(sentinel)
    return () => observerRef.current?.disconnect()
  }, [items.length, count, isLoading, isLoadingMore, load, ended])

  const renderTags = (it) => {
    if (Array.isArray(it?.tags) && it.tags.length) {
      return it.tags.map((t) => `#${String(t).replace(/\s+/g, "")}`).join(" ")
    }
    return ""
  }

  const onCardClick = (it) => {
    setActiveId(it.id)
    setModalOpen(true)
  }

  const currentVariant = useMemo(() => {
    const found = items.find((x) => x.id === activeId)
    return found?.type === "image" ? "fullscreen" : "phone"
  }, [activeId, items])

  const isVideo = (it) => it?.type === "video"

  const handleLike = async (e, it) => {
    e?.stopPropagation?.()
    const id = it?.id
    if (!id) return
    // optimistic update
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: !r.is_like } : r)))
    try {
      if (it.is_like) {
        await reelsService.unlike(id)
      } else {
        await reelsService.like(id)
      }
    } catch (err) {
      // revert on failure
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: it.is_like } : r)))
    }
  }

  const handleShare = (e, it) => {
    e?.stopPropagation?.()
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${base}/reels?reel=${encodeURIComponent(it?.id || '')}`
    setShareUrl(url)
    setShareOpen(true)
  }

  return (
    <section className={`py-10 sm:py-14 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <div className="w-16 h-px bg-black/20 dark:bg-white/20 mb-3"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: Math.min(pageSize, 12) }).map((_, i) => (
              <div key={i} className={
                isVideo({ type: effectiveFilters.type })
                  ? "aspect-[9/16] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                  : "aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              } />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No items to show</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((it) => (
              <div
                key={it.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                  isVideo(it) ? "aspect-[9/16] bg-black" : "aspect-square bg-gray-100 dark:bg-gray-800"
                }`}
                onClick={() => onCardClick(it)}
              >
                <SmartImage src={it.thumbnail_url} alt={it.name || "Reel"} className="h-full w-full object-cover" />

                {isVideo(it) && it.video_url ? (
                  <video
                    src={it.video_url}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    muted
                    playsInline
                    loop
                  />
                ) : null}

                {/* actions */}
                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 text-white z-[2]">
                  <button
                    className={`h-9 w-9 rounded-full grid place-items-center shadow border ${it.is_like ? 'bg-red-500 border-red-500' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                    onClick={(e) => handleLike(e, it)}
                    aria-label="Like"
                  >
                    <Heart size={16} className={it.is_like ? 'fill-white text-white' : ''} />
                  </button>
                  <button
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow"
                    onClick={(e) => handleShare(e, it)}
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {/* caption */}
                <div className="absolute left-3 bottom-3 right-16 text-white z-[2]">
                  <div className="text-xs font-medium truncate">{it?.name || "Reel"}</div>
                  {renderTags(it) ? <div className="text-[10px] opacity-80 line-clamp-1">{renderTags(it)}</div> : null}
                </div>

                {/* gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        )}

        {/* sentinel */}
        <div ref={sentinelRef} className="h-10" />
        {isLoadingMore && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-2">
            {Array.from({ length: Math.min(4, pageSize) }).map((_, i) => (
              <div key={i} className={
                (effectiveFilters.type || "video") === "video"
                  ? "aspect-[9/16] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                  : "aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              } />
            ))}
          </div>
        )}
      </div>

      <ReelsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialReelId={activeId}
        filters={effectiveFilters}
        order={order}
        variant={currentVariant}
      />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title="Check this reel" />
    </section>
  )
}
