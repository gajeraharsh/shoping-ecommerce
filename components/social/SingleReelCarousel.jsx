"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SmartImage from "@/components/ui/SmartImage"
import { reelsService } from "@/services/modules/reels/reelsService"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { useModal } from '@/hooks/useModal'
import { MODAL_TYPES } from '@/features/ui/modalTypes'
import ShareModal from '@/components/social/ShareModal'
import Link from 'next/link'

/**
 * SingleReelCarousel
 * - Shows exactly one reel at a time
 * - Prev/Next buttons on the right side (sticky over content)
 * - Prefetch next page when user passes a threshold within current page
 *   Threshold rule (1-based index within page):
 *   - If pageSize >= 6: trigger at > 50% (e.g., for 10 => 6th reel)
 *   - If pageSize < 6: trigger near end (pageSize - 1) (e.g., for 5 => 4th reel)
 * - Mobile-first: reel occupies full width and nearly full height
 */
export default function SingleReelCarousel({
  title = "Reels",
  filters = {},
  pageSize = 10,
  order = "-created_at",
  className = "",
}) {
  const modal = useModal()
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [ended, setEnded] = useState(false)

  const [activeIndex, setActiveIndex] = useState(0)

  const idSetRef = useRef(new Set())
  const endedRef = useRef(false)
  const fetchingRef = useRef(false)
  const lastServerPageSizeRef = useRef(0)
  // Authoritative offset across renders
  const offsetRef = useRef(0)
  // Track requested offsets to avoid duplicates
  const requestedOffsetsRef = useRef(new Set())

  const effectiveFilters = useMemo(() => ({ ...filters }), [JSON.stringify(filters)])

  const thresholdIndex1Based = useMemo(() => {
    if (pageSize >= 6) return Math.floor(pageSize / 2) + 1 // e.g., 10 => 6
    return Math.max(2, pageSize - 1) // e.g., 5 => 4
  }, [pageSize])

  const withinPageIndex1Based = (globalIndex) => {
    // Map global index into 1..pageSize window for the page it belongs to
    const pos = (globalIndex % pageSize) + 1
    return pos
  }

  const load = useCallback(async (reset = false) => {
    if (fetchingRef.current) return
    if (!reset && endedRef.current) return

    fetchingRef.current = true
    try {
      if (reset) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }
      // Use ref-based offset to avoid stale state
      const currOffset = reset ? 0 : offsetRef.current
      // Prevent duplicate requests for the same page
      if (!reset && requestedOffsetsRef.current.has(currOffset)) {
        return
      }
      requestedOffsetsRef.current.add(currOffset)
      const { reels, count: total } = await reelsService.list({
        filters: effectiveFilters,
        limit: pageSize,
        offset: currOffset,
        order,
      })
      const incoming = Array.isArray(reels) ? reels : []
      lastServerPageSizeRef.current = incoming.length
      // dedupe
      const filtered = incoming.filter((r) => {
        const id = r?.id
        if (!id || idSetRef.current.has(id)) return false
        idSetRef.current.add(id)
        return true
      })

      if (reset) {
        setItems(filtered)
        setCount(typeof total === 'number' && total >= 0 ? total : filtered.length)
        // Advance offset by received length, or pageSize if zero to break echo loops
        const advanceBy = incoming.length > 0 ? incoming.length : pageSize
        const nextOffset = currOffset + advanceBy
        offsetRef.current = nextOffset
        setOffset(nextOffset)
        const atEnd = (typeof total === 'number' && total >= 0)
          ? nextOffset >= total
          : incoming.length < pageSize
        setEnded(atEnd)
        endedRef.current = atEnd
        setActiveIndex(0)
      } else {
        setItems((prev) => [...prev, ...filtered])
        setCount((prev) => (typeof total === 'number' && total > 0 ? total : prev))
        // Advance offset by received length, or pageSize if zero to break echo loops
        const advanceBy = incoming.length > 0 ? incoming.length : pageSize
        const nextOffset = currOffset + advanceBy
        offsetRef.current = nextOffset
        setOffset(nextOffset)
        if (typeof total === 'number' && total > 0 && nextOffset >= total) {
          setEnded(true)
          endedRef.current = true
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to load reels")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      fetchingRef.current = false
      // On success or failure we keep the requested offset marked; if you want to allow retry on error,
      // uncomment the following line to delete from the set on error.
      // requestedOffsetsRef.current.delete(currOffset)
    }
  }, [effectiveFilters, order, pageSize, offset])

  useEffect(() => {
    // initial or when filters/order/pageSize change
    setItems([])
    setCount(0)
    setOffset(0)
    offsetRef.current = 0
    requestedOffsetsRef.current = new Set()
    setEnded(false)
    endedRef.current = false
    idSetRef.current = new Set()
    setActiveIndex(0)
    load(true)
  }, [effectiveFilters, order, pageSize])

  // Prefetch when crossing threshold within current page window
  useEffect(() => {
    if (items.length === 0) return
    const pos = withinPageIndex1Based(activeIndex)
    const hasMore = (!endedRef.current) && ((count === 0) || (items.length < count) || (lastServerPageSizeRef.current >= pageSize))
    if (hasMore && pos >= thresholdIndex1Based && !isLoadingMore && !fetchingRef.current) {
      // prefetch next page
      load(false)
    }
  }, [activeIndex, items.length, count, pageSize, thresholdIndex1Based, isLoadingMore, load])

  const isVideo = (it) => it?.type === "video"

  const handleLike = async (it) => {
    const id = it?.id
    if (!id) return
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

  const handleShare = (it) => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${base}/trendzs?reel=${encodeURIComponent(it?.id || '')}`
    modal.open({
      type: MODAL_TYPES.CUSTOM,
      props: {
        Component: ShareModal,
        title: 'Share Reel',
        url,
      },
    })
  }

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1))
  const goNext = () => setActiveIndex((i) => Math.min(items.length - 1, i + 1))

  const activeItem = items[activeIndex]

  return (
    <section className={`bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-5xl mx-auto w-full px-0 sm:px-4">
        <div className="px-4 sm:px-0 pt-6 sm:pt-10">
          {/* <div className="w-16 h-px bg-black/20 dark:bg-white/20 mb-3"></div> */}
          {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">{title}</h1> */}
        </div>

        {isLoading ? (
          <div className="h-[80vh] grid place-items-center">
            <div className="text-sm text-gray-500">Loading reels…</div>
          </div>
        ) : error ? (
          <div className="h-[80vh] grid place-items-center">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          </div>
        ) : items.length === 0 ? (
          <div className="h-[80vh] grid place-items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">No reels to show</div>
          </div>
        ) : (
          <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto md:max-w-4xl">
            <div className="md:flex md:items-center md:justify-center md:gap-5">
              {/* Media card */}
              <div className="relative mx-auto bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-lg md:flex-shrink-0" style={{ height: 'calc(100vh - 160px)', width: '100%' }}>
                {/* Media */}
                {isVideo(activeItem) && activeItem?.video_url ? (
                  <video
                    src={activeItem.video_url}
                    className="h-full w-full object-cover"
                    autoPlay
                    controls={false}
                    playsInline
                    loop
                    muted
                  />
                ) : (
                  <SmartImage src={activeItem?.thumbnail_url} alt={activeItem?.name || 'Reel'} className="h-full w-full object-cover" />
                )}

                {/* Overlay gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Caption */}
                <div className="absolute left-4 bottom-4 right-24 text-white z-10">
                  <div className="text-base font-medium truncate">{activeItem?.name || "Reel"}</div>
                  {Array.isArray(activeItem?.tags) && activeItem.tags.length ? (
                    <div className="text-xs opacity-80 line-clamp-1">{activeItem.tags.map((t) => `#${String(t).replace(/\s+/g, "")}`).join(" ")}</div>
                  ) : null}
                </div>

                {/* Shop Now CTA (mobile priority) */}
                {activeItem?.product_id ? (
                  <div className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0)+12px)] z-20 flex justify-center md:justify-start md:left-4 md:right-auto">
                    <Link
                      href={`/products/${encodeURIComponent(activeItem.product_id)}`}
                      className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-medium shadow-lg border border-gray-200/80 hover:bg-gray-50 active:scale-[0.99] transition md:px-5 md:py-2.5"
                      aria-label="Shop Now"
                      prefetch={false}
                    >
                      Shop now
                    </Link>
                  </div>
                ) : null}

                {/* Right-side controls (overlay on mobile) */}
                <div className="md:hidden absolute right-3 bottom-[calc(env(safe-area-inset-bottom,0)+64px)] flex flex-col items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 grid place-items-center text-white disabled:opacity-40"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLike(activeItem)}
                    className={`h-10 w-10 rounded-full grid place-items-center border shadow ${activeItem?.is_like ? 'bg-red-500 border-red-500 text-white' : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'}`}
                    aria-label="Like"
                  >
                    <Heart size={18} className={activeItem?.is_like ? 'fill-white' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(activeItem)}
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 grid place-items-center text-white"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIndex >= items.length - 1}
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 grid place-items-center text-white disabled:opacity-40"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Progress indicator */}
                <div className="absolute left-0 right-0 top-2 flex justify-center z-20">
                  <div className="px-3 py-1 rounded-full bg-black/40 text-white text-xs">{activeIndex + 1} / {Math.max(items.length, count || items.length)}</div>
                </div>
              </div>

              {/* Right-side controls (outside card on desktop) */}
              <div className="hidden md:flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="h-11 w-11 rounded-full bg-white shadow-lg border border-gray-200/80 text-gray-900 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleLike(activeItem)}
                  className={`h-11 w-11 rounded-full grid place-items-center shadow-lg border ${activeItem?.is_like ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200/80 text-gray-900 hover:bg-gray-50'}`}
                  aria-label="Like"
                >
                  <Heart size={18} className={activeItem?.is_like ? 'fill-white' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(activeItem)}
                  className="h-11 w-11 rounded-full bg-white shadow-lg border border-gray-200/80 text-gray-900 hover:bg-gray-50"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={activeIndex >= items.length - 1}
                  className="h-11 w-11 rounded-full bg-white shadow-lg border border-gray-200/80 text-gray-900 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle loader display when prefetching */}
        {isLoadingMore ? (
          <div className="py-3 text-center text-xs text-gray-500">Loading more…</div>
        ) : null}
      </div>
    </section>
  )
}
