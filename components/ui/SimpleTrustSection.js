'use client';

import { Shield, Lock, Truck, RotateCcw, Star, Phone } from 'lucide-react';

export default function SimpleTrustSection({ className = '' }) {
  const badges = [
    {
      icon: Shield,
      title: '256-bit SSL Secured',
      description: 'Your data is protected',
      color: '',
      theme: { from: 'from-emerald-500', to: 'to-emerald-600', ring: 'ring-emerald-300/40' }
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'PCI DSS Compliant',
      color: '',
      theme: { from: 'from-blue-500', to: 'to-indigo-600', ring: 'ring-blue-300/40' }
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on all orders',
      color: '',
      theme: { from: 'from-purple-500', to: 'to-fuchsia-600', ring: 'ring-fuchsia-300/40' }
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Easy return policy',
      color: '',
      theme: { from: 'from-orange-500', to: 'to-rose-600', ring: 'ring-orange-300/40' }
    },
    {
      icon: Star,
      title: '4.8/5 Rating',
      description: '10,000+ Reviews',
      color: '',
      theme: { from: 'from-amber-500', to: 'to-yellow-500', ring: 'ring-amber-300/40' }
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Customer assistance',
      color: '',
      theme: { from: 'from-pink-500', to: 'to-rose-600', ring: 'ring-pink-300/40' }
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 px-4 py-4 sm:px-5 sm:py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-black/20 dark:hover:border-white/20"
          >
            {/* subtle hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${badge.theme?.from} ${badge.theme?.to} opacity-10 blur`}></div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white ring-1 ${badge.theme?.ring} shadow-md bg-gradient-to-br ${badge.theme?.from} ${badge.theme?.to} transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[1deg]`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">{badge.title}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{badge.description}</div>
              </div>
            </div>
            <div className={`pointer-events-none absolute inset-x-0 -bottom-px h-[2px] opacity-70 bg-gradient-to-r ${badge.theme?.from} ${badge.theme?.to}`} />
          </div>
        );
      })}
    </div>
  );
}
