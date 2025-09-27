/**
 * next-sitemap configuration
 * Generates sitemap(s) and robots.txt at build time.
 * Uses additionalPaths to fetch dynamic product and blog pages from the API.
 */

/**
 * Derive Store API base URL the same way services/config/setupApi.js does.
 */
const medusaRoot = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000').replace(/\/$/, '')
const storeBase = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : `${medusaRoot}/store`

/**
 * Site URL for absolute links in the sitemap
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Medusa Storefront publishable key header
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_PUBLISHABLE_KEY || ''

/**
 * Helper: fetch all items from a paginated endpoint using limit/offset
 */
async function fetchAll(path, { limit = 100, params = {} } = {}) {
  const collected = []
  let offset = 0
  // Node/Next build environment supports global fetch
  while (true) {
    const url = new URL(`${storeBase}${path}`)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
    const headers = { 'Accept': 'application/json' }
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey
    const res = await fetch(url, { cache: 'no-store', headers })
    if (!res.ok) break
    const json = await res.json()
    // Try common shapes: { products }, { blogs }, { data: { products } }, etc.
    const arr = json?.products || json?.blogs || json?.data?.products || json?.data?.blogs || []
    collected.push(...arr)
    if (!Array.isArray(arr) || arr.length < limit) break
    offset += arr.length
  }
  return collected
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  // Force a single sitemap file
  generateIndexSitemap: false,
  sitemapSize: 50000,
  priority: 0.7,
  changefreq: 'weekly',
  exclude: [
    // Exclude any admin or private pages if they exist
    '/admin/*',
    '/dashboard/*',
    '/account/*',
    // Exclude dynamic Next.js sitemap route if still present (we will remove it)
    '/sitemap',
  ],
  transform: async (config, path) => {
    // Root gets the highest priority by default
    const isRoot = path === '/'
    return {
      loc: path,
      changefreq: 'weekly',
      priority: isRoot ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
  additionalPaths: async (config) => {
    const add = []

    // Static routes
    const staticRoutes = [
      '/',
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
    for (const p of staticRoutes) {
      add.push({ loc: p, changefreq: 'weekly', priority: p === '/' ? 1.0 : 0.7 })
    }

    // Dynamic: products
    try {
      const products = await fetchAll('/products', { params: { fields: '+updated_at' } })
      for (const p of products) {
        const id = p?.id || p?._id
        if (!id) continue
        const lastmod = p?.updated_at ? new Date(p.updated_at).toISOString() : undefined
        add.push({ loc: `/products/${id}`, changefreq: 'weekly', priority: 0.8, lastmod })
      }
    } catch (_) {
      // ignore
    }

    // Dynamic: blogs
    try {
      const blogs = await fetchAll('/blogs')
      for (const b of blogs) {
        const id = b?.id || b?._id
        if (!id) continue
        const lastmod = b?.updated_at || b?.published_at ? new Date(b.updated_at || b.published_at).toISOString() : undefined
        add.push({ loc: `/blog/${id}`, changefreq: 'weekly', priority: 0.7, lastmod })
      }
    } catch (_) {
      // ignore
    }

    return add
  },
}
