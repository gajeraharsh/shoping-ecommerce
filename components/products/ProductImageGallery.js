'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Heart, Share2, Maximize2, Play } from 'lucide-react';

export default function ProductImageGallery({ images, productName = 'Product', videoUrl = null }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Slider drag/swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragX, setDragX] = useState(0);
  // Separate widths for main and modal containers to avoid mismatch
  const [mainW, setMainW] = useState(0);
  const [modalW, setModalW] = useState(0);
  // Drag base width used for threshold during an active drag
  const [dragBaseW, setDragBaseW] = useState(0);
  // Enable dragging/swiping only on mobile viewports
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const modalContainerRef = useRef(null);
  // Video refs for programmatic play/pause
  const videoRefs = useRef({});
  const modalVideoRefs = useRef({});

  // Build slides with optional video as second slide
  const slides = useMemo(() => {
    const imgs = Array.isArray(images) ? images.filter(Boolean) : [];
    if (!videoUrl) return imgs.map((src) => ({ type: 'image', src }));
    if (imgs.length === 0) return [{ type: 'video', src: videoUrl }];
    const first = imgs[0];
    const rest = imgs.slice(1);
    return [{ type: 'image', src: first }, { type: 'video', src: videoUrl }, ...rest.map((s) => ({ type: 'image', src: s }))];
  }, [images, videoUrl]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % slides.length);
    setIsZoomed(false);
    setZoomLevel(1);
    setIsDragging(false);
    setDragX(0);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + slides.length) % slides.length);
    setIsZoomed(false);
    setZoomLevel(1);
    setIsDragging(false);
    setDragX(0);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isZoomed || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [isZoomed]);

  const handleZoomToggle = () => {
    // Avoid toggling zoom if user dragged slider
    if (isDragging || Math.abs(dragX) > 10) {
      return;
    }
    // Do not zoom for video slides
    if (slides[currentImage]?.type === 'video') return;
    setIsZoomed(!isZoomed);
    if (isZoomed) {
      setZoomLevel(1);
    } else {
      setZoomLevel(2);
    }
  };

  // Drag/Swipe handlers for slider (main + modal)
  const startDrag = (x, containerEl) => {
    setIsDragging(true);
    setDragStartX(x);
    const w = containerEl ? containerEl.clientWidth : (containerRef.current ? containerRef.current.clientWidth : 0);
    setDragBaseW(w || 0);
  };
  const moveDrag = (x) => {
    if (!isDragging || dragStartX == null) return;
    setDragX(x - dragStartX);
  };
  const endDrag = () => {
    if (!isDragging) return;
    const baseW = dragBaseW || (isFullscreen ? modalW : mainW);
    const threshold = Math.max(40, (baseW || 0) * 0.15);
    if (dragX <= -threshold) {
      nextImage();
    } else if (dragX >= threshold) {
      prevImage();
    }
    setIsDragging(false);
    setDragX(0);
    setDragStartX(null);
    setDragBaseW(0);
  };

  const onTouchStart = (e) => startDrag(e.touches[0].clientX, containerRef.current);
  const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
  const onTouchEnd = () => endDrag();
  const onMouseDown = (e) => startDrag(e.clientX, containerRef.current);
  const onMouseMoveDrag = (e) => moveDrag(e.clientX);
  const onMouseUp = () => endDrag();
  const onMouseLeave = () => endDrag();

  // Measure main container width on mount/resize for precise slide translation
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setMainW(containerRef.current.clientWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // When opening modal, ensure we have the modal container width for first render
  useEffect(() => {
    if (isFullscreen && modalContainerRef.current) {
      setModalW(modalContainerRef.current.clientWidth);
    }
  }, [isFullscreen]);

  // Keep modal width in sync while open using ResizeObserver (more reliable than window resize)
  useEffect(() => {
    if (!isFullscreen || !modalContainerRef.current) return;
    const el = modalContainerRef.current;
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cw = entry.contentRect.width;
          if (cw && cw !== modalW) setModalW(cw);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [isFullscreen, modalContainerRef.current, modalW]);

  // Track viewport to enable slider drag only on mobile (lg breakpoint: 1024px)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
    };
  }, []);

  // Preload adjacent images to reduce perceived lag
  useEffect(() => {
    if (!images || images.length === 0) return;
    if (!slides.length) return;
    const nextIdx = (currentImage + 1) % slides.length;
    const prevIdx = (currentImage - 1 + slides.length) % slides.length;
    [slides[nextIdx], slides[prevIdx]].forEach((slide) => {
      if (!slide || slide.type !== 'image') return;
      const img = new window.Image();
      img.src = slide.src;
    });
  }, [currentImage, slides]);

  // Auto play/pause videos depending on active slide (main vs modal)
  useEffect(() => {
    // Main view videos (only when not fullscreen)
    if (!isFullscreen) {
      Object.entries(videoRefs.current).forEach(([idx, v]) => {
        if (!v) return;
        try {
          if (Number(idx) === currentImage) {
            v.muted = true;
            v.playsInline = true;
            v.play().catch(() => {});
          } else {
            v.pause();
            v.currentTime = 0;
          }
        } catch {}
      });
    }
  }, [currentImage, isFullscreen]);

  useEffect(() => {
    // Modal videos (only when fullscreen)
    if (isFullscreen) {
      Object.entries(modalVideoRefs.current).forEach(([idx, v]) => {
        if (!v) return;
        try {
          if (Number(idx) === currentImage) {
            v.muted = true;
            v.playsInline = true;
            v.play().catch(() => {});
          } else {
            v.pause();
            v.currentTime = 0;
          }
        } catch {}
      });
    } else {
      // Ensure modal videos are paused when closing
      Object.values(modalVideoRefs.current).forEach((v) => {
        try { if (v) { v.pause(); v.currentTime = 0; } } catch {}
      });
    }
  }, [currentImage, isFullscreen]);

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
          className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden group select-none"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            className="w-full h-full overflow-hidden"
            onMouseMove={(e) => { handleMouseMove(e); if (isMobile) onMouseMoveDrag(e); }}
            onMouseDown={isMobile ? onMouseDown : undefined}
            onMouseUp={isMobile ? onMouseUp : undefined}
            onMouseLeave={isMobile ? onMouseLeave : undefined}
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
            style={{ touchAction: isMobile ? 'pan-y' : 'auto' }}
          >
            {/* Slider track */}
            <div
              className="flex h-full"
              style={{
                transform: `translateX(${(-((containerRef.current && containerRef.current.clientWidth) ? containerRef.current.clientWidth : mainW) * currentImage) + dragX}px)`,
                transition: isDragging ? 'none' : 'transform 300ms ease',
              }}
            >
              {slides.map((slide, idx) => (
                <div key={idx} className="relative h-full shrink-0 basis-full bg-black">
                  {slide.type === 'image' ? (
                    <Image
                      ref={idx === currentImage ? imageRef : null}
                      src={slide.src}
                      alt={`${productName} – image ${idx + 1}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      style={idx === currentImage ? magnifyStyle : undefined}
                      onClick={idx === currentImage ? handleZoomToggle : undefined}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      priority={idx === 0}
                      unoptimized
                    />
                  ) : (
                    <video
                      ref={(el) => { if (el) { videoRefs.current[idx] = el; } else { delete videoRefs.current[idx]; } }}
                      src={slide.src}
                      controls={false}
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover bg-black"
                    />
                  )}
                  {slide.type === 'video' && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none select-none">
                      {idx === currentImage ? 'Playing' : 'Paused'}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
          {slides.length > 1 && (
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
              onClick={() => setIsFullscreen(true)}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
              title="Fullscreen"
            >
              <Maximize2 className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={async () => {
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
              }}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-3 sm:p-2 rounded-full text-gray-700 dark:text-gray-300 transition-colors touch-manipulation"
              title="Share"
            >
              <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          {isZoomed && slides[currentImage]?.type === 'image' && (
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-2 bg-black/70 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white text-sm px-3 py-2 font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Image Counter */}
          {slides.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImage + 1} / {slides.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {slides.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pt-1 sm:pt-2 pb-2 px-1 sm:px-2">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImage(idx);
                  setIsZoomed(false);
                  setZoomLevel(1);
                }}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 transition-all duration-300 touch-manipulation ${
                  currentImage === idx
                    ? 'border-transparent ring-2 ring-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-900 z-10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  {slide.type === 'image' ? (
                    <Image
                      src={slide.src}
                      alt={`${productName} – thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      unoptimized
                    />
                  ) : (
                    <video
                      src={slide.src}
                      controls={false}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        try {
                          const v = e.currentTarget;
                          v.currentTime = Math.min(2, (v.duration || 3) / 2);
                          v.pause();
                        } catch {}
                      }}
                      className="w-full h-full object-cover bg-black"
                    />
                  )}
                  {slide.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 text-white rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button - ensure top z and clickable */}
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 pointer-events-auto"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content area - stop propagation so clicks inside don't close */}
          <div
            ref={modalContainerRef}
            className="relative w-full h-[90vh] max-w-4xl flex items-center justify-start overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={isMobile ? (e) => startDrag(e.touches[0].clientX, modalContainerRef.current) : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
            onMouseDown={isMobile ? (e) => startDrag(e.clientX, modalContainerRef.current) : undefined}
            onMouseMove={isMobile ? onMouseMoveDrag : undefined}
            onMouseUp={isMobile ? onMouseUp : undefined}
            onMouseLeave={isMobile ? onMouseLeave : undefined}
            style={{ touchAction: isMobile ? 'pan-y' : 'auto' }}
          >
            {/* Modal slider track */}
            <div
              className="flex w-full h-full"
              style={{
                transform: `translateX(${(-((modalContainerRef.current && modalContainerRef.current.clientWidth) ? modalContainerRef.current.clientWidth : modalW) * currentImage) + dragX}px)`,
                transition: isDragging ? 'none' : 'transform 300ms ease',
                willChange: 'transform',
              }}
            >
              {slides.map((slide, idx) => {
                const isCurrent = idx === currentImage;
                const isNeighbor = idx === (currentImage + 1) % slides.length || idx === (currentImage - 1 + slides.length) % slides.length;
                return (
                  <div key={idx} className="relative w-full h-full shrink-0 basis-full bg-black">
                    {slide.type === 'image' ? (
                      <Image
                        src={slide.src}
                        alt={`${productName} – image ${idx + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        loading={(isCurrent || isNeighbor) ? 'eager' : 'lazy'}
                        unoptimized
                        priority={isCurrent}
                      />
                    ) : (
                      <video
                        ref={(el) => { if (el) { modalVideoRefs.current[idx] = el; } else { delete modalVideoRefs.current[idx]; } }}
                        src={slide.src}
                        controls={false}
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover bg-black"
                      />
                    )}
                    {slide.type === 'video' && (
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none select-none">
                        {idx === currentImage ? 'Playing' : 'Paused'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {slides.length > 1 && (
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
