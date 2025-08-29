import { Calendar, Clock, Heart, MessageCircle } from 'lucide-react';
import BlogImage from './BlogImage';

export default function BlogCard({ post }) {
  return (
    <article className="card-elevated group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden">
        <BlogImage
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          aspectRatio="h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            {post.category}
          </span>
        </div>
        
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
          <Calendar className="w-3 h-3" />
          {(() => {
            try {
              const d = post?.date ? new Date(post.date) : null;
              if (!d || isNaN(d.getTime())) return '—';
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } catch {
              return '—';
            }
          })()}
          <span>•</span>
          <Clock className="w-3 h-3" />
          {post.readTime}
        </div>
        
        {/* Title */}
        <h3 className="heading-sm text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="body-base text-fade mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-500 px-2 py-1">
              +{post.tags.length - 2} more
            </span>
          )}
        </div>
        
        {/* Read more */}
        <div className="flex items-center justify-between">
          <a 
            href={`/blog/${post.id}`}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium text-sm transition-colors inline-flex items-center gap-2"
          >
            Read More
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
