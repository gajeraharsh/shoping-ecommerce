import { Truck, RotateCcw, ShieldCheck, CreditCard, Lock, Star, Headphones } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: Lock,
      title: '256-bit SSL Secured',
      desc: 'Your data is protected',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      desc: 'PCI DSS Compliant',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      desc: 'On orders over ₹2,999',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      desc: 'Easy return policy',
    },
    {
      icon: Star,
      title: '4.8/5 Rating',
      desc: '10,000+ Reviews',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'Here whenever you need',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/60 px-3 py-3 sm:px-4 sm:py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 bg-white dark:bg-gray-950 transition-colors">
                  <Icon className="w-5 h-5 text-black dark:text-white" />
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-sm font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                    {title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">{desc}</p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
