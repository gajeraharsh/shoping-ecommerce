'use client'

import { useEffect, useState } from 'react'
import VideoReelGrid from '@/components/social/VideoReelGrid'
import PhotoReelGrid from '@/components/social/PhotoReelGrid'
import { reelsService } from '@/services/modules/reels/reelsService'

export default function RelatedReelsForBlog({ blogId, className = '' }) {
  const [hasVideo, setHasVideo] = useState(false)
  const [hasImage, setHasImage] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!blogId) {
      setHasVideo(false)
      setHasImage(false)
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      reelsService.list({ filters: { type: 'video', blog_id: blogId }, limit: 1 }).catch(() => ({ count: 0 })),
      reelsService.list({ filters: { type: 'image', blog_id: blogId }, limit: 1 }).catch(() => ({ count: 0 })),
    ])
      .then(([v, i]) => {
        if (!mounted) return
        setHasVideo((v?.count || 0) > 0)
        setHasImage((i?.count || 0) > 0)
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [blogId])

  if (loading) return null
  if (!hasVideo && !hasImage) return null

  return (
    <div className={className}>
      {hasVideo && (
        <VideoReelGrid title="Style Stories" filters={{ blog_id: blogId, is_display_home: undefined }} />
      )}
      {hasImage && (
        <PhotoReelGrid title="Follow Our Journey" filters={{ blog_id: blogId, is_display_home: undefined }} />
      )}
    </div>
  )
}
