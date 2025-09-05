'use client';

import { useState, useMemo, useCallback } from 'react';
import { Instagram, Heart, MessageCircle, Share, Play, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

export default function InstagramReelsFeed() {
  const [hoveredPost, setHoveredPost] = useState(null);
  const [mutedPosts, setMutedPosts] = useState(new Set());

  const instagramReels = useMemo(() => [
    {
      id: 1,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=540&h=960&fit=crop&auto=format&q=80',
      videoUrl: '#',
      likes: 2847,
      comments: 124,
      shares: 67,
      duration: '0:15',
      caption: 'How to style our new maxi dress 3 different ways ✨ Which look is your favorite?',
      hashtags: ['#StyleTips', '#MaxiDress', '#OOTD', '#FaxioStyle'],
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    },
    {
      id: 2,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=540&h=960&fit=crop&auto=format&q=80',
      likes: 1923,
      comments: 89,
      shares: 43,
      caption: 'Behind the scenes of our autumn collection photoshoot 📸',
      hashtags: ['#BTS', '#AutumnCollection', '#Photoshoot'],
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    },
    {
      id: 3,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=540&h=960&fit=crop&auto=format&q=80',
      videoUrl: '#',
      likes: 3456,
      comments: 156,
      shares: 89,
      duration: '0:30',
      caption: 'Transition from day to night look in under 30 seconds! 🌙✨',
      hashtags: ['#DayToNight', '#QuickChange', '#StyleTransition'],
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    },
    {
      id: 4,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=540&h=960&fit=crop&auto=format&q=80',
      likes: 2167,
      comments: 92,
      shares: 54,
      caption: 'Our customers looking absolutely stunning! 💖 #CustomerSpotlight',
      hashtags: ['#CustomerLove', '#RealCustomers', '#Fashion'],
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    },
    {
      id: 5,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=540&h=960&fit=crop&auto=format&q=80',
      videoUrl: '#',
      likes: 4123,
      comments: 203,
      shares: 112,
      duration: '0:45',
      caption: 'Sustainable fashion tips everyone should know 🌱 Save this post!',
      hashtags: ['#SustainableFashion', '#EcoFriendly', '#Tips'],
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    },
    {
      id: 6,
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=540&h=960&fit=crop&auto=format&q=80',
      likes: 1876,
      comments: 78,
      shares: 41,
      caption: 'New arrivals are here! Swipe to see the entire collection 👗',
      hashtags: ['#NewArrivals', '#Collection', '#Shopping'],
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
      username: 'faxio_official'
    }
  ], []);

  // Limit: only 4 videos and 4 images
  const limitedVideos = useMemo(() => instagramReels.filter(r => r.type === 'video').slice(0, 4), [instagramReels]);
  const limitedImages = useMemo(() => instagramReels.filter(r => r.type === 'image').slice(0, 4), [instagramReels]);
  const displayReels = useMemo(() => [...limitedVideos, ...limitedImages], [limitedVideos, limitedImages]);

  const toggleMute = useCallback((postId) => {
    setMutedPosts(prev => {
      const newMuted = new Set(prev);
      if (newMuted.has(postId)) {
        newMuted.delete(postId);
      } else {
        newMuted.add(postId);
      }
      return newMuted;
    });
  }, []);

  const formatNumber = useCallback((num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }, []);

  const handleMouseEnter = useCallback((id) => {
    setHoveredPost(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPost(null);
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Instagram className="h-10 w-10 text-gray-900 dark:text-white" />
            </div>
            <h2 className="heading-lg text-gray-900 dark:text-white">
              Style Stories
            </h2>
          </div>
          <p className="body-lg text-fade max-w-3xl mx-auto mb-8">
            Get daily fashion inspiration, styling tutorials, and behind-the-scenes content from our fashion community
          </p>
          <a
            href="https://instagram.com/faxio_official"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <Instagram className="h-6 w-6" />
            Follow @faxio_official
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayReels.map((reel) => (
            <div
              key={reel.id}
              className="group relative bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ aspectRatio: '9/16', transform: 'translateZ(0)' }}
              onMouseEnter={() => handleMouseEnter(reel.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background Image/Video */}
              <div className="absolute inset-0 relative">
                <SmartImage
                  src={reel.thumbnail}
                  alt="Instagram reel"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              </div>

              {/* Video Play Button */}
              {reel.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`transition-all duration-300 ${hoveredPost === reel.id ? 'scale-100 opacity-100' : 'scale-75 opacity-70'}`}>
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 hover:bg-white/30 transition-colors duration-300">
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Video Duration */}
              {reel.type === 'video' && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {reel.duration}
                </div>
              )}

              {/* User Info */}
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 relative">
                  <SmartImage
                    src={reel.userAvatar}
                    alt={reel.username}
                    className="object-cover"
                  />
                </div>
                <span className="text-white font-semibold text-sm">
                  {reel.username}
                </span>
              </div>

              {/* Audio Control for Videos */}
              {reel.type === 'video' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(reel.id);
                  }}
                  className="absolute top-16 right-4 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors duration-300"
                >
                  {mutedPosts.has(reel.id) ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </button>
              )}

              {/* Engagement Stats */}
              <div className="absolute right-4 bottom-24 flex flex-col gap-4">
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors duration-300">
                    <Heart className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.likes)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors duration-300">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.comments)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white">
                  <button className="p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors duration-300">
                    <Share className="h-6 w-6" />
                  </button>
                  <span className="text-xs font-semibold">{formatNumber(reel.shares)}</span>
                </div>
              </div>

              {/* Caption and Hashtags */}
              <div className="absolute bottom-4 left-4 right-20 text-white">
                <p className="text-sm font-medium mb-2 line-clamp-2 leading-relaxed">
                  {reel.caption}
                </p>
                <div className="flex flex-wrap gap-2">
                  {reel.hashtags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-300 hover:text-blue-200 cursor-pointer font-medium"
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
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
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
        <div className="text-center card-minimal p-8">
          <h3 className="heading-md text-gray-900 dark:text-white mb-4">
            Be Part of Our Fashion Community
          </h3>
          <p className="body-base text-fade mb-6 max-w-2xl mx-auto">
            Tag us <span className="font-semibold text-gray-900 dark:text-white">@faxio_official</span> and use 
            <span className="font-semibold text-gray-900 dark:text-white"> #FaxioStyle</span> for a chance to be featured in our stories!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['#FaxioStyle', '#OOTD', '#StyleTips', '#FashionInspo', '#ElegantStyle'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="btn-primary">
            Share Your Style
          </button>
        </div>
      </div>
    </section>
  );
}
