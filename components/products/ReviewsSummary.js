'use client';

import { Star } from 'lucide-react';

export default function ReviewsSummary({ average = 0, count = 0 }) {
  const avgValue = Number.isFinite(average) ? Number(average) : Number.parseFloat(String(average || 0));
  const safeAvgValue = Number.isFinite(avgValue) ? avgValue : 0;
  const avg = safeAvgValue.toFixed(1);
  // Match ProductReviews logic: stars use rounding of the displayed one-decimal average
  const rounded = Math.round(Number(avg));
  return (
    <div className="max-w-3xl">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Customer Reviews
      </h3>
      <div className="flex items-center gap-4 mb-2">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {avg}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= rounded ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Based on {Number.isFinite(count) ? count : 0} reviews
          </div>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Showing aggregate rating and count from product details.</p>
    </div>
  );
}
