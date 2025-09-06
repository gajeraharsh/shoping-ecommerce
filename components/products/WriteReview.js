'use client';

import { useEffect, useState } from 'react';
import { Star, Camera, X, Check } from 'lucide-react';
import { createReview } from '@/services/modules/review/reviewService';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/hooks/useModal';
import { MODAL_TYPES } from '@/features/ui/modalTypes';
import { useRouter } from 'next/navigation';

export default function WriteReview({ product, isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { open } = useModal();
  const router = useRouter();

  // Show login modal if a guest opens WriteReview
  useEffect(() => {
    if (!isOpen) return;
    if (isAuthenticated) return;
    const next = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
    open({
      type: MODAL_TYPES.CUSTOM,
      props: {
        Component: function LoginRequiredModal({ onClose: close }) {
          const handleLogin = () => {
            close?.();
            onClose?.();
            router.push(`/auth/login?next=${encodeURIComponent(next)}`);
          };
          return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => { close?.(); onClose?.(); }} />
              <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Login Required</h3>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">Please log in to write a review.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => { close?.(); onClose?.(); }}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100" onClick={handleLogin}>Log in</button>
                </div>
              </div>
            </div>
          );
        },
      },
    });
    // Immediately close the WriteReview modal so guests cannot interact
    onClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAuthenticated]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !title.trim() || !comment.trim()) return;
    if (!isAuthenticated) {
      const next = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
      open({
        type: MODAL_TYPES.CUSTOM,
        props: {
          Component: function LoginRequiredModal({ onClose: close }) {
            const handleLogin = () => {
              close?.();
              onClose?.();
              router.push(`/auth/login?next=${encodeURIComponent(next)}`);
            };
            return (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => { close?.(); onClose?.(); }} />
                <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Login Required</h3>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">Please log in to submit a review.</p>
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => { close?.(); onClose?.(); }}>Cancel</button>
                    <button className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100" onClick={handleLogin}>Log in</button>
                  </div>
                </div>
              </div>
            );
          },
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        product_id: String(product.id),
        rating: Number(rating),
        title: title.trim(),
        content: comment.trim(),
      });
      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        onSubmit && onSubmit({ rating, title: title.trim(), content: comment.trim(), productId: product.id });
        onClose();
        resetForm();
      }, 1200);
    } catch (err) {
      // error toast shown via api client interceptors
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setTitle('');
    setComment('');
    setImages([]);
    setIsSubmitting(false);
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {submitted ? 'Review Submitted!' : 'Write a Review'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {submitted ? (
            <div className="text-center py-8">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Thank you for your review!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your review has been submitted and will be published after moderation.
              </p>
            </div>
          ) : (
            <>
              {/* Product Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₹{product.price.toLocaleString()}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience in a few words"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {title.length}/100 characters
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details about your experience with this product. What did you like or dislike? How was the quality, fit, or style?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-none"
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {comment.length}/1000 characters
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Add Photos (Optional)
                  </label>
                  <div className="space-y-3">
                    {images.length > 0 && (
                      <div className="flex gap-3 flex-wrap">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {images.length < 5 && (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Click to upload photos<br />
                            <span className="text-xs">Max 5 images, up to 10MB each</span>
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!rating || !title.trim() || !comment.trim() || isSubmitting}
                    className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-black border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
