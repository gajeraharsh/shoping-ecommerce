'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, ChevronDown, Filter, CheckCircle } from 'lucide-react';
import { getProductReviews, createReview } from '@/services/modules/review/reviewService';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/hooks/useModal';
import { MODAL_TYPES } from '@/features/ui/modalTypes';
import { useRouter } from 'next/navigation';

export default function ProductReviews({ productId, initialReviewsData = null }) {
  // Modal shown when login is required
  function LoginRequiredModal({ title = 'Login Required', message = 'Please log in to write a review.', redirectTo = '/auth/login', onClose }) {
    const router = useRouter();
    const handleLogin = () => {
      onClose?.();
      router.push(redirectTo);
    };
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{message}</p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
              onClick={handleLogin}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mapList = (res) => {
    const list = Array.isArray(res?.reviews) ? res.reviews : Array.isArray(res) ? res : [];
    return list.map((r) => ({
      id: r.id,
      author: [r.first_name, r.last_name].filter(Boolean).join(' ') || 'Anonymous',
      rating: r.rating,
      title: r.title || '',
      content: r.content || '',
      date: r.created_at || r.updated_at || new Date().toISOString(),
      verified: !!r.customer_id,
      helpful: 0,
    }));
  };

  const initialCount = typeof initialReviewsData?.count === 'number'
    ? initialReviewsData.count
    : null;

  const [reviews, setReviews] = useState(() => (initialReviewsData ? mapList(initialReviewsData) : []));
  const [loading, setLoading] = useState(!initialReviewsData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', content: '', name: '' });
  const { isAuthenticated } = useAuth();
  const { open } = useModal();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProductReviews(productId, { limit, offset: 0, order: '-created_at' });
        const mapped = mapList(res);
        if (mounted) setReviews(mapped);
        if (mounted) setTotalCount(typeof res?.count === 'number' ? res.count : null);
        if (mounted) setOffset(mapped.length);
      } catch (e) {
        // errors are auto-toasted by apiClient
        if (mounted) setReviews([]);
        if (mounted) setTotalCount(null);
        if (mounted) setOffset(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (!initialReviewsData && productId) load();
    return () => {
      mounted = false;
    };
  }, [productId, initialReviewsData, limit]);

  // Ensure offset is correct when initial data is provided from parent
  useEffect(() => {
    if (initialReviewsData) {
      const mapped = mapList(initialReviewsData);
      setOffset(mapped.length);
      if (typeof initialReviewsData?.count === 'number') {
        setTotalCount(initialReviewsData.count);
      }
    }
  }, [initialReviewsData]);

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!productId) return;
    const [first_name = '', last_name = ''] = (newReview.name || '').trim().split(/\s+/, 2);
    if (!isAuthenticated) {
      const next = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
      open({
        type: MODAL_TYPES.CUSTOM,
        props: {
          Component: LoginRequiredModal,
          title: 'Login Required',
          message: 'You need to log in to submit a review.',
          redirectTo: `/auth/login?next=${encodeURIComponent(next)}`,
        },
      });
      return;
    }
    try {
      setSubmitting(true);
      await createReview({
        title: newReview.title || undefined,
        content: newReview.content,
        rating: Number(newReview.rating),
        product_id: String(productId),
        first_name,
        last_name,
      });
      // Refresh list
      const res = await getProductReviews(productId, { limit, offset: 0, order: '-created_at' });
      const mapped = mapList(res);
      setReviews(mapped);
      setTotalCount(typeof res?.count === 'number' ? res.count : null);
      setOffset(mapped.length);
      setShowWriteReview(false);
      setNewReview({ rating: 0, title: '', content: '', name: '' });
    } catch (err) {
      // error toast handled globally
    } finally {
      setSubmitting(false);
    }
  };

  const hasMore = typeof totalCount === 'number' 
    ? reviews.length < totalCount 
    : (reviews.length > 0 && reviews.length % limit === 0);

  const loadMore = async () => {
    if (!productId || loadingMore) return;
    try {
      setLoadingMore(true);
      const res = await getProductReviews(productId, { limit, offset, order: '-created_at' });
      const mapped = mapList(res);
      setReviews((prev) => [...prev, ...mapped]);
      setOffset((prev) => prev + mapped.length);
      if (typeof res?.count === 'number') setTotalCount(res.count);
      else if (mapped.length < limit) setTotalCount(offset + mapped.length);
    } catch (e) {
      // handled globally
    } finally {
      setLoadingMore(false);
    }
  };

  const sortedAndFilteredReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true;
      if (filterBy === 'verified') return review.verified;
      if (filterBy === '5star') return review.rating === 5;
      if (filterBy === '4star') return review.rating === 4;
      if (filterBy === '3star') return review.rating === 3;
      if (filterBy === '2star') return review.rating === 2;
      if (filterBy === '1star') return review.rating === 1;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      return 0;
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Reviews
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Based on {reviews.length} reviews
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Rating Breakdown</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={() => {
            if (isAuthenticated) {
              setShowWriteReview((prev) => !prev);
              return;
            }
            const next = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
            open({
              type: MODAL_TYPES.CUSTOM,
              props: {
                Component: LoginRequiredModal,
                title: 'Login Required',
                message: 'You need to log in to write a review.',
                redirectTo: `/auth/login?next=${encodeURIComponent(next)}`,
              },
            });
          }}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className="p-1">
                    <Star className={`h-6 w-6 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-400'} transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Title</label>
              <input type="text" value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} placeholder="Summarize your experience" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review *</label>
              <textarea value={newReview.content} onChange={(e) => setNewReview({ ...newReview, content: e.target.value })} placeholder="Tell others about your experience with this product" rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name *</label>
              <input type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Enter your name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowWriteReview(false)} className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Only</option>
            <option value="5star">5 Stars</option>
            <option value="4star">4 Stars</option>
            <option value="3star">3 Stars</option>
            <option value="2star">2 Stars</option>
            <option value="1star">1 Star</option>
          </select>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedAndFilteredReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.author}
                    </span>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Verified Purchase</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${
                            star <= review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {review.title}
            </h4>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {review.content}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>Size: {review.size}</span>
              <span>Fit: {review.fit}</span>
              <span>Color: {review.color}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <ThumbsDown className="h-4 w-4" />
                  Not Helpful
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 0 && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}

      {sortedAndFilteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or be the first to review this product.
          </p>
        </div>
      )}
    </div>
  );
}
