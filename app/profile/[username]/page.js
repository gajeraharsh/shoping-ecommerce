'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSocial } from '@/contexts/SocialContext';
import { Heart, MessageCircle, Share2, ShoppingBag, MapPin, LinkIcon, Calendar, Users, Image as ImageIcon, Bookmark, Grid3X3, Settings, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { posts, following, followUser } = useSocial();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data - in real app, fetch based on username
  const [profileUser, setProfileUser] = useState({
    id: 'user1',
    name: 'Fashion Influencer',
    username: 'fashionista_maya',
    email: 'maya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?w=150&h=150&fit=crop&crop=face',
    verified: true,
    role: 'influencer',
    profile: {
      bio: 'Fashion enthusiast & style creator ✨\nSharing daily outfit inspiration\nCollabs: maya@fashion.com',
      location: 'Mumbai, India',
      website: 'https://fashionista-maya.com',
      fashionTags: ['#Streetwear', '#Minimal', '#Vintage', '#Sustainable'],
      followerCount: 125420,
      followingCount: 856,
      postsCount: 342,
      joinDate: '2022-03-15'
    }
  });

  const isOwnProfile = currentUser?.username === username;
  const userPosts = posts.filter(post => post.user.username === username);

  useEffect(() => {
    if (currentUser && following.includes(profileUser.id)) {
      setIsFollowing(true);
    }
  }, [currentUser, following, profileUser.id]);

  const handleFollow = () => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }
    followUser(profileUser.id, currentUser.id);
    setIsFollowing(!isFollowing);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 dark:border-gray-800"
              />
              {profileUser.verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profileUser.name}
                  </h1>
                  {profileUser.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {profileUser.role === 'influencer' ? 'Creator' : 'Verified'}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{profileUser.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-4">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatNumber(profileUser.profile.postsCount)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatNumber(profileUser.profile.followerCount)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatNumber(profileUser.profile.followingCount)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-line mb-2">
                {profileUser.profile.bio}
              </p>
              
              {/* Location & Website */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {profileUser.profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileUser.profile.location}
                  </div>
                )}
                {profileUser.profile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={profileUser.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profileUser.profile.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profileUser.profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Fashion Tags */}
            <div className="flex flex-wrap gap-2">
              {profileUser.profile.fashionTags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="tagged" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Tagged
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer">
                  <img
                    src={post.images[0]}
                    alt="Post"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5" />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Saved posts will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="tagged" className="mt-6">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tagged products will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Portfolio highlights will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
