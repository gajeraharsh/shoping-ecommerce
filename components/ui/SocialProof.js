'use client';

import { useState } from 'react';
import { Star, Quote, ThumbsUp, Users, MapPin } from 'lucide-react';

export default function SocialProof({ variant = 'reviews' }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      review: 'Amazing quality! The kurti fits perfectly and the fabric is so comfortable.',
      product: 'Elegant Floral Kurti',
      location: 'Mumbai',
      verified: true,
      helpfulCount: 23,
      image: null
    },
    {
      id: 2,
      name: 'Anita Kumar',
      rating: 5,
      review: 'Love the maxi dress! Perfect for evening parties. Will definitely order more.',
      product: 'Chic Maxi Dress',
      location: 'Delhi',
      verified: true,
      helpfulCount: 18,
      image: null
    },
    {
      id: 3,
      name: 'Meera Patel',
      rating: 4,
      review: 'Good quality crop top. Fast delivery and excellent customer service.',
      product: 'Stylish Crop Top',
      location: 'Bangalore',
      verified: true,
      helpfulCount: 12,
      image: null
    }
  ];

  const testimonials = [
    {
      name: 'Kavya Reddy',
      role: 'Fashion Blogger',
      text: 'Fashionista has become my go-to store for ethnic wear. The quality is consistently excellent and the designs are always on-trend.',
      rating: 5,
      image: null
    },
    {
      name: 'Sonia Gupta',
      role: 'Working Professional',
      text: 'I love the variety of professional and casual wear. The size guide is accurate and returns are hassle-free.',
      rating: 5,
      image: null
    },
    {
      name: 'Rhea Singh',
      role: 'College Student',
      text: 'Affordable prices without compromising on quality. The student discount is a great bonus!',
      rating: 5,
      image: null
    }
  ];

  const recentActivity = [
    { action: 'purchased', product: 'Designer Anarkali', time: '2 minutes ago', location: 'Chennai' },
    { action: 'added to wishlist', product: 'Silk Saree', time: '5 minutes ago', location: 'Pune' },
    { action: 'purchased', product: 'Cotton Kurti Set', time: '8 minutes ago', location: 'Kolkata' },
    { action: 'reviewed', product: 'Ethnic Dress', time: '12 minutes ago', location: 'Hyderabad' }
  ];

  if (variant === 'testimonials') {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real feedback from real customers who love shopping with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{testimonials[activeTestimonial].role}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {testimonials[activeTestimonial].text}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonial ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'activity') {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Recent Activity</span>
          </div>
          <div className="space-y-2">
            {recentActivity.slice(0, 2).map((activity, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Someone from <strong>{activity.location}</strong> {activity.action} <strong>{activity.product}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Customer Reviews</h3>
          <p className="text-gray-600 dark:text-gray-300">See what our customers are saying</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {review.name}
                      {review.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {review.location}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{review.review}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Purchased: {review.product}</span>
                <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  {review.helpfulCount}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
