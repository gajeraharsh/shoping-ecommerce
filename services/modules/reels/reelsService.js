// /services/modules/reels/reelsService.js
import { apiClient } from '@/services/config/setupApi'

export const reelsService = {
  async list({ filters = {}, limit = 12, offset = 0, order = '-created_at' } = {}) {
    const params = new URLSearchParams()
    if (limit != null) params.set('limit', String(limit))
    if (offset != null) params.set('offset', String(offset))
    if (order) params.set('order', order)

    // Apply filters (type, product_id, blog_id, is_display_home, q, etc.)
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      // Booleans should be serialized as true/false
      if (typeof value === 'boolean') {
        params.set(key, value ? 'true' : 'false')
      } else {
        params.set(key, String(value))
      }
    })

    const qs = params.toString()
    const url = `/reels${qs ? `?${qs}` : ''}`
    const { reels = [], count = 0, limit: take = limit, offset: skip = offset } = await apiClient.get(url)
    return { reels, count, limit: take, offset: skip }
  },

  async fetchAll({ filters = {}, order = '-created_at', batchSize = 50, maxTotal = 5000 } = {}) {
    // Fetch first page to get count
    const first = await this.list({ filters, limit: batchSize, offset: 0, order })
    let all = [...(first.reels || [])]
    const total = typeof first.count === 'number' ? first.count : all.length

    // Early return if already complete
    if (all.length >= total) return all

    // Continue fetching in batches
    let offset = first.offset + first.reels.length
    const limit = batchSize
    const safetyCap = Math.min(maxTotal, total || maxTotal)

    while (all.length < total && all.length < safetyCap) {
      const { reels } = await this.list({ filters, limit, offset, order })
      if (!reels || reels.length === 0) break
      all = all.concat(reels)
      offset += reels.length
    }

    return all
  },

  async like(reelId) {
    if (!reelId) throw new Error('Missing reel id')
    return apiClient.post(`/reels/${encodeURIComponent(reelId)}/like`)
  },

  async unlike(reelId) {
    if (!reelId) throw new Error('Missing reel id')
    return apiClient.delete(`/reels/${encodeURIComponent(reelId)}/like`)
  },

  async getById(reelId) {
    if (!reelId) throw new Error('Missing reel id')
    return apiClient.get(`/reels/${encodeURIComponent(reelId)}`)
  },
}
