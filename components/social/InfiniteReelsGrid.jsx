"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useRouter, usePathname } from 'next/navigation'
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
  enableInfinite = false,
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
  const [initialReelData, setInitialReelData] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const observerRef = useRef(null)
  const sentinelRef = useRef(null)
  const fetchingRef = useRef(false)
  const lastLoadAtRef = useRef(0)
  const itemsLenRef = useRef(0)
  const countRef = useRef(0)
  const lastPageSizeRef = useRef(0) // deduped page size actually appended
  const lastServerPageSizeRef = useRef(0) // raw server page size received
  const idSetRef = useRef(new Set())
  const endedRef = useRef(false)
  const requestCountRef = useRef(0)
  const MAX_REQUESTS = 50

  const effectiveFilters = useMemo(() => ({ ...filters }), [JSON.stringify(filters)])

  // Deep-link: open modal by reel id from query param
  const router = useRouter()
  const pathname = usePathname()

  const isAuthed = useCallback(() => {
    try { return typeof window !== 'undefined' && !!localStorage.getItem('token') } catch { return false }
  }, [])

  const redirectToLogin = useCallback(() => {
    try {
      const qs = typeof window !== 'undefined' ? (window.location.search || '') : ''
      const back = qs ? `${pathname}${qs}` : pathname
      router.push(`/auth/login?redirect=${encodeURIComponent(back)}`)
    } catch {
      router.push('/auth/login')
    }
  }, [router, pathname])
  useEffect(() => {
    const reelId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('reel') : null
    if (!reelId) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await reelsService.getById(reelId)
        const reel = data?.reel || data
        if (cancelled) return
        setInitialReelData(reel || null)
        setActiveId(reelId)
        setModalOpen(true)
      } catch (_) {
        // still attempt to open modal with id so user sees loader/empty state
        if (cancelled) return
        setActiveId(reelId)
        setModalOpen(true)
      }
    })()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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
      lastServerPageSizeRef.current = incoming.length
      // dedupe by id
      const filtered = incoming.filter((r) => {
        const id = r?.id
        if (!id || idSetRef.current.has(id)) return false
        idSetRef.current.add(id)
        return true
      })
      lastPageSizeRef.current = filtered.length

      const advanceBy = incoming.length // advance by server page size to avoid overlap even if dedupe removed items
      if (reset) {
        setItems(filtered)
        const inferredCount = typeof total === 'number' && total > 0
          ? total
          : (filtered.length < pageSize ? filtered.length : filtered.length + 1) // +1 implies more unknown
        setCount(inferredCount)
        setOffset((newOffset || 0) + advanceBy)
        // Reach end conditions (avoid premature end when total is known)
        let reachedEnd = false
        if (typeof total === 'number' && total >= 0) {
          const projected = filtered.length
          reachedEnd = projected >= total || filtered.length === 0
        } else {
          reachedEnd = filtered.length < pageSize
        }
        // Also end when the pagination offset reaches/exceeds total
        if (!reachedEnd && typeof total === 'number' && total >= 0) {
          const afterOffset = ((newOffset || 0) + advanceBy)
          if (afterOffset >= total) reachedEnd = true
        }
        setEnded(reachedEnd)
        endedRef.current = reachedEnd
      } else {
        setItems((prev) => [...prev, ...filtered])
        setCount((prev) => (typeof total === 'number' && total > 0 ? total : prev))
        setOffset((newOffset || 0) + advanceBy)
        if ((newOffset || 0) >= total) {
          setEnded(true)
          endedRef.current = true
        }
      }

      // End conditions
      if (typeof total === 'number' && total >= 0) {
        // Using authoritative total from server; don't end on duplicate-only page
        const projected = itemsLenRef.current + filtered.length
        let shouldEnd = projected >= total
        // Also end when the pagination offset reaches/exceeds total
        const afterOffset = ((newOffset || 0) + advanceBy)
        if (!shouldEnd && afterOffset >= total) shouldEnd = true
        if (shouldEnd) {
          setEnded(true)
          endedRef.current = true
        }
      } else {
        // Heuristic when total is unknown
        const noMore = filtered.length === 0 || filtered.length < pageSize
        if (noMore) {
          setCount(() => itemsLenRef.current + filtered.length)
          setEnded(true)
          endedRef.current = true
        }
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
    lastServerPageSizeRef.current = 0
    load(true)
  }, [effectiveFilters, order, pageSize])

  // keep refs in sync to avoid stale closures
  useEffect(() => { itemsLenRef.current = items.length }, [items.length])
  useEffect(() => { countRef.current = count }, [count])

  useEffect(() => {
    if (!enableInfinite) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        if (endedRef.current) { try { observerRef.current?.unobserve(entry.target) } catch {}; return }
        const currentLen = itemsLenRef.current
        const totalCount = countRef.current
        const hasMore = (totalCount === 0) || (currentLen < totalCount) || (lastServerPageSizeRef.current >= pageSize)
        if (!hasMore || isLoading || isLoadingMore || fetchingRef.current) return
        load(false)
      },
      { root: null, rootMargin: "1200px", threshold: 0 }
    )
    observerRef.current.observe(sentinel)
    return () => observerRef.current?.disconnect()
  }, [enableInfinite, pageSize, isLoading, isLoadingMore, load, ended])

  const renderTags = (it) => {
    if (Array.isArray(it?.tags) && it.tags.length) {
      return it.tags.map((t) => `#${String(t).replace(/\s+/g, "")}`).join(" ")
    }
    return ""
  }

  const onCardClick = (it) => {
    setActiveId(it.id)
    setModalOpen(true)
    // reflect in URL for deep-link/share
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search || "") : new URLSearchParams()
      params.set('reel', String(it.id))
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(nextUrl, { scroll: false })
    } catch {}
  }

  const currentVariant = useMemo(() => {
    const found = items.find((x) => x.id === activeId)
    return found?.type === "image" ? "fullscreen" : "phone"
  }, [activeId, items])

  const isVideo = (it) => it?.type === "video"

  // simple mobile detection for using system share
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false
    try {
      // Prefer viewport-based heuristic
      const smallViewport = window.matchMedia && window.matchMedia('(max-width: 768px)').matches
      // Basic UA fallback
      const ua = navigator.userAgent || navigator.vendor || ''
      const uaMobile = /android|iphone|ipad|ipod|iemobile|blackberry|opera mini/i.test(ua)
      return smallViewport || uaMobile
    } catch {
      return false
    }
  }, [])

  const handleLike = async (e, it) => {
    e?.stopPropagation?.()
    const id = it?.id
    if (!id) return
    if (!isAuthed()) { redirectToLogin(); return }
    // optimistic update with count
    const prevLiked = !!it.is_like
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: !prevLiked, like_count: (r.like_count || 0) + (prevLiked ? -1 : 1) } : r)))
    try {
      if (prevLiked) {
        await reelsService.unlike(id)
      } else {
        await reelsService.like(id)
      }
    } catch (err) {
      // revert on failure
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: prevLiked, like_count: (r.like_count || 0) + (prevLiked ? 1 : -1) } : r)))
    }
  }

  const handleShare = async (e, it) => {
    e?.stopPropagation?.()
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${base}/feed?reel=${encodeURIComponent(it?.id || '')}`
    const title = it?.name || 'Check this reel'
    const text = Array.isArray(it?.tags) && it.tags.length
      ? `${title} ${it.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`).join(' ')}`
      : title

    // Mobile behavior: never open modal
    if (isMobile()) {
      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title, text, url })
        } else if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(url)
        }
      } catch (_) {
        // swallow; do not open modal on mobile as per requirement
      }
      return
    }

    setShareUrl(url)
    setShareOpen(true)
  }

  // Lightweight video hover preview: do not load until hover
  const startPreview = useCallback((containerEl) => {
    try {
      const v = containerEl?.querySelector?.('video[data-src]')
      if (!v) return
      if (!v.getAttribute('src')) {
        const src = v.getAttribute('data-src')
        if (src) {
          v.setAttribute('src', src)
          // Ensure the browser starts fetching only now
          try { v.load() } catch {}
        }
      }
      try { v.play?.() } catch {}
    } catch {}
  }, [])

  const stopPreview = useCallback((containerEl) => {
    try {
      const v = containerEl?.querySelector?.('video[data-src]')
      if (!v) return
      try { v.pause?.() } catch {}
      // Detach src to stop network and free resources
      try {
        v.removeAttribute('src')
        v.load()
      } catch {}
    } catch {}
  }, [])

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
                onMouseEnter={(e) => { if (isVideo(it)) startPreview(e.currentTarget) }}
                onMouseLeave={(e) => { if (isVideo(it)) stopPreview(e.currentTarget) }}
              >
                <SmartImage src={it.thumbnail_url} alt={it.name || "Reel"} className="h-full w-full object-cover" />

                {isVideo(it) && it.video_url ? (
                  <video
                    // Do not set src initially; attach on hover
                    data-src={it.video_url}
                    preload="none"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    muted
                    playsInline
                    loop
                  />
                ) : null}

                {/* actions */}
                <div className="absolute right-2 bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-5 xl:bottom-6 flex flex-col items-center gap-2 sm:gap-3 text-white z-[2]">
                  <button
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full grid place-items-center shadow border ${it.is_like ? 'bg-red-500 border-red-500' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                    onClick={(e) => handleLike(e, it)}
                    aria-label="Like"
                  >
                    <Heart size={16} className={it.is_like ? 'fill-white text-white' : ''} />
                  </button>
                  <button
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow"
                    onClick={(e) => handleShare(e, it)}
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {/* caption */}
                <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 right-14 sm:right-16 text-white z-[2]">
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
        {/* Load more button (show only when more data is available) */}
        {(((count > 0) ? (offset < count) : (lastServerPageSizeRef.current >= pageSize))
          && !ended && !isLoading && !isLoadingMore) && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => load(false)}
            >
              Load more
            </button>
          </div>
        )}
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
        onClose={() => {
          setModalOpen(false)
          setActiveId(null)
          setInitialReelData(null)
          setShareOpen(false)
          setShareUrl("")
          try {
            const params = new URLSearchParams(searchParams?.toString?.() || "")
            params.delete('reel')
            const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
            router.replace(nextUrl, { scroll: false })
          } catch {}
        }}
        initialReelId={activeId}
        initialReelData={initialReelData}
        filters={effectiveFilters}
        order={order}
        variant={currentVariant}
        forceHome={false}
        singleOnly
      />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title="Check this reel" />
    </section>
  )
}
