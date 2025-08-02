'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, ChevronDown, Filter, CheckCircle } from 'lucide-react';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    name: '',
    verified: false
  });

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      author: 'Priya Sharma',
      rating: 5,
      title: 'Perfect fit and beautiful design!',
      content: 'I absolutely love this kurti! The fabric quality is excellent and the fit is perfect. I ordered size M and it fits exactly as expected. The color is vibrant and the stitching is top-notch. Highly recommend!',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      size: 'M',
      fit: 'Perfect',
      color: 'Blue',
      images: []
    },
    {
      id: 2,
      author: 'Anjali R.',
      rating: 4,
      title: 'Good quality, runs slightly large',
      content: 'Beautiful kurti with great fabric quality. The design is elegant and perfect for both casual and formal occasions. However, it runs slightly large, so I would recommend sizing down. Overall very satisfied with the purchase.',
      date: '2024-01-12',
      verified: true,
      helpful: 8,
      size: 'L',
      fit: 'Runs Large',
      color: 'Blue',
      images: []
    },
    {
      id: 3,
      author: 'Sneha K.',
      rating: 5,
      title: 'Exceeded expectations!',
      content: 'This is my third purchase from this brand and they never disappoint. The quality is consistent and the designs are always on trend. Fast delivery and excellent packaging too!',
      date: '2024-01-10',
      verified: true,
      helpful: 15,
      size: 'S',
      fit: 'Perfect',
      color: 'Blue',
      images: []
    },
    {
      id: 4,
      author: 'Meera D.',
      rating: 3,
      title: 'Average quality',
      content: 'The kurti is okay for the price. Fabric is decent but not as soft as I expected. The color is nice and shipping was quick. It\'s fine for casual wear.',
      date: '2024-01-08',
      verified: false,
      helpful: 3,
      size: 'M',
      fit: 'Perfect',
      color: 'Blue',
      images: []
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, []);

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Add review logic here
    console.log('New review:', newReview);
    setShowWriteReview(false);
    setNewReview({ rating: 0, title: '', content: '', name: '', verified: false });
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
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Write Your Review
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="p-1"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= newReview.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 hover:text-yellow-400'
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                placeholder="Summarize your experience"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review *
              </label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                placeholder="Tell others about your experience with this product"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
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
