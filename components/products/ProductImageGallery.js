'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Heart, Share2 } from 'lucide-react';

export default function ProductImageGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this product',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden group">
        <img
          src={images[currentImage]}
          alt={`Product image ${currentImage + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 sm:p-3 rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
            >
              <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 sm:p-3 rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
            >
              <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
            title="Zoom"
          >
            <ZoomIn className="h-5 w-5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={handleShare}
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
            title="Share"
          >
            <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm sm:text-sm font-medium">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                currentImage === index
                  ? 'border-black dark:border-white shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Features */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📱</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">Try AR</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">View in your space</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📐</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">Size Guide</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Find your perfect fit</div>
        </div>
      </div>
    </div>
  );
}
