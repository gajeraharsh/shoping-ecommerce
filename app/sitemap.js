import { getProducts } from '@/services/modules/product/productService'
import { getBlogs } from '@/services/modules/blog/blogService'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const now = new Date()

  const staticRoutes = [
    '',
    '/products',
    '/blog',
    '/about',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/collections',
    '/faq',
    '/size-guide',
    '/reels',
    '/feed',
    '/trendzs',
  ]

  const entries = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }))

  // Fetch dynamic resources (best-effort; ignore failures)
  try {
    const [prodRes, blogRes] = await Promise.all([
      getProducts({ limit: 100, offset: 0, fields: '+updated_at' }),
      getBlogs({ limit: 100, offset: 0 }),
    ])

    const products = Array.isArray(prodRes?.products) ? prodRes.products : (prodRes?.data?.products || [])
    for (const p of products) {
      const id = p?.id || p?._id
      if (!id) continue
      entries.push({
        url: `${base}/products/${id}`,
        lastModified: p?.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    const blogs = Array.isArray(blogRes?.blogs) ? blogRes.blogs : (blogRes?.data?.blogs || [])
    for (const b of blogs) {
      const id = b?.id || b?._id
      if (!id) continue
      entries.push({
        url: `${base}/blog/${id}`,
        lastModified: b?.updated_at ? new Date(b.updated_at) : (b?.published_at ? new Date(b.published_at) : now),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch (_) {
    // ignore errors; still return static entries
  }

  return entries
}
