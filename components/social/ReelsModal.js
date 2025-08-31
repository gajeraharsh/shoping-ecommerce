"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import SmartImage from "@/components/ui/SmartImage"
import { reelsService } from "@/services/modules/reels/reelsService"
import ShareDialog from "@/components/social/ShareDialog"

export default function ReelsModal({ isOpen, onClose, initialReelId, initialReelData = null, filters = {}, order = "-created_at", variant = 'phone', forceHome = true }) {
  const [allReels, setAllReels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const containerRef = useRef(null)
  const itemRefs = useRef([])
  const videoRefs = useRef(new Map())
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchDeltaX = useRef(0)
  const isSwiping = useRef(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const effective = forceHome ? { is_display_home: true, ...filters } : { ...filters }
      const reels = await reelsService.fetchAll({ filters: effective, order, batchSize: 50 })
      let list = reels || []
      // If deep-linked reel data is provided and not already present, include it at the start
      if (initialReelData && initialReelData.id && !list.find((r) => r.id === initialReelData.id)) {
        list = [initialReelData, ...list]
      }
      setAllReels(list)
      if (initialReelId) {
        const found = list.findIndex((r) => r.id === initialReelId)
        setIndex(found >= 0 ? found : 0)
      } else {
        setIndex(0)
      }
    } catch (e) {
      setError(e?.message || "Failed to load reels")
    } finally {
      setLoading(false)
    }
  }, [filters, order, initialReelId, initialReelData, forceHome])

  useEffect(() => {
    if (!isOpen) return
    loadAll()
  }, [isOpen, loadAll])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.()
      if (e.key === "ArrowDown") scrollToIndex(index + 1)
      if (e.key === "ArrowUp") scrollToIndex(index - 1)
      if (e.key === "ArrowRight") scrollToIndex(index + 1)
      if (e.key === "ArrowLeft") scrollToIndex(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, index])

  const scrollToIndex = useCallback(
    (i) => {
      if (!itemRefs.current[i]) return
      itemRefs.current[i].scrollIntoView({ behavior: "smooth", block: "nearest" })
    },
    []
  )

  // After data loads, scroll to initial reel
  useEffect(() => {
    if (!isOpen) return
    if (!allReels.length) return
    const el = itemRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "nearest" })
    }
  }, [isOpen, allReels.length])

  const handleLike = async (reel) => {
    if (!reel?.id) return
    const id = reel.id
    const prevLiked = !!reel.is_like
    // optimistic update
    setAllReels((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: !prevLiked, like_count: (r.like_count || 0) + (prevLiked ? -1 : 1) } : r)))
    try {
      if (prevLiked) await reelsService.unlike(id)
      else await reelsService.like(id)
    } catch (e) {
      // revert
      setAllReels((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: prevLiked, like_count: r.like_count } : r)))
    }
  }

  const handleShare = (reel) => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${base}/reels?reel=${encodeURIComponent(reel?.id || '')}`
    setShareUrl(url)
    setShareOpen(true)
  }

  // IntersectionObserver to set active index and control video play/pause
  useEffect(() => {
    if (!isOpen) return
    const root = containerRef.current
    if (!root) return

    const handleIntersect = (entries) => {
      let topMost = null
      let topMostRatio = 0
      entries.forEach((entry) => {
        const idx = Number(entry.target.getAttribute("data-index"))
        if (entry.intersectionRatio > topMostRatio) {
          topMost = idx
          topMostRatio = entry.intersectionRatio
        }

        // Control play/pause for the entry's video
        const vid = videoRefs.current.get(idx)
        if (vid) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            try { vid.play() } catch {}
          } else {
            try { vid.pause() } catch {}
          }
        }
      })
      if (topMost != null && !Number.isNaN(topMost)) {
        setIndex(topMost)
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
    })

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isOpen, allReels.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-[130] p-2.5 rounded-full bg-black/70 text-white hover:bg-black/80 shadow-md"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {variant === 'fullscreen' ? (
        // Fullscreen layout (image reels): show left/right navigation and friendly controls
        <div className="absolute inset-0">
          {/* Large invisible click zones for easy navigation */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 z-[105] cursor-pointer"
            onClick={() => scrollToIndex(index - 1)}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/3 z-[105] cursor-pointer"
            onClick={() => scrollToIndex(index + 1)}
          />

          {/* Visible left/right arrows with labels - aligned via flex containers */}
          <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[110] flex flex-col items-center gap-1 select-none">
            <button
              onClick={() => scrollToIndex(index - 1)}
              disabled={index === 0}
              className="p-4 rounded-full bg-black/45 backdrop-blur text-white hover:bg-black/60 disabled:opacity-40"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
            <span className="text-white/80 text-[10px] sm:text-xs">Prev</span>
          </div>
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[110] flex flex-col items-center gap-1 select-none">
            <button
              onClick={() => scrollToIndex(index + 1)}
              disabled={index >= allReels.length - 1}
              className="p-4 rounded-full bg-black/45 backdrop-blur text-white hover:bg-black/60 disabled:opacity-40"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
            <span className="text-white/80 text-[10px] sm:text-xs">Next</span>
          </div>

          {/* Counter removed per request */}

          <div
            ref={containerRef}
            className="absolute inset-0 overflow-y-auto snap-y snap-mandatory scroll-smooth"
            onTouchStart={(e) => {
              if (e.touches?.length !== 1) return
              touchStartX.current = e.touches[0].clientX
              touchStartY.current = e.touches[0].clientY
              touchDeltaX.current = 0
              isSwiping.current = false
            }}
            onTouchMove={(e) => {
              if (e.touches?.length !== 1) return
              const dx = e.touches[0].clientX - touchStartX.current
              const dy = e.touches[0].clientY - touchStartY.current
              // begin swipe only if horizontal movement dominates
              if (!isSwiping.current && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.15) {
                isSwiping.current = true
              }
              if (isSwiping.current) {
                touchDeltaX.current = dx
                e.preventDefault()
              }
            }}
            onTouchEnd={() => {
              if (!isSwiping.current) return
              const threshold = 35
              const dx = touchDeltaX.current
              if (dx <= -threshold) {
                // swipe left => next
                scrollToIndex(index + 1)
              } else if (dx >= threshold) {
                // swipe right => prev
                scrollToIndex(index - 1)
              }
              isSwiping.current = false
              touchDeltaX.current = 0
            }}
          >
            {loading ? (
              <div className="min-h-screen flex items-center justify-center text-white/80 text-sm">Loading reels…</div>
            ) : error ? (
              <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">{error}</div>
            ) : !allReels.length ? (
              <div className="min-h-screen flex items-center justify-center text-white/70 text-sm">No reels</div>
            ) : (
              allReels.map((reel, i) => (
                <div
                  key={reel.id}
                  data-index={i}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className="snap-start min-h-screen flex items-center justify-center relative bg-black"
                >
                  {reel.video_url ? (
                    <SmartImage
                      src={reel.thumbnail_url}
                      alt={reel.name || 'Reel'}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <SmartImage
                      src={reel.thumbnail_url}
                      alt={reel.name || 'Reel'}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}

                  {/* Side actions */}
                  <div className="absolute right-6 bottom-28 flex flex-col items-center gap-4 text-white">
                    <button className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow">
                      <Heart size={18} />
                    </button>
                    <button
                      className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow"
                      onClick={() => {
                        try {
                          navigator?.share?.({ title: reel?.name || 'Reel', url: window.location.href })
                        } catch (e) {
                          navigator.clipboard?.writeText(window.location.href)
                        }
                      }}
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  {/* Caption */}
                  <div className="absolute left-6 bottom-6 right-24 text-white/95">
                    <div className="text-base font-medium truncate">{reel?.name || 'Reel'}</div>
                    {Array.isArray(reel?.tags) && reel.tags.length ? (
                      <div className="text-xs opacity-80 line-clamp-1">
                        {reel.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`).join(' ')}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // Phone-sized centered layout (video reels)
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-[360px] h-[640px] md:w-[375px] md:h-[700px] bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Up/Down inside phone box */}
            <button
              onClick={() => scrollToIndex(index - 1)}
              disabled={index === 0}
              className="absolute right-3 top-1/2 -translate-y-16 z-[20] p-2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
              aria-label="Previous"
            >
              <ChevronUp size={18} />
            </button>
            <button
              onClick={() => scrollToIndex(index + 1)}
              disabled={index >= allReels.length - 1}
              className="absolute right-3 top-1/2 translate-y-16 z-[20] p-2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
              aria-label="Next"
            >
              <ChevronDown size={18} />
            </button>

            <div ref={containerRef} className="absolute inset-0 overflow-y-auto snap-y snap-mandatory scroll-smooth">
              {loading ? (
                <div className="min-h-full h-full flex items-center justify-center text-white/80 text-sm">Loading reels…</div>
              ) : error ? (
                <div className="min-h-full h-full flex items-center justify-center text-red-400 text-sm">{error}</div>
              ) : !allReels.length ? (
                <div className="min-h-full h-full flex items-center justify-center text-white/70 text-sm">No reels</div>
              ) : (
                allReels.map((reel, i) => (
                  <div
                    key={reel.id}
                    data-index={i}
                    ref={(el) => (itemRefs.current[i] = el)}
                    className="snap-start min-h-full h-full w-full flex items-center justify-center relative"
                  >
                    {reel.video_url ? (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current.set(i, el)
                          else videoRefs.current.delete(i)
                        }}
                        src={reel.video_url}
                        className="h-full w-full object-contain bg-black"
                        muted
                        playsInline
                        loop
                      />
                    ) : (
                      <SmartImage
                        src={reel.thumbnail_url}
                        alt={reel.name || "Reel"}
                        className="h-full w-full object-contain bg-black"
                      />
                    )}

                    {/* Side actions */}
                    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 text-white">
                      <button
                        className={`h-10 w-10 rounded-full grid place-items-center shadow border ${reel.is_like ? 'bg-red-500/90 border-red-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                        onClick={() => handleLike(reel)}
                        aria-label="Like"
                      >
                        <Heart size={18} className={reel.is_like ? 'fill-white text-white' : ''} />
                      </button>
                      <div className="text-xs opacity-90">{Math.max(0, reel.like_count || 0)}</div>
                      <button
                        className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow"
                        onClick={() => handleShare(reel)}
                        aria-label="Share"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* Caption */}
                    <div className="absolute left-4 bottom-4 right-20 text-white/95">
                      <div className="text-sm font-medium truncate">{reel?.name || "Reel"}</div>
                      {Array.isArray(reel?.tags) && reel.tags.length ? (
                        <div className="text-[11px] opacity-80 line-clamp-1">
                          {reel.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`).join(' ')}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* Share Dialog */}
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title="Check this reel" />
    </div>
  )
}

