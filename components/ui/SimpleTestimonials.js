'use client';

import { Star, CheckCircle } from 'lucide-react';

export default function SimpleTestimonials({ className = '' }) {
  const testimonials = [
    {
      quote: "Loved the fit and flare of the Anarkali kurti — airy, elegant, and perfect for festive dinners. The fabric feels premium and doesn’t bleed after wash.",
      author: "Priya Sharma",
      role: "Software Engineer",
      location: "Delhi, India",
      rating: 5,
      verified: true
    },
    {
      quote: "Your cotton straight‑cut kurti is my daily go‑to. Breathable for Mumbai heat and the stitching is neat. True to size and very comfortable.",
      author: "Aishwarya Iyer",
      role: "Teacher",
      location: "Mumbai, India",
      rating: 5,
      verified: true
    },
    {
      quote: "The rayon A‑line kurti drapes beautifully. Minimal yet classy — paired it with oxidised jhumkas and got so many compliments!",
      author: "Neha Verma",
      role: "Marketing Manager",
      location: "Bengaluru, India",
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
            <Star className="h-4 w-4 text-gray-900 dark:text-white fill-current" />
            <span className="font-semibold">4.8/5</span>
          </div>
          <span>•</span>
          <span>Based on 2,847 reviews</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span>All verified purchases</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-900 dark:text-white fill-current" />
              ))}
              {testimonial.verified && (
                <div className="ml-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Verified</span>
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
                <p className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                  Verified Purchase - September 2025
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <span className="text-gray-900 dark:text-white font-medium text-sm underline underline-offset-4">
          Read all 2,847 reviews
        </span>
      </div>
    </div>
  );
}
