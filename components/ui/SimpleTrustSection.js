'use client';

import { Shield, Lock, Truck, RotateCcw, Star, Phone } from 'lucide-react';

export default function SimpleTrustSection({ className = '' }) {
  const badges = [
    {
      icon: Shield,
      title: '256-bit SSL Secured',
      description: 'Your data is protected',
      color: 'text-green-600'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'PCI DSS Compliant',
      color: 'text-blue-600'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹2,999',
      color: 'text-purple-600'
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Easy return policy',
      color: 'text-orange-600'
    },
    {
      icon: Star,
      title: '4.8/5 Rating',
      description: '10,000+ Reviews',
      color: 'text-yellow-600'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Customer assistance',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <Icon className={`h-6 w-6 mx-auto mb-2 ${badge.color}`} />
            <div className="text-sm font-medium text-gray-900 dark:text-white">{badge.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</div>
          </div>
        );
      })}
    </div>
  );
}
