import { Calendar, Clock, Heart, MessageCircle, User } from 'lucide-react';
import BlogImage, { AuthorAvatar } from './BlogImage';

export default function BlogCard({ post }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
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
        
        {/* Engagement stats on hover */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Heart className="w-3 h-3" />
            {post.likes}
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <MessageCircle className="w-3 h-3" />
            {post.comments}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Author and date */}
        <div className="flex items-center gap-3 mb-4">
          <AuthorAvatar
            src={post.authorImage}
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-100 dark:border-pink-900"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-3 h-3" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-gray-400 dark:text-gray-600 text-xs px-2 py-1">
              +{post.tags.length - 2} more
            </span>
          )}
        </div>
        
        {/* Read more link */}
        <a 
          href={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold hover:text-pink-700 dark:hover:text-pink-300 transition-colors group/link"
        >
          Read Article
          <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
}
