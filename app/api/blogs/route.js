// /app/api/blogs/route.js
// Proxies backend blogs and enriches each item with category_name and category object

import { NextResponse } from 'next/server'

function buildApiBase() {
  // Prefer explicit API base if provided
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    'http://localhost:9000'
  )
}

function joinApi(apiBase, pathAfterStore) {
  const base = (apiBase || '').replace(/\/$/, '')
  const path = pathAfterStore.replace(/^\//, '')
  // If base already ends with the full path (with or without /store), use as-is
  if (new RegExp(`/(?:store/)?${path}/?$`).test(base)) {
    return base
  }
  // If base ends with /store, append path
  if (/\/store\/?$/.test(base)) {
    return `${base}/${path}`
  }
  // Otherwise, add /store/<path>
  return `${base}/store/${path}`
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get('limit') || '9'
  const offset = searchParams.get('offset') || '0'
  const category_id = searchParams.get('category_id') || ''
  const search = searchParams.get('search') || ''

  const apiBase = buildApiBase()
  if (!apiBase) {
    return NextResponse.json(
      { type: 'config_error', message: 'API base URL is not configured' },
      { status: 500 }
    )
  }

  const headers = {}
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }

  const blogsUrl = new URL(joinApi(apiBase, 'blogs'))
  blogsUrl.searchParams.set('limit', String(limit))
  blogsUrl.searchParams.set('offset', String(offset))
  if (category_id) blogsUrl.searchParams.set('category_id', String(category_id))
  if (search) blogsUrl.searchParams.set('search', String(search))

  const catsUrlPrimary = new URL(joinApi(apiBase, 'blog-categories'))
  catsUrlPrimary.searchParams.set('limit', '1000')
  catsUrlPrimary.searchParams.set('offset', '0')
  // Fallback shapes some backends use (e.g., /store/blog/categories)
  const catsUrlFallback = new URL(joinApi(apiBase, 'blog/categories'))
  catsUrlFallback.searchParams.set('limit', '1000')
  catsUrlFallback.searchParams.set('offset', '0')

  try {
    const blogsUrlStr = blogsUrl.toString()
    const catsUrlPrimaryStr = catsUrlPrimary.toString()
    let [blogsRes, catsRes] = await Promise.all([
      fetch(blogsUrlStr, { headers, cache: 'no-store' }),
      fetch(catsUrlPrimaryStr, { headers, cache: 'no-store' }),
    ])

    // If categories 404, try fallback path
    let catsUrlUsed = catsUrlPrimaryStr
    if (!catsRes.ok && catsRes.status === 404) {
      const catsUrlFallbackStr = catsUrlFallback.toString()
      const retry = await fetch(catsUrlFallbackStr, { headers, cache: 'no-store' })
      if (retry.ok) {
        catsRes = retry
        catsUrlUsed = catsUrlFallbackStr
      }
    }

    if (!blogsRes.ok) {
      const msg = await safeJson(blogsRes)
      return NextResponse.json(
        { type: 'backend_error', endpoint: 'blogs', url: blogsUrlStr, status: blogsRes.status, message: msg },
        { status: 502 }
      )
    }
    if (!catsRes.ok) {
      const msg = await safeJson(catsRes)
      return NextResponse.json(
        { type: 'backend_error', endpoint: 'blog-categories', url: catsUrlUsed, status: catsRes.status, message: msg },
        { status: 502 }
      )
    }

    const blogsData = await blogsRes.json()
    const catsData = await catsRes.json()

    const blogs = blogsData?.blogs || blogsData?.data?.blogs || []
    const count = blogsData?.count ?? blogsData?.data?.count ?? blogs.length
    const limitOut = blogsData?.limit ?? blogsData?.data?.limit ?? Number(limit)
    const offsetOut = blogsData?.offset ?? blogsData?.data?.offset ?? Number(offset)

    const categories = catsData?.categories || catsData?.data?.categories || []
    const catMap = categories.reduce((acc, c) => {
      if (c?.id) acc[c.id] = c
      return acc
    }, {})

    const enriched = blogs.map((b) => {
      const cat = b?.category_id ? catMap[b.category_id] : undefined
      return {
        ...b,
        category_name: cat?.name || b?.category_name || null,
        category: cat || null,
      }
    })

    return NextResponse.json({ blogs: enriched, count, limit: limitOut, offset: offsetOut })
  } catch (e) {
    return NextResponse.json(
      { type: 'network_error', message: e?.message || 'Failed to load blogs' },
      { status: 500 }
    )
  }
}

async function safeJson(resp) {
  try {
    return await resp.json()
  } catch (_) {
    try {
      return await resp.text()
    } catch (__) {
      return 'Unknown error'
    }
  }
}
