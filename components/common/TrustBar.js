import { Truck, RotateCcw, ShieldCheck, Wallet, BadgeCheck } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      title: 'Free Shipping',
      desc: 'On orders over ₹2,999',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      desc: '7-day hassle-free',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      desc: 'SSL / PCI compliant',
    },
    {
      icon: Wallet,
      title: 'COD Available',
      desc: 'Cash/Card on delivery',
    },
    {
      icon: BadgeCheck,
      title: 'Made in India',
      desc: 'Crafted with care',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 bg-gray-50/60 dark:bg-gray-800/60 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <Icon className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
