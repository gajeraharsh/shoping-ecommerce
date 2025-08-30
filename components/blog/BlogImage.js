'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

export default function BlogImage({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "aspect-video",
  priority = false,
  fallbackType = "gradient" 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Generate a unique gradient based on alt text
  const generateGradient = (text) => {
    const colors = [
      'from-pink-400 to-purple-600',
      'from-blue-400 to-indigo-600', 
      'from-green-400 to-teal-600',
      'from-yellow-400 to-orange-600',
      'from-red-400 to-pink-600',
      'from-purple-400 to-pink-600',
      'from-indigo-400 to-blue-600',
      'from-teal-400 to-green-600'
    ];
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (imageError || !src) {
    // Error/empty fallback: show skeleton if requested, else gradient placeholder
    if (fallbackType === 'skeleton') {
      return (
        <div className={`${aspectRatio} ${className} relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-600">
              <ImageIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${aspectRatio} ${className} relative overflow-hidden rounded-lg bg-gradient-to-br ${generateGradient(alt)} flex items-center justify-center`}>
        <div className="text-center text-white/80">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm font-medium">Fashion Image</p>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    );
  }

  return (
    <div className={`${aspectRatio} ${className} relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800`}>
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-600">
            <ImageIcon className="w-8 h-8" />
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <SmartImage
        src={src}
        alt={alt}
        className={`object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={priority}
      />
    </div>
  );
}

// Author avatar component with fallback
export function AuthorAvatar({ 
  src, 
  alt, 
  className = "w-10 h-10 rounded-full object-cover",
  fallbackText = "U"
}) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateAvatarColor = (name) => {
    const colors = [
      'bg-pink-500',
      'bg-purple-500', 
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (imageError || !src) {
    return (
      <div className={`${className} ${generateAvatarColor(alt)} flex items-center justify-center text-white font-semibold text-sm`}>
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <SmartImage
        src={src}
        alt={alt}
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
