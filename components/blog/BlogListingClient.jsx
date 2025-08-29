"use client"

import { useEffect, useMemo, useState } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton'
import BlogCategories from '@/components/blog/BlogCategories'
import BlogCategoriesSkeleton from '@/components/blog/BlogCategoriesSkeleton'
import BlogImage from '@/components/blog/BlogImage'
import { Calendar } from 'lucide-react'
// We will use the local enriched API route instead of direct backend call
import { getBlogCategories } from '@/services/modules/blogCategory/blogCategoryService'

function mapBlogToUi(b) {
  const categoryName = typeof b.category === 'string'
    ? b.category
    : (b?.category?.name || (Array.isArray(b?.categories) ? b.categories[0]?.name : (b?.category_name || 'General')));

  const imagesArr = (
    Array.isArray(b?.images) ? b.images :
    (Array.isArray(b?.media) ? b.media.map((m) => m?.url || m).filter(Boolean) :
    (b?.cover_image ? [b.cover_image] :
    (b?.banner ? [b.banner] :
    (b?.thumbnail ? [b.thumbnail] :
    (b?.image ? [b.image] : [])))))
  ).filter(Boolean)

  const tagsArr = Array.isArray(b?.hashtags)
    ? b.hashtags
    : (typeof b?.hashtags === 'string'
      ? b.hashtags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(b?.tags) ? b.tags.map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean) : []))

  return {
    id: b.id,
    title: b.title,
    excerpt: b.short_description || b.excerpt || b.summary || '',
    content: b.content_html || b.content || '',
    date: b.published_at || b.created_at || new Date().toISOString(),
    readTime: b.read_time ? `${b.read_time} min read` : '5 min read',
    category: categoryName || 'General',
    tags: tagsArr,
    image: imagesArr[0] || b.image_url || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop',
    featured: !!b.featured,
    likes: b.likes || 0,
    comments: b.comments_count || 0,
  }
}

export default function BlogListingClient() {
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({ limit: 9, offset: 0, count: 0 })

  // Map raw blog list to UI objects, enriching category name from category_id using loaded categories
  const mapBlogsWithCategories = (listRaw) => {
    const catMap = (categories || [])
      .filter((c) => c.id && c.id !== 'all')
      .reduce((acc, c) => { acc[c.id] = c.name; return acc }, {})
    return listRaw.map((b) => {
      const ui = mapBlogToUi(b)
      const nameFromId = b?.category_id ? catMap[b.category_id] : undefined
      return { ...ui, category: nameFromId || ui.category }
    })
  }

  useEffect(() => {
    let mounted = true
    async function loadCategories() {
      try {
        setCatLoading(true)
        const res = await getBlogCategories()
        const items = (res?.categories || res?.data?.categories || [])
        const mapped = [{ id: 'all', name: 'All' }, ...items.map(c => ({ id: c.id, name: c.name }))]
        if (mounted) setCategories(mapped)
      } catch (e) {
        if (mounted) setCategories([{ id: 'all', name: 'All' }])
      } finally {
        if (mounted) setCatLoading(false)
      }
    }
    loadCategories()
    return () => { mounted = false }
  }, [])

  const fetchBlogs = async (opts = {}) => {
    const params = {
      limit: opts.limit ?? pagination.limit,
      offset: opts.offset ?? 0,
      ...(selectedCat && selectedCat !== 'all' ? { category_id: selectedCat } : {}),
    }
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== null))).toString()
    const res = await fetch(`/api/blogs?${qs}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load blogs')
    const data = await res.json()
    const list = data?.blogs || []
    const count = data?.count ?? list.length
    const take = data?.limit ?? params.limit
    const skip = data?.offset ?? params.offset
    return { listRaw: list, count, take, skip }
  }

  useEffect(() => {
    let mounted = true
    async function loadBlogs() {
      try {
        setLoading(true)
        // Wait until categories are loaded so we can map category_id -> name
        if (catLoading) return
        const { listRaw, count, take, skip } = await fetchBlogs({ offset: 0 })
        if (!mounted) return
        setBlogs(mapBlogsWithCategories(listRaw))
        setPagination({ limit: take, offset: skip, count })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadBlogs()
    return () => { mounted = false }
  }, [selectedCat, catLoading, categories])

  const featuredPost = useMemo(() => blogs.find(b => b.featured) || blogs[0], [blogs])
  // Show all blogs in the grid (including the featured one) so the list also appears under the heading
  const regularPosts = useMemo(() => blogs, [blogs])

  const canLoadMore = blogs.length < (pagination.count || 0)

  const handleLoadMore = async () => {
    if (loadingMore || !canLoadMore) return
    try {
      setLoadingMore(true)
      const nextOffset = blogs.length
      const { listRaw } = await fetchBlogs({ offset: nextOffset })
      const mapped = mapBlogsWithCategories(listRaw)
      setBlogs(prev => [...prev, ...mapped])
      setPagination(p => ({ ...p, offset: nextOffset }))
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="container-fluid section-padding">
      {catLoading ? (
        <BlogCategoriesSkeleton />
      ) : (
        <BlogCategories
          categories={categories}
          selectedId={selectedCat}
          onSelect={(c) => setSelectedCat(c.id === 'all' ? null : c.id)}
        />
      )}

      {/* Featured Post */}
      <div className="mb-16">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
            <div className="w-full h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="space-y-2 w-1/2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            </div>
          </div>
        ) : featuredPost ? (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-black dark:bg.white text-white dark:text-black px-4 py-2 rounded-full text-sm font-semibold">
                Featured Story
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
              <div className="relative group overflow-hidden rounded-2xl">
                <BlogImage
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  aspectRatio="h-80 lg:h-96"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="heading-lg text-gray-900 dark:text-white mb-4">{featuredPost.title}</h2>
                <p className="body-lg text-fade mb-6">{featuredPost.excerpt}</p>
                <a href={`/blog/${featuredPost.id}`} className="btn-primary w-fit inline-flex items-center">
                  Read Full Story
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Regular Posts Grid */}
      <div className="mb-16">
        <h2 className="heading-lg text-gray-900 dark:text-white mb-8 text-center">Latest Fashion Stories</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className="text-center mb-16">
          <button className="btn-outline" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load More Stories'}
          </button>
        </div>
      )}
    </div>
  )
}
