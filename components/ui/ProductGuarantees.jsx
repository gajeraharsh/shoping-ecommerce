'use client';

import { Shield, RotateCcw, Truck, HeartHandshake, CheckCircle, Star } from 'lucide-react';

export default function ProductGuarantees({ className = '' }) {
  const guarantees = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Premium materials and craftsmanship guaranteed',
      color: 'text-green-600'
    },
    {
      icon: RotateCcw,
      title: '30-Day Easy Returns',
      description: 'Not satisfied? Return within 30 days for full refund',
      color: 'text-blue-600'
    },
    {
      icon: Truck,
      title: 'Free Shipping & Returns',
      description: 'Complimentary shipping both ways on all orders',
      color: 'text-purple-600'
    },
    {
      icon: HeartHandshake,
      title: 'Customer Satisfaction',
      description: '99% customer satisfaction rate',
      color: 'text-pink-600'
    }
  ];

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Our Promise to You
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Shop with confidence knowing you're protected
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <guarantee.icon className={`h-5 w-5 mt-0.5 ${guarantee.color} flex-shrink-0`} />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {guarantee.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {guarantee.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">Premium Customer Protection</span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          All purchases include our comprehensive protection plan covering quality issues, 
          sizing problems, and damage during shipping.
        </p>
      </div>
    </div>
  );
}

export function QuickGuarantees({ className = '' }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span>Quality Guaranteed</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <span>Easy Returns</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <CheckCircle className="h-4 w-4 text-purple-600" />
        <span>Free Shipping</span>
      </div>
    </div>
  );
}
