'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, LinkIcon, Hash, User, Mail, Phone, Calendar, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ProfileEditPage() {
  const { user, updateProfile, userRoles } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || '',
    fashionTags: user?.profile?.fashionTags || [],
    avatar: user?.profile?.avatar || null,
    privacy: {
      publicProfile: user?.profile?.privacy?.publicProfile ?? true,
      showEmail: user?.profile?.privacy?.showEmail ?? false,
      showPhone: user?.profile?.privacy?.showPhone ?? false,
      allowMessages: user?.profile?.privacy?.allowMessages ?? true,
      allowTagging: user?.profile?.privacy?.allowTagging ?? true
    }
  });

  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularTags = [
    '#Streetwear', '#Minimal', '#Vintage', '#Bohemian', '#Luxury',
    '#Sustainable', '#Casual', '#Formal', '#Y2K', '#Cottagecore',
    '#Dark Academia', '#Preppy', '#Grunge', '#Kawaii', '#Maximalist'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const addFashionTag = (tag) => {
    if (!formData.fashionTags.includes(tag) && formData.fashionTags.length < 10) {
      setFormData(prev => ({
        ...prev,
        fashionTags: [...prev.fashionTags, tag]
      }));
    }
  };

  const removeFashionTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      fashionTags: prev.fashionTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCustomTag = () => {
    const tag = newTag.startsWith('#') ? newTag : `#${newTag}`;
    if (tag.length > 1) {
      addFashionTag(tag);
      setNewTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate username format
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        toast.error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        return;
      }

      // Validate website URL
      if (formData.website && !formData.website.startsWith('http')) {
        formData.website = `https://${formData.website}`;
      }

      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      router.push(`/profile/${formData.username}`);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to edit your profile.</p>
          <Button onClick={() => router.push('/auth/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your StyleSphere profile and manage your privacy settings
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="fashion">Fashion Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Settings</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your basic profile information that will be visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={formData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-gray-800"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div>
                      <Button type="button" variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="your_username"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        3-20 characters, letters, numbers, and underscores only
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself and your style..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Mumbai, India"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fashion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Fashion Style Tags
                  </CardTitle>
                  <CardDescription>
                    Choose up to 10 tags that represent your fashion style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Tags */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Your Style Tags ({formData.fashionTags.length}/10)
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.fashionTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 cursor-pointer hover:bg-red-100"
                          onClick={() => removeFashionTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Popular Style Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {popularTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant={formData.fashionTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => formData.fashionTags.includes(tag) ? removeFashionTag(tag) : addFashionTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tag Input */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Add Custom Tag
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter custom tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomTag}
                        disabled={!newTag.trim() || formData.fashionTags.length >= 10}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information and interact with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Public Profile</Label>
                        <p className="text-sm text-gray-500">
                          Allow your profile to be visible to everyone
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacy.publicProfile}
                        onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Show Email</Label>
                        <p className="text-sm text-gray-500">
                          Display your email address on your profile
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacy.showEmail}
                        onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Show Phone</Label>
                        <p className="text-sm text-gray-500">
                          Display your phone number on your profile
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacy.showPhone}
                        onCheckedChange={(value) => handlePrivacyChange('showPhone', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Allow Messages</Label>
                        <p className="text-sm text-gray-500">
                          Let other users send you direct messages
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacy.allowMessages}
                        onCheckedChange={(value) => handlePrivacyChange('allowMessages', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Allow Product Tagging</Label>
                        <p className="text-sm text-gray-500">
                          Allow others to tag you in product posts
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacy.allowTagging}
                        onCheckedChange={(value) => handlePrivacyChange('allowTagging', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Type Upgrade */}
              {user.role === 'user' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Upgrade to Creator Account
                    </CardTitle>
                    <CardDescription>
                      Get access to analytics, brand collaboration tools, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button type="button" variant="outline" className="w-full">
                      Apply for Creator Status
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Save Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
