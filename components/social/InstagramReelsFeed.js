'use client';

import { useState } from 'react';
import { Instagram, Heart, MessageCircle, Share, Play, Volume2, VolumeX, ExternalLink } from 'lucide-react';

export default function InstagramReelsFeed() {
  const [hoveredPost, setHoveredPost] = useState(null);
  const [mutedPosts, setMutedPosts] = useState(new Set());

  // Mock Instagram reels/posts data with more realistic fashion content
  const instagramReels = [
    {
      id: 1,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
      videoUrl: '#',
      likes: 2847,
      comments: 124,
      shares: 67,
      duration: '0:15',
      caption: 'How to style our new maxi dress 3 different ways ✨ Which look is your favorite? 💕',
      hashtags: ['#StyleTips', '#MaxiDress', '#OOTD', '#FashionHack'],
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    },
    {
      id: 2,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      likes: 1923,
      comments: 89,
      shares: 43,
      caption: 'Behind the scenes of our summer collection photoshoot 📸',
      hashtags: ['#BTS', '#SummerCollection', '#Photoshoot'],
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    },
    {
      id: 3,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
      videoUrl: '#',
      likes: 3456,
      comments: 156,
      shares: 89,
      duration: '0:30',
      caption: 'Transition from day to night look in under 30 seconds! 🌙✨',
      hashtags: ['#DayToNight', '#QuickChange', '#StyleTransition'],
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    },
    {
      id: 4,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
      likes: 2167,
      comments: 92,
      shares: 54,
      caption: 'Our customers looking absolutely stunning! 💖 #CustomerSpotlight',
      hashtags: ['#CustomerLove', '#RealCustomers', '#Fashion'],
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    },
    {
      id: 5,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
      videoUrl: '#',
      likes: 4123,
      comments: 203,
      shares: 112,
      duration: '0:45',
      caption: 'Sustainable fashion tips everyone should know 🌱 Save this post!',
      hashtags: ['#SustainableFashion', '#EcoFriendly', '#Tips'],
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    },
    {
      id: 6,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
      likes: 1876,
      comments: 78,
      shares: 41,
      caption: 'New arrivals are here! Swipe to see the entire collection 👗',
      hashtags: ['#NewArrivals', '#Collection', '#Shopping'],
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      username: 'fashionista_official'
    }
  ];

  const toggleMute = (postId) => {
    setMutedPosts(prev => {
      const newMuted = new Set(prev);
      if (newMuted.has(postId)) {
        newMuted.delete(postId);
      } else {
        newMuted.add(postId);
      }
      return newMuted;
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="py-20 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Instagram className="h-10 w-10 text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full blur-lg opacity-20"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Style Stories
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get daily fashion inspiration, styling tutorials, and behind-the-scenes content from our fashion community
          </p>
          <a
            href="https://instagram.com/fashionista_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all transform hover:scale-105 font-semibold text-lg"
          >
            <Instagram className="h-6 w-6" />
            Follow @fashionista_official
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {instagramReels.map((reel) => (
            <div
              key={reel.id}
              className="group relative bg-black rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
              style={{ aspectRatio: '9/16' }}
              onMouseEnter={() => setHoveredPost(reel.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Background Image/Video */}
              <div className="absolute inset-0">
                <img
                  src={reel.thumbnail}
                  alt="Instagram reel"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              </div>

              {/* Video Play Button */}
              {reel.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`transition-all duration-300 ${hoveredPost === reel.id ? 'scale-100 opacity-100' : 'scale-75 opacity-60'}`}>
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all cursor-pointer">
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Video Duration */}
              {reel.type === 'video' && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-medium">
                  {reel.duration}
                </div>
              )}

              {/* User Info */}
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <img
                  src={reel.userAvatar}
                  alt={reel.username}
                  className="w-10 h-10 rounded-full border-2 border-white/50"
                />
                <span className="text-white font-semibold text-sm">
                  {reel.username}
                </span>
              </div>

              {/* Audio Control for Videos */}
              {reel.type === 'video' && (
                <button
                  onClick={() => toggleMute(reel.id)}
                  className="absolute top-4 right-16 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all"
                >
                  {mutedPosts.has(reel.id) ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </button>
              )}

              {/* Engagement Stats */}
              <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all hover:scale-110">
                    <Heart className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.likes)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all hover:scale-110">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.comments)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all hover:scale-110">
                    <Share className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.shares)}</span>
                </div>
              </div>

              {/* Caption and Hashtags */}
              <div className="absolute bottom-4 left-4 right-20 text-white">
                <p className="text-sm font-medium mb-2 line-clamp-2">
                  {reel.caption}
                </p>
                <div className="flex flex-wrap gap-1">
                  {reel.hashtags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-300 hover:text-blue-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                  {reel.hashtags.length > 2 && (
                    <span className="text-xs text-gray-300">
                      +{reel.hashtags.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-black/20 transition-all duration-300 ${
                hoveredPost === reel.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Instagram className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium">View on Instagram</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Be Part of Our Fashion Community
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Tag us <span className="font-semibold text-pink-500">@fashionista_official</span> and use 
            <span className="font-semibold text-pink-500"> #FashionistaStyle</span> for a chance to be featured in our stories!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['#FashionistaStyle', '#OOTD', '#StyleTips', '#FashionInspo', '#Trendy'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-900/70 dark:hover:to-purple-900/70 transition-all cursor-pointer transform hover:scale-105"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            Upload Your Style
          </button>
        </div>
      </div>
    </div>
  );
}
