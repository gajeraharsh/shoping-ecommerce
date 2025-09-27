import { getProducts } from '@/services/modules/product/productService'
import { getBlogs } from '@/services/modules/blog/blogService'

// Next.js App Router sitemap generator
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default async function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  // Public static routes to include (exclude auth/account/admin)
  const staticRoutes = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/faq',
    '/shipping',
    '/returns',
    '/cookies',
    '/size-guide',
    '/collections',
    '/products',
    '/blog',
    '/reels',
    '/feed',
    '/trendzs',
  ]

  const now = new Date()
  const staticEntries = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))

  // Helper to fetch all items with pagination and sensible caps
  const fetchAll = async (fetchFn, { limit = 100, cap = 1000, mapItems, totalKey, listKey }) => {
    const results = []
    let offset = 0
    let total = Infinity

    while (results.length < cap && offset < total) {
      const res = await fetchFn({ limit, offset })

      const list = Array.isArray(res?.[listKey]) ? res[listKey]
        : (Array.isArray(res) ? res : [])

      total = Number(res?.[totalKey]) || (Array.isArray(list) ? (offset + list.length) : 0)

      for (const item of (list || [])) {
        results.push(item)
        if (results.length >= cap) break
      }

      offset += limit
      if (!Array.isArray(list) || list.length < limit) break
    }

    return mapItems ? results.map(mapItems) : results
  }

  // Dynamic: products
  let productEntries = []
  try {
    const products = await fetchAll(
      (params) => getProducts({ ...params, fields: '+images,+thumbnail,+updated_at' }),
      {
        limit: 100,
        cap: 1000,
        listKey: 'products',
        totalKey: 'count',
        mapItems: (p) => ({
          url: `${base}/products/${p.id}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.6,
        }),
      }
    )
    productEntries = products
  } catch (_) {
    productEntries = []
  }

  // Dynamic: blogs
  let blogEntries = []
  try {
    const blogs = await fetchAll(
      (params) => getBlogs({ ...params }),
      {
        limit: 50,
        cap: 500,
        listKey: 'blogs',
        totalKey: 'count',
        mapItems: (b) => ({
          url: `${base}/blog/${b.id}`,
          lastModified: b.updated_at ? new Date(b.updated_at) : (b.published_at ? new Date(b.published_at) : now),
          changeFrequency: 'weekly',
          priority: 0.5,
        }),
      }
    )
    blogEntries = blogs
  } catch (_) {
    blogEntries = []
  }

  return [
    ...staticEntries,
    ...productEntries,
    ...blogEntries,
  ]
}
