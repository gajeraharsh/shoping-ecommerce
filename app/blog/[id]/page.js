import BlogCard from '@/components/blog/BlogCard';
import BlogImage from '@/components/blog/BlogImage';
import { Calendar, Clock, Heart, MessageCircle, Share2, BookOpen, Tag, ArrowLeft } from 'lucide-react';
import { getBlogById } from '@/services/modules/blog/blogService';
import { notFound } from 'next/navigation';
import RelatedBlogsClient from '@/components/blog/RelatedBlogsClient';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = params || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
  const url = `${siteUrl}/blog/${id}`;
  try {
    // Fetch without unsupported fields param
    const res = await getBlogById(id);
    const b = res?.blog || res || {};
    const title = b?.title ? `${b.title} | Faxio` : 'Blog | Faxio';
    const contentText = b?.excerpt || b?.summary || b?.content_plain || b?.content || b?.content_html || '';
    const description = (typeof contentText === 'string' ? contentText.replace(/<[^>]*>/g, '') : '').slice(0, 160) || 'Read fashion tips, trends, and stories on Faxio.';
    const images = (
      Array.isArray(b?.images) ? b.images :
      (Array.isArray(b?.media) ? b.media.map((m) => m?.url || m).filter(Boolean) :
      (b?.cover_image ? [b.cover_image] :
      (b?.banner ? [b.banner] :
      (b?.thumbnail ? [b.thumbnail] :
      (b?.image ? [b.image] :
      (b?.image_url ? [b.image_url] : []))))))
    ).filter(Boolean).slice(0, 4);
    const ogImages = images.length ? images : [];
    const rawTags = Array.isArray(b?.tags)
      ? b.tags
      : (Array.isArray(b?.tag_list)
        ? b.tag_list
        : (Array.isArray(b?.metadata?.tags)
          ? b.metadata.tags
          : (Array.isArray(b?.hashtags)
            ? b.hashtags
            : (typeof b?.hashtags === 'string'
              ? b.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
              : []))));
    const keywords = rawTags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean);

    // Article-specific metadata
    const publishedTime = b?.published_at || b?.created_at || b?.date || undefined;
    const modifiedTime = b?.updated_at || b?.modified_at || undefined;
    const authorName = (typeof b?.author === 'string')
      ? b.author
      : (b?.author?.name || b?.user?.name || b?.created_by || undefined);
    const section = (typeof b?.category === 'string')
      ? b.category
      : (b?.category?.name || (Array.isArray(b?.categories) ? b.categories[0]?.name : b?.category_name));

    return {
      title,
      description,
      keywords,
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'Faxio',
        locale: 'en_US',
        images: ogImages.map((src) => ({ url: src })),
        publishedTime,
        modifiedTime,
        authors: authorName ? [authorName] : undefined,
        tags: keywords?.length ? keywords : undefined,
        section,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImages,
        site: '@faxio',
        creator: '@faxio',
      },
    };
  } catch (_) {
    return {
      title: 'Blog | Faxio',
      description: 'Read fashion tips, trends, and stories on Faxio.',
      alternates: { canonical: url },
    };
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = params || {};
  let blogPost = null;
  try {
    // Fetch without unsupported fields param
    const res = await getBlogById(id);
    blogPost = res?.blog || res || null;
  } catch (e) {
    blogPost = null;
  }

  if (!blogPost || !blogPost.id) {
    return notFound();
  }

  // Normalize common fields
  const imagesArr = (
    Array.isArray(blogPost.images) ? blogPost.images :
    (Array.isArray(blogPost.media) ? blogPost.media.map((m) => m?.url || m).filter(Boolean) :
    (blogPost.cover_image ? [blogPost.cover_image] :
    (blogPost.banner ? [blogPost.banner] :
    (blogPost.thumbnail ? [blogPost.thumbnail] :
    (blogPost.image ? [blogPost.image] :
    (blogPost.image_url ? [blogPost.image_url] : []))))))
  ).filter(Boolean);
  const heroImg = imagesArr[0] || '';
  const contentHtml = blogPost.content_html || blogPost.content || blogPost.body || '';
  // Estimate read time from content (200 wpm)
  const plainContent = typeof contentHtml === 'string' ? contentHtml.replace(/<[^>]*>/g, ' ') : '';
  const wordCount = plainContent.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;
  // Normalize API read time to always show like `3 min read`
  const apiReadRaw = blogPost.readTime ?? blogPost.read_time;
  const displayReadTime = (() => {
    if (apiReadRaw == null) return estimatedReadTime;
    const val = typeof apiReadRaw === 'number' ? apiReadRaw : String(apiReadRaw).trim();
    if (typeof val === 'number') return `${Math.max(1, Math.round(val))} min read`;
    // If it's a string like '3' or '03'
    if (/^\d+$/.test(val)) return `${parseInt(val, 10)} min read`;
    // If it already contains 'min', keep as is; otherwise append suffix
    return /min/i.test(val) ? val : `${val} min read`;
  })();
  const rawTags = Array.isArray(blogPost.tags)
    ? blogPost.tags
    : (Array.isArray(blogPost.tag_list)
      ? blogPost.tag_list
      : (Array.isArray(blogPost.metadata?.tags)
        ? blogPost.metadata.tags
        : (Array.isArray(blogPost.hashtags)
          ? blogPost.hashtags
          : (typeof blogPost.hashtags === 'string'
            ? blogPost.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
            : []))));
  const tagList = rawTags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean);
  const categoryName = typeof blogPost.category === 'string'
    ? blogPost.category
    : (blogPost.category?.name || (Array.isArray(blogPost.categories) ? (blogPost.categories[0]?.name) : (blogPost.category_name || '')));
  const publishedDate = blogPost.published_at || blogPost.created_at || blogPost.date || '';

  // Related posts now fetched client-side via RelatedBlogsClient

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Back to Blog Button */}
      <div className="container mx-auto px-4 pt-8">
        <a 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-black dark:hover:text-gray-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Stories
        </a>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 py-16 mt-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category */}
            {categoryName && (
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Tag className="w-4 h-4" />
                {categoryName}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blogPost.title}
            </h1>
            
            {/* Meta info (date and read time only) */}
            <div className="flex items-center justify-center gap-3 mb-8 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {publishedDate ? new Date(publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              <span>•</span>
              <Clock className="w-4 h-4" />
              {displayReadTime}
            </div>

          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {heroImg && (
              <BlogImage
                src={heroImg}
                alt={blogPost.title}
                className="w-full h-96 md:h-[500px] object-cover"
                aspectRatio="h-96 md:h-[500px]"
                priority={true}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                {/* JSON-LD for Article */}
                {(() => {
                  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com';
                  const img = imagesArr;
                  const authorName = (typeof blogPost.author === 'string')
                    ? blogPost.author
                    : (blogPost.author?.name || blogPost.user?.name || blogPost.created_by || undefined);
                  const categoryName = (typeof blogPost.category === 'string')
                    ? blogPost.category
                    : (blogPost.category?.name || (Array.isArray(blogPost.categories) ? blogPost.categories[0]?.name : blogPost.category_name));
                  const jsonLdArticle = {
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: blogPost.title,
                    description: (typeof contentHtml === 'string' ? contentHtml.replace(/<[^>]*>/g, ' ') : '').trim().slice(0, 160) || undefined,
                    keywords: tagList?.length ? tagList.join(', ') : undefined,
                    wordCount: Number.isFinite(wordCount) ? wordCount : undefined,
                    articleSection: categoryName || undefined,
                    datePublished: publishedDate || undefined,
                    dateModified: blogPost.updated_at || blogPost.modified_at || undefined,
                    isAccessibleForFree: true,
                    inLanguage: 'en',
                    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
                    publisher: {
                      '@type': 'Organization',
                      name: 'Faxio',
                      logo: {
                        '@type': 'ImageObject',
                        url: `${siteUrl}/favicon.ico`,
                      },
                    },
                    image: img?.length
                      ? img.map((src) => ({ '@type': 'ImageObject', url: src }))
                      : undefined,
                    mainEntityOfPage: {
                      '@type': 'WebPage',
                      '@id': `${siteUrl}/blog/${blogPost.id}`,
                    },
                    url: `${siteUrl}/blog/${blogPost.id}`,
                    commentCount: (typeof blogPost.comments_count === 'number' ? blogPost.comments_count : (Array.isArray(blogPost.comments) ? blogPost.comments.length : undefined)),
                    interactionStatistic: (() => {
                      const likeCount = (
                        typeof blogPost.likes_count === 'number' ? blogPost.likes_count :
                        typeof blogPost.likes === 'number' ? blogPost.likes :
                        typeof blogPost.favorites === 'number' ? blogPost.favorites :
                        undefined
                      );
                      return likeCount != null ? [{
                        '@type': 'InteractionCounter',
                        interactionType: { '@type': 'LikeAction' },
                        userInteractionCount: likeCount,
                      }] : undefined;
                    })(),
                  };
                  const jsonLdBreadcrumb = {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                      {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: siteUrl,
                      },
                      {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Blog',
                        item: `${siteUrl}/blog`,
                      },
                      {
                        '@type': 'ListItem',
                        position: 3,
                        name: blogPost.title,
                        item: `${siteUrl}/blog/${blogPost.id}`,
                      },
                    ],
                  };
                  return (
                    <>
                      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
                      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
                    </>
                  );
                })()}
                <div 
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                  className="leading-relaxed text-gray-700 dark:text-gray-300"
                />
              </article>
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                  {tagList.map(tag => (
                    <span 
                      key={typeof tag === 'string' ? tag : (tag?.id || tag)}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{typeof tag === 'string' ? tag : tag}
                    </span>
                  ))}
                  </div>
                )}
              </div>
              
              {/* Author section removed */}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Share buttons */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Share this story
                  </h3>
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      Pinterest
                    </button>
                  </div>
                </div>

                {/* Newsletter signup */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">
                    Never Miss a Story
                  </h3>
                  <p className="text-gray-200 text-sm mb-4">
                    Get the latest fashion tips and trends delivered to your inbox
                  </p>
                  <form className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email address"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts (client-side) */}
      <RelatedBlogsClient currentId={blogPost.id} categoryId={blogPost.category_id || blogPost.category?.id} />
    </div>
  );
}
