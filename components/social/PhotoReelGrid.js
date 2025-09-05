'use client'

import { useEffect, useState } from 'react'
import SmartImage from '@/components/ui/SmartImage'
import { reelsService } from '@/services/modules/reels/reelsService'
import ReelsModal from '@/components/social/ReelsModal'
import ShareDialog from '@/components/social/ShareDialog'
import { Heart, Share2 } from 'lucide-react'

export default function PhotoReelGrid({ title = 'Follow Our Journey', filters = {}, limit = 12, className = '' }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeReelId, setActiveReelId] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    const effectiveFilters = { type: 'image', is_display_home: true, ...filters }

    reelsService
      .list({ filters: effectiveFilters, limit })
      .then(({ reels }) => {
        if (!mounted) return
        setItems(reels || [])
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message || 'Failed to load photos')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [JSON.stringify(filters), limit])

  const handleLike = async (e, it) => {
    e?.stopPropagation?.()
    const id = it?.id
    if (!id) return
    // optimistic toggle and count
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: !r.is_like, like_count: (r.like_count || 0) + (r.is_like ? -1 : 1) } : r)))
    try {
      if (it.is_like) await reelsService.unlike(id)
      else await reelsService.like(id)
    } catch (err) {
      // revert on failure
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_like: it.is_like, like_count: r.like_count } : r)))
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
              <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No photos to show</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                onClick={() => {
                  setActiveReelId(it.id)
                  setModalOpen(true)
                }}
             >
                <SmartImage src={it.thumbnail_url || it.video_url} alt={it.name || 'Reel Photo'} className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-sm line-clamp-1 drop-shadow">{it.name || 'Journey'}</div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`pointer-events-auto px-2.5 py-1.5 rounded-full backdrop-blur flex items-center gap-1.5 text-xs border ${it.is_like ? 'bg-red-500/90 border-red-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'}`}
                      onClick={(e) => handleLike(e, it)}
                      aria-label="Like"
                    >
                      <Heart size={14} className={it.is_like ? 'fill-white text-white' : ''} />
                      <span>{Math.max(0, it.like_count || 0)}</span>
                    </button>
                    <button
                      className="pointer-events-auto px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 border border-white/20 flex items-center gap-1.5 text-xs"
                      onClick={(e) => handleShare(e, it)}
                      aria-label="Share"
                    >
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReelsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialReelId={activeReelId}
        filters={{ type: 'image', is_display_home: true, ...filters }}
        order="-created_at"
        variant="fullscreen"
        singleOnly
      />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title="Check this reel" />
    </section>
  )
}
