'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'size-guide', label: 'Size Guide' }
  ];

  const mockReviews = [
    {
      id: 1,
      user: 'Priya S.',
      rating: 5,
      date: '2024-01-10',
      comment: 'Beautiful product! The quality is excellent and fits perfectly.',
      verified: true
    },
    {
      id: 2,
      user: 'Anita K.',
      rating: 4,
      date: '2024-01-08',
      comment: 'Good quality fabric, though the color is slightly different from the image.',
      verified: true
    },
    {
      id: 3,
      user: 'Meera R.',
      rating: 5,
      date: '2024-01-05',
      comment: 'Loved it! Will definitely order more.',
      verified: false
    }
  ];

  return (
    <div className="mt-8 sm:mt-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 sm:space-x-8 min-w-max px-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="py-4 sm:py-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>
            <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-white text-base sm:text-lg">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <li>Premium quality fabric</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Easy care and maintenance</li>
              <li>Perfect for casual and semi-formal occasions</li>
            </ul>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">Product Details</h4>
              <dl className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <dt className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Fabric:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{product.fabric}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <dt className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Care Instructions:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{product.care}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <dt className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Available Sizes:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{product.sizes.join(', ')}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <dt className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Available Colors:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{product.colors.join(', ')}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">Fit & Styling</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                <li>Regular fit</li>
                <li>Model is 5'6" wearing size M</li>
                <li>Pairs well with jeans, palazzo, or leggings</li>
                <li>Suitable for machine wash</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{product.rating}</div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{product.reviews} reviews</div>
              </div>
              
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-xs sm:text-sm w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${rating === 5 ? 60 : rating === 4 ? 30 : 10}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 w-8">
                      {rating === 5 ? '60%' : rating === 4 ? '30%' : '10%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{review.user}</span>
                        {review.verified && (
                          <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded w-fit">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'size-guide' && (
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-base sm:text-lg">Size Chart</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-3 sm:px-4 py-2 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm sm:text-base font-medium">Size</th>
                    <th className="px-3 sm:px-4 py-2 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm sm:text-base font-medium">Bust (in)</th>
                    <th className="px-3 sm:px-4 py-2 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm sm:text-base font-medium">Waist (in)</th>
                    <th className="px-3 sm:px-4 py-2 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm sm:text-base font-medium">Hip (in)</th>
                    <th className="px-3 sm:px-4 py-2 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm sm:text-base font-medium">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white text-sm sm:text-base">S</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">34-36</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">28-30</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">36-38</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white text-sm sm:text-base">M</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">36-38</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">30-32</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">38-40</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white text-sm sm:text-base">L</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">38-40</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">32-34</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">40-42</td>
                    <td className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-2 font-medium text-gray-900 dark:text-white text-sm sm:text-base">XL</td>
                    <td className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">40-42</td>
                    <td className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">34-36</td>
                    <td className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">42-44</td>
                    <td className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">28-30</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <p className="mb-2 font-medium text-gray-900 dark:text-white">How to measure:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bust: Measure around the fullest part of your chest</li>
                <li>Waist: Measure around your natural waistline</li>
                <li>Hip: Measure around the fullest part of your hips</li>
                <li>Length: Measure from shoulder to desired length</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
