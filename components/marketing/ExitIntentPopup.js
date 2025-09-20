'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Clock, Sparkles } from 'lucide-react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    // Check if popup was already shown this session
    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    let mouseLeaveTimer;

    const handleMouseLeave = (e) => {
      // Only trigger if mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown) {
        mouseLeaveTimer = setTimeout(() => {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }, 500);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (mouseLeaveTimer) clearTimeout(mouseLeaveTimer);
    };
  }, [hasShown]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Handle escape key press
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Here you would typically handle the discount claim
    console.log('Discount claimed!');
    setIsVisible(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 focus-within:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg"
          aria-label="Close popup"
          type="button"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header with animation */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 sm:p-4 lg:p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"></div>

          <div className="relative z-10">
            <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 animate-bounce" />
            <h2 id="popup-title" className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">Wait! Don't Leave Yet!</h2>
            <p id="popup-description" className="text-red-100 text-sm sm:text-base">You're about to miss out on something special...</p>
          </div>

          {/* Floating elements */}
          <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 right-6 w-3 h-3 bg-pink-300 rounded-full animate-pulse delay-300"></div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {/* Offer */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-yellow-100 text-yellow-800 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
              EXCLUSIVE OFFER
            </div>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Get <span className="text-red-500">20% OFF</span> Your First Order!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 px-2">
              Plus Free Shipping Across India. Limited time offer!
            </p>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span className="text-sm sm:text-base lg:text-lg font-bold text-red-500">
                Expires in: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">What you'll get:</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                20% discount on your first purchase
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                Free Shipping Across India
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                Access to exclusive member deals
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                Priority customer support
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🎉 Claim My 20% Discount
            </button>

            <button
              onClick={handleClose}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm py-2"
            >
              No thanks, I'll pay full price
            </button>
          </div>

          {/* Social proof */}
          <div className="text-center mt-3 sm:mt-4">
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-yellow-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm sm:text-base lg:text-lg">★</span>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
              Join 50,000+ happy customers who saved with this offer
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="bg-gray-50 dark:bg-gray-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t dark:border-gray-600">
          <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            <span>🔒 Secure</span>
            <span>📦 Free Returns</span>
            <span>⚡ Instant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
