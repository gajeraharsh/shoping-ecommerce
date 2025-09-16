"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SmartImage from "@/components/ui/SmartImage"
import { reelsService } from "@/services/modules/reels/reelsService"
import { Heart, Share2, Volume2, VolumeX } from "lucide-react"
import { useModal } from '@/hooks/useModal'
import { MODAL_TYPES } from '@/features/ui/modalTypes'
import ShareModal from '@/components/social/ShareModal'

/**
 * MobileReelsFeed
 * - Full height per reel (minus header)
 * - Vertical swipe with CSS scroll-snap
 * - Auto-play visible videos, pause others
 * - Prefetch next page when user crosses 80% of the current page window
 * - Proper skeletons on initial and incremental loads
 */
export default function MobileReelsFeed({
  title = "Trendzs",
  filters = { type: "video" },
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

  const containerRef = useRef(null)
  const idSetRef = useRef(new Set())
  const fetchingRef = useRef(false)
  const endedRef = useRef(false)
  const lastServerPageSizeRef = useRef(0)
  // Use a ref to maintain the authoritative pagination offset across renders
  const offsetRef = useRef(0)
  // Track which offsets have been requested to avoid duplicate page fetches
  const requestedOffsetsRef = useRef(new Set())
  const [activeIndex, setActiveIndex] = useState(0)
  // Audio state with persistence
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.7)
  // Pull-to-refresh state
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startYRef = useRef(0)
  const pullingRef = useRef(false)
  const vibratedTopRef = useRef(false)
  const vibratedBottomRef = useRef(false)
  // Prefetch guards
  const lastPrefetchPageRef = useRef(-1)
  const lastLoadAtRef = useRef(0)
  const requestCountRef = useRef(0)
  const MAX_REQUESTS = 50
  // Bottom sentinel for robust infinite load fallback
  const sentinelRef = useRef(null)

  // Track header height and set a CSS variable for layout
  useEffect(() => {
    const computeHeader = () => {
      try {
        const header = document.querySelector("header, #site-header, .site-header")
        const h = header ? header.getBoundingClientRect().height : 56
        document.documentElement.style.setProperty("--header-h", `${Math.round(h)}px`)
      } catch {}
    }
    computeHeader()
    window.addEventListener("resize", computeHeader)
    return () => window.removeEventListener("resize", computeHeader)
  }, [])

  // Load persisted audio preferences
  useEffect(() => {
    try {
      const m = localStorage.getItem('reels_muted')
      const v = localStorage.getItem('reels_volume')
      if (m === 'true' || m === 'false') setMuted(m === 'true')
      if (v) {
        const nv = Number(v)
        if (!Number.isNaN(nv) && nv >= 0 && nv <= 1) setVolume(nv)
      }
    } catch {}
  }, [])

  const effectiveFilters = useMemo(() => ({ ...filters }), [JSON.stringify(filters)])

  const load = useCallback(async (reset = false) => {
    if (fetchingRef.current) return
    if (!reset && endedRef.current) return
    if (!reset && requestCountRef.current >= MAX_REQUESTS) { endedRef.current = true; setEnded(true); return }
    const now = Date.now()
    if (!reset && now - lastLoadAtRef.current < 500) {
      // rate limit to avoid burst calls
      return
    }
    fetchingRef.current = true
    try {
      if (reset) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }
      // Always derive next offset locally from a ref to avoid stale state
      const currOffset = reset ? 0 : offsetRef.current
      const requestedOffsetUsed = currOffset
      // Guard against duplicate requests for the same offset
      if (!reset && requestedOffsetsRef.current.has(currOffset)) {
        return
      }
      // Mark this offset as requested (in-flight)
      requestedOffsetsRef.current.add(currOffset)
      console.debug('[MobileReelsFeed] load', { reset, currOffset, pageSize, filters: effectiveFilters, order })
      const { reels, count: total } = await reelsService.list({
        filters: effectiveFilters,
        limit: pageSize,
        offset: currOffset,
        order,
      })
      const incoming = Array.isArray(reels) ? reels : []
      console.debug('[MobileReelsFeed] response', { received: incoming.length, total })
      lastServerPageSizeRef.current = incoming.length
      const filtered = incoming.filter((r) => {
        const id = r?.id
        if (!id || idSetRef.current.has(id)) return false
        idSetRef.current.add(id)
        return true
      })
      if (reset) {
        setItems(filtered)
        setCount(typeof total === 'number' && total >= 0 ? total : filtered.length)
        // Advance offset locally (requested offset + received length or requested pageSize if none)
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
        console.debug('[MobileReelsFeed] advance(reset)', { advanceBy, nextOffset, atEnd })
      } else {
        setItems((prev) => [...prev, ...filtered])
        setCount((prev) => (typeof total === 'number' && total > 0 ? total : prev))
        // Advance offset locally (requested offset + received length or requested pageSize if none)
        const advanceBy = incoming.length > 0 ? incoming.length : pageSize
        const nextOffset = currOffset + advanceBy
        offsetRef.current = nextOffset
        setOffset(nextOffset)
        if (typeof total === 'number' && total > 0 && nextOffset >= total) {
          setEnded(true)
          endedRef.current = true
        }
        // If server returned no new items for a subsequent page, move forward by pageSize to break out of loop
        // End only if API signals fewer than a full page or count boundary reached (handled above)
        console.debug('[MobileReelsFeed] advance(more)', { advanceBy, nextOffset, ended: endedRef.current })
      }
    } catch (e) {
      // On error, allow retry for this exact offset by removing it from the requested set
      try { requestedOffsetsRef.current.delete(requestedOffsetUsed) } catch {}
      setError(e?.message || "Failed to load reels")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      fetchingRef.current = false
      lastLoadAtRef.current = Date.now()
      requestCountRef.current += 1
    }
  }, [effectiveFilters, order, pageSize, offset])

  // initial load / when filters change
  useEffect(() => {
    setItems([])
    setCount(0)
    setOffset(0)
    offsetRef.current = 0
    requestedOffsetsRef.current = new Set()
    setEnded(false)
    endedRef.current = false
    idSetRef.current = new Set()
    lastPrefetchPageRef.current = -1
    setActiveIndex(0)
    load(true)
  }, [effectiveFilters, order, pageSize])

  // Prefetch when user crosses 80% within current page window (only once per page window)
  useEffect(() => {
    if (items.length === 0) return
    const within = (activeIndex % pageSize) / pageSize
    const currentPage = Math.floor(activeIndex / pageSize)
    const hasMore = (!endedRef.current) && ((count === 0) || (items.length < count) || (lastServerPageSizeRef.current >= pageSize))
    if (hasMore && within >= 0.8 && !isLoadingMore && !fetchingRef.current) {
      if (currentPage > lastPrefetchPageRef.current) {
        lastPrefetchPageRef.current = currentPage
        console.debug('[MobileReelsFeed] prefetch threshold hit', { currentPage, activeIndex, within })
        load(false)
      }
    }
  }, [activeIndex, items.length, count, pageSize, isLoadingMore, load])

  // Fallback: observe a sentinel at the bottom to trigger load when visible
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const root = containerRef.current || null
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const hasMore = (!endedRef.current) && ((count === 0) || (items.length < count) || (lastServerPageSizeRef.current >= pageSize))
        if (hasMore && !isLoadingMore && !fetchingRef.current) {
          console.debug('[MobileReelsFeed] sentinel visible - loading more')
          load(false)
        }
      })
    }, { root, threshold: 0.1 })
    io.observe(sentinel)
    return () => io.disconnect()
  }, [items.length, count, pageSize, isLoadingMore, load])

  // Determine current active index from scroll position with snap
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const h = el.clientHeight
        if (h > 0) {
          const idx = Math.round(el.scrollTop / h)
          setActiveIndex((prev) => (idx !== prev ? Math.max(0, Math.min(items.length - 1, idx)) : prev))
        }
        ticking = false
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [items.length])

  // Pull-to-refresh and haptic feedback handlers
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouchStart = (e) => {
      if (refreshing) return
      startYRef.current = e.touches?.[0]?.clientY ?? 0
      pullingRef.current = el.scrollTop <= 0
      vibratedTopRef.current = false
      vibratedBottomRef.current = false
    }
    const onTouchMove = (e) => {
      if (refreshing) return
      const y = e.touches?.[0]?.clientY ?? 0
      const dy = y - startYRef.current
      const atTop = el.scrollTop <= 0
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
      // Pull to refresh when at top and dragging down
      if (pullingRef.current && dy > 0 && atTop) {
        e.preventDefault()
        setPull(Math.min(100, dy))
        if (!vibratedTopRef.current && dy > 70) {
          try { navigator.vibrate?.(10) } catch {}
          vibratedTopRef.current = true
        }
      }
      // Haptic at bottom edge when pushing further
      if (dy < 0 && atBottom && !vibratedBottomRef.current) {
        try { navigator.vibrate?.(10) } catch {}
        vibratedBottomRef.current = true
      }
    }
    const onTouchEnd = async () => {
      if (refreshing) return
      const THRESH = 70
      if (pull >= THRESH) {
        setRefreshing(true)
        try {
          await load(true)
        } finally {
          setRefreshing(false)
          setPull(0)
        }
      } else {
        setPull(0)
      }
      pullingRef.current = false
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [pull, refreshing, load])

  // Auto play/pause based on visibility using IntersectionObserver
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const videos = Array.from(root.querySelectorAll('video'))
    // Apply current audio prefs to videos
    videos.forEach((v) => {
      try { v.muted = muted } catch {}
      try { v.volume = volume } catch {}
    })
    const handler = (entries) => {
      entries.forEach((entry) => {
        const v = entry.target
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          try { v.play?.() } catch {}
        } else {
          try { v.pause?.() } catch {}
        }
      })
    }
    const io = new IntersectionObserver(handler, { root, threshold: [0.0, 0.6, 1.0] })
    videos.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [items, muted, volume])

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev
      try { localStorage.setItem('reels_muted', String(next)) } catch {}
      // Apply immediately
      const root = containerRef.current
      if (root) {
        const vids = root.querySelectorAll('video')
        vids.forEach((v) => { try { v.muted = next } catch {} })
      }
      return next
    })
  }

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

  const ReelSkeleton = () => (
    <div className="snap-start shrink-0 w-full" style={{ height: 'calc(100vh - var(--header-h, 56px))' }}>
      <div className="relative h-full w-full bg-black">
        <div className="absolute inset-0 animate-pulse bg-gray-900/60" />
      </div>
    </div>
  )

  return (
    <section className={`bg-white dark:bg-gray-900 ${className}`}>
      {/* Title hidden on mobile to maximize space, but kept for a11y */}
      <h1 className="sr-only">{title}</h1>

      {isLoading ? (
        <div ref={containerRef} className="h-[calc(100vh-var(--header-h,56px))] overflow-y-auto snap-y snap-mandatory no-scrollbar">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReelSkeleton key={i} />
          ))}
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
        <div
          ref={containerRef}
          className="h-[calc(100vh-var(--header-h,56px))] overflow-y-auto snap-y snap-mandatory no-scrollbar"
        >
          {/* Pull-to-refresh indicator */}
          <div style={{ height: pull ? `${pull}px` : 0 }} className="flex items-end justify-center text-xs text-gray-500 overflow-hidden">
            <div className="pb-2">{refreshing ? 'Refreshing…' : (pull >= 70 ? 'Release to refresh' : 'Pull to refresh')}</div>
          </div>
          {/* Reel counter */}
          <div className="sticky top-2 z-30 w-full flex justify-center pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/50 text-white text-xs">{activeIndex + 1} / {Math.max(items.length, count || items.length)}</div>
          </div>
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="snap-start shrink-0 w-full"
              style={{ height: 'calc(100vh - var(--header-h, 56px))' }}
            >
              <div className="relative h-full w-full bg-black">
                {isVideo(it) && it?.video_url ? (
                  <video
                    src={it.video_url}
                    className="h-full w-full object-cover"
                    controls={false}
                    playsInline
                    loop
                    muted={muted}
                  />
                ) : (
                  <SmartImage src={it?.thumbnail_url} alt={it?.name || 'Reel'} className="h-full w-full object-cover" />
                )}

                {/* gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* caption */}
                <div className="absolute left-4 bottom-4 right-24 text-white z-10">
                  <div className="text-base font-medium truncate">{it?.name || "Reel"}</div>
                  {Array.isArray(it?.tags) && it.tags.length ? (
                    <div className="text-xs opacity-80 line-clamp-1">{it.tags.map((t) => `#${String(t).replace(/\s+/g, "")}`).join(" ")}</div>
                  ) : null}
                </div>

                {/* right controls */}
                <div className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom,0)+64px)] flex flex-col items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 grid place-items-center text-white"
                    aria-label="Mute toggle"
                  >
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLike(it)}
                    className={`h-10 w-10 rounded-full grid place-items-center border shadow ${it?.is_like ? 'bg-red-500 border-red-500 text-white' : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'}`}
                    aria-label="Like"
                  >
                    <Heart size={18} className={it?.is_like ? 'fill-white' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(it)}
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 grid place-items-center text-white"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* incremental skeletons while next page loads */}
          {isLoadingMore ? (
            <>
              <ReelSkeleton />
              {/* Optional: show a second skeleton to make progression obvious */}
              <ReelSkeleton />
            </>
          ) : null}
          {/* Sentinel element for bottom intersection observer */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </div>
      )}
    </section>
  )
}
