'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, ShieldCheck, Truck, RotateCcw, Edit3 } from 'lucide-react';
import WriteReview from './WriteReview';
import ProductReviews from './ProductReviews';

export default function ProductTabs({ product, initialReviewsData = null }) {
  const [activeTab, setActiveTab] = useState('description');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const handleReviewSubmit = (reviewData) => {
    console.log('Review submitted:', reviewData);
  };

  const reviewsCount =
    typeof initialReviewsData?.count === 'number'
      ? initialReviewsData.count
      : Array.isArray(initialReviewsData?.reviews)
      ? initialReviewsData.reviews.length
      : Array.isArray(initialReviewsData)
      ? initialReviewsData.length
      : typeof product?.reviews === 'number'
      ? product.reviews
      : 0;

  const tabs = [
    { id: 'description', label: 'Description', count: null },
    { id: 'specifications', label: 'Specifications', count: null },
    { id: 'reviews', label: 'Reviews', count: reviewsCount },
    { id: 'size-guide', label: 'Size Guide', count: null },
    { id: 'delivery', label: 'Delivery & Returns', count: null }
  ];

  // Helper: robustly parse JSON that may be single- or double-encoded strings
  const parseMaybeJson = (value, label = 'value') => {
    if (Array.isArray(value) || (value && typeof value === 'object')) return value;
    if (typeof value !== 'string') return value ?? null;
    let current = value.trim();
    for (let i = 0; i < 3; i++) {
      try {
        const parsed = JSON.parse(current);
        if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) return parsed;
        if (typeof parsed === 'string') {
          current = parsed;
          continue;
        }
        return parsed;
      } catch (err) {
        console.warn(`[ProductTabs] Failed parse attempt ${i + 1} for ${label}:`, err, current?.slice?.(0, 120));
        return null;
      }
    }
    console.warn(`[ProductTabs] Exhausted parse attempts for ${label}.`);
    return null;
  };

  // Specifications metadata can come from product.metadata.specification or product.specification
  // Only show metadata; if unavailable, show placeholders (no fallback to product.* fields)
  let specification = product?.metadata?.specification ?? product?.specification ?? null;
  const rawSpec = specification;
  specification = parseMaybeJson(specification, 'metadata.specification');
  if (!specification && typeof rawSpec === 'string') {
    console.warn('[ProductTabs] specification string present but could not parse. First 120 chars:', rawSpec.slice(0, 120));
  }

  // Parse highlights from metadata (can be JSON string and possibly double-encoded)
  const meta = product?.metadata ?? {};
  const rawHighlights = meta?.highlights ?? meta?.key_features ?? product?.highlights ?? [];
  const parsedHighlights = (() => {
    const parsed = parseMaybeJson(rawHighlights, 'metadata.highlights/key_features');
    return Array.isArray(parsed) ? parsed : [];
  })();

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
                {typeof tab.count === 'number' && (
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
              {product?.description?.trim() && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {product.description}
                </p>
              )}
              
              {Array.isArray(parsedHighlights) && parsedHighlights.length > 0 && (
                <>
                  <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {parsedHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <ShieldCheck className="h-6 w-6 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

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
                    <dd className="font-medium text-gray-900 dark:text-white">{specification?.productDetails?.material ?? '—'}</dd>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Care Instructions</dt>
                    {Array.isArray(specification?.productDetails?.careInstructions) ? (
                      <ul className="list-disc list-inside text-gray-900 dark:text-white">
                        {specification.productDetails.careInstructions.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <dd className="font-medium text-gray-900 dark:text-white">—</dd>
                    )}
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Available Sizes</dt>
                    {Array.isArray(specification?.productDetails?.availableSizes) && specification.productDetails.availableSizes.length ? (
                      <dd className="font-medium text-gray-900 dark:text-white">{specification.productDetails.availableSizes.join(', ')}</dd>
                    ) : (
                      <dd className="font-medium text-gray-900 dark:text-white">—</dd>
                    )}
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Available Colors</dt>
                    {Array.isArray(specification?.productDetails?.availableColors) && specification.productDetails.availableColors.length ? (
                      <dd className="font-medium text-gray-900 dark:text-white">{specification.productDetails.availableColors.join(', ')}</dd>
                    ) : (
                      <dd className="font-medium text-gray-900 dark:text-white">—</dd>
                    )}
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">SKU</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{specification?.productDetails?.sku ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 dark:text-gray-400 mb-1">Country of Origin</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{specification?.productDetails?.countryOfOrigin ?? '—'}</dd>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Fit & Styling</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Fit Guide</h4>
                    {Array.isArray(specification?.fitAndStyling?.fitGuide) && specification.fitAndStyling.fitGuide.length ? (
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        {specification.fitAndStyling.fitGuide.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-600 dark:text-gray-300">—</div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Styling Tips</h4>
                    {Array.isArray(specification?.fitAndStyling?.stylingTips) && specification.fitAndStyling.stylingTips.length ? (
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        {specification.fitAndStyling.stylingTips.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-600 dark:text-gray-300">—</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-6xl">
            <ProductReviews productId={product.id} initialReviewsData={initialReviewsData} />
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

      {/* Write Review Modal */}
      <WriteReview
        product={product}
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
