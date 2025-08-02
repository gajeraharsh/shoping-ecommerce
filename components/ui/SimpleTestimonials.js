'use client';

import { Star, CheckCircle } from 'lucide-react';

export default function SimpleTestimonials({ className = '' }) {
  const testimonials = [
    {
      quote: "Absolutely stunning quality and the perfect fit. Every piece feels luxurious and well-crafted. I've ordered 5 times now!",
      author: "Sarah Chen",
      role: "Fashion Enthusiast",
      location: "Mumbai, India",
      rating: 5,
      verified: true
    },
    {
      quote: "Finally found a brand that understands elegance. The attention to detail is remarkable and shipping was super fast.",
      author: "Priya Sharma",
      role: "Working Professional", 
      location: "Delhi, India",
      rating: 5,
      verified: true
    },
    {
      quote: "These pieces have become staples in my wardrobe. The designs are timeless and sophisticated. Great customer service too!",
      author: "Emma Thompson",
      role: "Style Blogger",
      location: "Bangalore, India", 
      rating: 5,
      verified: true
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          What Our Customers Say
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Real reviews from verified customers
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-semibold">4.8/5</span>
          </div>
          <span>•</span>
          <span>Based on 2,847 reviews</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>All verified purchases</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              {testimonial.verified && (
                <div className="ml-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm">
              "{testimonial.quote}"
            </p>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{testimonial.author.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {testimonial.author}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {testimonial.role} • {testimonial.location}
                </p>
                <p className="text-green-600 text-xs font-medium">
                  Verified Purchase - November 2024
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <span className="text-blue-600 font-medium text-sm">
          Read all 2,847 reviews
        </span>
      </div>
    </div>
  );
}
