'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, ShieldCheck, Truck, RotateCcw, Edit3 } from 'lucide-react';
import WriteReview from './WriteReview';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const handleReviewSubmit = (reviewData) => {
    console.log('Review submitted:', reviewData);
  };

  const tabs = [
    { id: 'description', label: 'Description', count: null },
    { id: 'specifications', label: 'Specifications', count: null },
    { id: 'reviews', label: 'Reviews', count: product.reviews },
    { id: 'size-guide', label: 'Size Guide', count: null },
    { id: 'delivery', label: 'Delivery & Returns', count: null }
  ];

  const mockReviews = [
    {
      id: 1,
      user: 'Priya S.',
      rating: 5,
      date: '2024-01-10',
      comment: 'Beautiful product! The quality is excellent and fits perfectly. The fabric feels premium and the color is exactly as shown in the images.',
      verified: true,
      helpful: 12,
      images: [
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
      ]
    },
    {
      id: 2,
      user: 'Anita K.',
      rating: 4,
      date: '2024-01-08',
      comment: 'Good quality fabric, though the color is slightly different from the image. Overall satisfied with the purchase. Fast delivery.',
      verified: true,
      helpful: 8,
      images: []
    },
    {
      id: 3,
      user: 'Meera R.',
      rating: 5,
      date: '2024-01-05',
      comment: 'Loved it! Will definitely order more. The sizing is perfect and the material is very comfortable.',
      verified: false,
      helpful: 15,
      images: []
    },
    {
      id: 4,
      user: 'Sneha P.',
      rating: 4,
      date: '2024-01-03',
      comment: 'Great product for the price. The stitching is neat and the fit is as expected. Recommended!',
      verified: true,
      helpful: 6,
      images: []
    }
  ];

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 sm:space-x-8 min-w-max px-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap flex items-center gap-2 touch-manipulation ${
                  activeTab === tab.id
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="py-8">
        {activeTab === 'description' && (
          <div className="max-w-4xl">
            <div className="prose max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                {product.description}
              </p>
              
              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {product.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <ShieldCheck className="h-6 w-6 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-medium">{highlight}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">Care Instructions</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">To maintain the quality and longevity:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                  <li>{product.care}</li>
                  <li>Iron on low heat if needed</li>
                  <li>Store in a cool, dry place</li>
                  <li>Avoid direct sunlight when drying</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Product Details</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Material</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{product.fabric}</dd>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Care Instructions</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{product.care}</dd>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Available Sizes</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{product.sizes.join(', ')}</dd>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Available Colors</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{product.colors.join(', ')}</dd>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">SKU</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">MOD{product.id.toString().padStart(4, '0')}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Country of Origin</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">India</dd>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Fit & Styling</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Fit Guide</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Regular fit design</li>
                      <li>• Model is 5'6" wearing size M</li>
                      <li>• True to size - order your usual size</li>
                      <li>• Comfortable for all-day wear</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Styling Tips</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Pairs well with jeans or palazzo</li>
                      <li>• Perfect for casual outings</li>
                      <li>• Layer with jackets for cooler weather</li>
                      <li>• Suitable for office and casual wear</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-6xl">
            {/* Write Review Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowWriteReview(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
              >
                <Edit3 className="h-4 w-4" />
                Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 sm:h-5 sm:w-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-4">Based on {product.reviews} reviews</div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-4">{rating}</span>
                        <Star className="h-4 w-4 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ 
                              width: `${rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
                          {rating === 5 ? '65%' : rating === 4 ? '25%' : rating === 3 ? '8%' : rating === 2 ? '2%' : '0%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {mockReviews.map(review => (
                    <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{review.user}</span>
                            {review.verified && (
                              <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4 sm:h-3 sm:w-3" />
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 sm:h-4 sm:w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{review.comment}</p>
                      
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 touch-manipulation py-2">
                          <ThumbsUp className="h-5 w-5 sm:h-4 sm:w-4" />
                          <span className="text-sm sm:text-sm">Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 touch-manipulation py-2">
                          <MessageCircle className="h-5 w-5 sm:h-4 sm:w-4" />
                          <span className="text-sm sm:text-sm">Reply</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button className="btn-outline">
                    Load More Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'size-guide' && (
          <div className="max-w-4xl">
            <h3 className="font-semibold text-2xl mb-6 text-gray-900 dark:text-white">Size Chart</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">Size</th>
                    <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">Bust (inches)</th>
                    <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">Waist (inches)</th>
                    <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">Hip (inches)</th>
                    <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white">S</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">34-36</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">28-30</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">36-38</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">28-30</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white">M</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">36-38</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">30-32</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">38-40</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">28-30</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white">L</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">38-40</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">32-34</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">40-42</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">28-30</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">XL</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">40-42</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">34-36</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">42-44</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">28-30</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">How to Measure</h4>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>• <strong>Bust:</strong> Measure around the fullest part of your chest</li>
                  <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                  <li>• <strong>Hip:</strong> Measure around the fullest part of your hips</li>
                  <li>• <strong>Length:</strong> Measure from shoulder to desired length</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-4">Size Tips</h4>
                <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                  <li>• Order your usual size for regular fit</li>
                  <li>• Size up if you prefer a relaxed fit</li>
                  <li>• Check individual product notes for specific sizing</li>
                  <li>• Contact us for personalized size assistance</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg sm:text-xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="h-7 w-7 sm:h-6 sm:w-6" />
                  <span className="text-lg sm:text-xl">Delivery Information</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Free Delivery</h4>
                    <p className="text-green-800 dark:text-green-200 mb-3">On all orders above ₹999</p>
                    <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                      <li>• Standard delivery: {product.deliveryTime}</li>
                      <li>• Express delivery: 1-2 business days (₹99)</li>
                      <li>• Same day delivery: Available in select cities</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Cash on Delivery</h4>
                    <p className="text-blue-800 dark:text-blue-200 mb-3">Available for orders above ₹999</p>
                    <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                      <li>• ₹50 COD charges apply</li>
                      <li>• Available across India</li>
                      <li>• Payment by cash/card to delivery partner</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg sm:text-xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <RotateCcw className="h-7 w-7 sm:h-6 sm:w-6" />
                  <span className="text-lg sm:text-xl">Returns & Exchange</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Easy Returns</h4>
                    <p className="text-purple-800 dark:text-purple-200 mb-3">{product.returnPolicy}</p>
                    <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                      <li>• No questions asked returns</li>
                      <li>• Free return pickup</li>
                      <li>• Instant refund processing</li>
                      <li>• Size exchange available</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">Return Conditions</h4>
                    <ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
                      <li>• Items must be unused and with tags</li>
                      <li>• Original packaging required</li>
                      <li>• Intimates and sale items are non-returnable</li>
                      <li>• Custom/personalized items are non-returnable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
