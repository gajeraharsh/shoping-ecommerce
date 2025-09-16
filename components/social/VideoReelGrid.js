'use client'

import { useEffect, useRef, useState } from 'react'
import SmartImage from '@/components/ui/SmartImage'
import { reelsService } from '@/services/modules/reels/reelsService'
import ReelsModal from '@/components/social/ReelsModal'
import ShareDialog from '@/components/social/ShareDialog'
import { Heart, Share2 } from 'lucide-react'

export default function VideoReelGrid({ title = 'Style Stories', filters = {}, limit = 12, className = '' }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeReelId, setActiveReelId] = useState(null)
  const videoRefs = useRef(new Map())
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    const effectiveFilters = { type: 'video', is_display_home: true, ...filters }

    reelsService
      .list({ filters: effectiveFilters, limit })
      .then(({ reels }) => {
        if (!mounted) return
        setItems(reels || [])
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message || 'Failed to load reels')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [JSON.stringify(filters), limit])

  const handleMouseEnter = (id) => {
    const v = videoRefs.current.get(id)
    if (v) {
      try {
        v.play()
      } catch {}
    }
  }

  const handleMouseLeave = (id) => {
    const v = videoRefs.current.get(id)
    if (v) {
      try {
        v.pause()
        v.currentTime = 0
      } catch {}
    }
  }

  const renderTagsOrCaption = (it) => {
    if (Array.isArray(it?.tags) && it.tags.length) {
      return it.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`).join(' ')
    }
    return ''
  }

  const handleLike = async (e, it) => {
    e?.stopPropagation?.()
    const id = it?.id
    if (!id) return
    // optimistic toggle
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: !r.is_like } : r)))
    try {
      if (it.is_like) await reelsService.unlike(id)
      else await reelsService.like(id)
    } catch (err) {
      // revert on failure
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: it.is_like } : r)))
    }
  }

  const handleShare = (e, it) => {
    e?.stopPropagation?.()
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${base}/trendzs?reel=${encodeURIComponent(it?.id || '')}`
    setShareUrl(url)
    setShareOpen(true)
  }

  return (
    <section className={`py-12 sm:py-16 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <div className="w-16 h-px bg-black/20 dark:bg-white/20 mb-3"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No reels to show</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="group relative aspect-[9/16] overflow-hidden rounded-2xl cursor-pointer bg-black"
                onClick={() => {
                  setActiveReelId(it.id)
                  setModalOpen(true)
                }}
                onMouseEnter={() => handleMouseEnter(it.id)}
                onMouseLeave={() => handleMouseLeave(it.id)}
              >
                {/* Thumbnail always visible */}
                <SmartImage
                  src={it.thumbnail_url}
                  alt={it.name || 'Reel'}
                  className="h-full w-full object-cover"
                />

                {/* Video overlays thumbnail and plays on hover */}
                {it.video_url && (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(it.id, el)
                      else videoRefs.current.delete(it.id)
                    }}
                    src={it.video_url}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    muted
                    playsInline
                    loop
                  />
                )}

                {/* Side actions like modal (right side) */}
                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 text-white z-[2]">
                  <button
                    className={`h-9 w-9 rounded-full grid place-items-center shadow border ${it.is_like ? 'bg-red-500 border-red-500' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                    onClick={(e) => handleLike(e, it)}
                    aria-label="Like"
                  >
                    <Heart size={16} className={it.is_like ? 'fill-white text-white' : ''} />
                  </button>
                  {/* Like count hidden as requested */}
                  <button
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 grid place-items-center shadow"
                    onClick={(e) => handleShare(e, it)}
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {/* Caption bottom-left: title + hashtags (hashtags only if tags exist) */}
                <div className="absolute left-3 bottom-3 right-16 text-white z-[2]">
                  <div className="text-xs font-medium truncate">{it?.name || 'Reel'}</div>
                  {renderTagsOrCaption(it) ? (
                    <div className="text-[10px] opacity-80 line-clamp-1">{renderTagsOrCaption(it)}</div>
                  ) : null}
                </div>

                {/* subtle top gradient for readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        )}
      </div>
      <ReelsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialReelId={activeReelId}
        filters={{ type: 'video', is_display_home: true, ...filters }}
        order="-created_at"
        variant="phone"
        singleOnly
      />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title="Check this reel" />
    </section>
  )
}
