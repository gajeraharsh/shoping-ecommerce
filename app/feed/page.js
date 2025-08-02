'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocial } from '@/contexts/SocialContext';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ShoppingBag, MapPin, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { toast } from 'sonner';

function PostCard({ post }) {
  const { user } = useAuth();
  const { likePost, addComment, savePost } = useSocial();
  const [liked, setLiked] = useState(post.likes.includes(user?.id));
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }
    likePost(post.id, user.id);
    setLiked(!liked);
  };

  const handleSave = () => {
    if (!user) {
      toast.error('Please log in to save posts');
      return;
    }
    savePost(post.id, user.id);
    setSaved(!saved);
    toast.success(saved ? 'Post removed from saved' : 'Post saved!');
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }
    if (!commentText.trim()) return;
    
    addComment(post.id, {
      user: { name: user.name, username: user.username },
      text: commentText
    });
    setCommentText('');
    toast.success('Comment added!');
  };

  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.user.username}`}>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name?.[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <div className="flex items-center gap-1">
              <Link href={`/profile/${post.user.username}`} className="font-semibold text-sm hover:underline">
                {post.user.name}
              </Link>
              {post.user.verified && (
                <Verified className="h-4 w-4 text-blue-500" />
              )}
              {post.user.role === 'influencer' && (
                <Badge variant="secondary" className="text-xs">Creator</Badge>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>@{post.user.username}</span>
              <span className="mx-1">•</span>
              <span>{timeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3 inline" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Image */}
      <div className="aspect-square relative">
        <img
          src={post.images[0]}
          alt="Post"
          className="w-full h-full object-cover"
        />
        {post.images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            1/{post.images.length}
          </div>
        )}
      </div>

      {/* Tagged Products Overlay */}
      {post.taggedProducts && post.taggedProducts.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Shop the Look
            </span>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2">
            {post.taggedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 w-40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="text-xs font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-600">{product.brand}</p>
                <p className="text-xs font-bold">₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-0 h-auto ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-0 h-auto text-gray-700 dark:text-gray-300"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-700 dark:text-gray-300">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={`p-0 h-auto ${saved ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Like Count */}
        <div className="font-semibold text-sm">
          {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span className="text-gray-900 dark:text-white">{post.caption}</span>
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, index) => (
              <Link key={index} href={`/explore/tags/${tag.replace('#', '')}`} className="text-blue-600 hover:underline text-sm">
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        {post.commentsCount > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-gray-500 text-sm hover:underline"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-2">
            {post.comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.user.username}</span>
                <span className="text-gray-900 dark:text-white">{comment.text}</span>
                <span className="text-gray-500 text-xs ml-2">
                  {timeAgo(comment.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border-none bg-transparent p-0 focus:ring-0 text-sm"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!commentText.trim()}
            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-semibold text-sm"
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
}

function StoriesSection() {
  const stories = [
    {
      id: '1',
      user: { name: 'Your Story', username: 'you', avatar: '/placeholder.jpg' },
      isOwn: true
    },
    {
      id: '2',
      user: { name: 'Fashion Influencer', username: 'fashionista_maya', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?w=80&h=80&fit=crop&crop=face' },
      viewed: false
    },
    {
      id: '3',
      user: { name: 'Style Guru', username: 'styleguru_raj', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
      viewed: true
    },
    {
      id: '4',
      user: { name: 'Brand Official', username: 'styleofficial', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
      viewed: false
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex space-x-4 overflow-x-auto">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
            <div className={`w-16 h-16 rounded-full p-0.5 ${
              story.isOwn ? 'bg-gray-300' : story.viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-pink-500 to-orange-500'
            }`}>
              <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-xs mt-1 truncate w-16">{story.isOwn ? 'Your Story' : story.user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const { posts } = useSocial();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Stories Section */}
        <StoriesSection />

        {/* Posts Feed */}
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
                <h3 className="text-lg font-semibold mb-2">Welcome to StyleSphere!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start following creators to see their latest fashion posts in your feed.
                </p>
                <Link href="/explore">
                  <Button>Explore Creators</Button>
                </Link>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" className="w-full">
              Load More Posts
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
