'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Heart, Share2, Maximize2 } from 'lucide-react';

export default function ProductImageGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
    setZoomLevel(1);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isZoomed || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [isZoomed]);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    if (isZoomed) {
      setZoomLevel(1);
    } else {
      setZoomLevel(2);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newLevel = Math.max(prev - 0.5, 1);
      if (newLevel === 1) {
        setIsZoomed(false);
      }
      return newLevel;
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (isFullscreen) {
      setIsZoomed(false);
      setZoomLevel(1);
    }
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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const magnifyStyle = isZoomed ? {
    transform: `scale(${zoomLevel})`,
    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
    cursor: 'zoom-out'
  } : {
    cursor: 'zoom-in'
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          ref={containerRef}
          className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            className="w-full h-full overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            <Image
              ref={imageRef}
              src={images[currentImage]}
              alt={`Product image ${currentImage + 1}`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-300 will-change-transform"
              style={magnifyStyle}
              onClick={handleZoomToggle}
              loading="lazy"
              priority={false}
              unoptimized
            />
          </div>

          {/* Magnifying Glass Overlay */}
          {isHovering && !isZoomed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          )}

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 sm:p-3 rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation z-10"
              >
                <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 sm:p-3 rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation z-10"
              >
                <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={toggleFullscreen}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
              title="Fullscreen"
            >
              <Maximize2 className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
              title="Share"
            >
              <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          {isZoomed && (
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-2 bg-black/70 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white text-sm px-3 py-2 font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                onClick={() => {
                  setCurrentImage(index);
                  setIsZoomed(false);
                  setZoomLevel(1);
                }}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                  currentImage === index
                    ? 'border-black dark:border-white shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Features */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="text-2xl mb-1">📱</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">360° View</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Interactive view</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="text-2xl mb-1">📐</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">Size Guide</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Find your perfect fit</div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full h-full">
              <Image
                src={images[currentImage]}
                alt={`Product image ${currentImage + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                loading="lazy"
                unoptimized
                priority={false}
              />
            </div>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
