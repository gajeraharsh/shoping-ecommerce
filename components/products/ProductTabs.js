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
    <div className="mt-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            <h4 className="font-semibold mt-4 mb-2 text-gray-900 dark:text-white">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>Premium quality fabric</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Easy care and maintenance</li>
              <li>Perfect for casual and semi-formal occasions</li>
            </ul>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Product Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Fabric:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.fabric}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Care Instructions:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.care}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Available Sizes:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.sizes.join(', ')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Available Colors:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.colors.join(', ')}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Fit & Styling</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
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
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{product.rating}</div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">{product.reviews} reviews</div>
              </div>
              
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${rating === 5 ? 60 : rating === 4 ? 30 : 10}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {rating === 5 ? '60%' : rating === 4 ? '30%' : '10%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
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
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'size-guide' && (
          <div>
            <h4 className="font-semibold mb-4">Size Chart</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border-b">Size</th>
                    <th className="px-4 py-2 text-left border-b">Bust (inches)</th>
                    <th className="px-4 py-2 text-left border-b">Waist (inches)</th>
                    <th className="px-4 py-2 text-left border-b">Hip (inches)</th>
                    <th className="px-4 py-2 text-left border-b">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-medium">S</td>
                    <td className="px-4 py-2 border-b">34-36</td>
                    <td className="px-4 py-2 border-b">28-30</td>
                    <td className="px-4 py-2 border-b">36-38</td>
                    <td className="px-4 py-2 border-b">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-medium">M</td>
                    <td className="px-4 py-2 border-b">36-38</td>
                    <td className="px-4 py-2 border-b">30-32</td>
                    <td className="px-4 py-2 border-b">38-40</td>
                    <td className="px-4 py-2 border-b">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-medium">L</td>
                    <td className="px-4 py-2 border-b">38-40</td>
                    <td className="px-4 py-2 border-b">32-34</td>
                    <td className="px-4 py-2 border-b">40-42</td>
                    <td className="px-4 py-2 border-b">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">XL</td>
                    <td className="px-4 py-2">40-42</td>
                    <td className="px-4 py-2">34-36</td>
                    <td className="px-4 py-2">42-44</td>
                    <td className="px-4 py-2">28-30</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2"><strong>How to measure:</strong></p>
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
