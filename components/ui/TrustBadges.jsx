'use client';

import { Shield, Lock, Truck, RotateCcw, Star, Phone, CheckCircle } from 'lucide-react';

export default function TrustBadges({ variant = 'default', className = '' }) {
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

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
        {badges.slice(0, 4).map((badge, index) => (
          <div key={index} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <badge.icon className={`h-3 w-3 ${badge.color}`} />
            <span>{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800 dark:text-green-200">Secure Checkout</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-300">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Data Protected</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Fraud Protection</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {badges.map((badge, index) => (
        <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <badge.icon className={`h-6 w-6 mx-auto mb-2 ${badge.color}`} />
          <div className="text-sm font-medium text-gray-900 dark:text-white">{badge.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</div>
        </div>
      ))}
    </div>
  );
}

export function PaymentSecurityBadges({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure payments with:</div>
      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium border">
          VISA
        </div>
        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium border">
          MASTERCARD
        </div>
        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium border">
          AMERICAN EXPRESS
        </div>
        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium border">
          UPI
        </div>
        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium border">
          PAYPAL
        </div>
      </div>
    </div>
  );
}
