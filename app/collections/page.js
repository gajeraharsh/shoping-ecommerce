"use client";

import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';

// Known collection IDs (from homepage Hero.js and user-provided Sale ID)
const COLLECTIONS = [
  {
    key: 'new_arrivals',
    title: 'New Arrivals',
    description: 'Fresh drops just in—discover the latest styles first.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2340&auto=format&fit=crop',
    collection_id: 'pcol_01K4G67CX7A92V3YEKSND0KWQ1',
  },
  {
    key: 'best_seller',
    title: 'Best Seller',
    description: "Our most-loved pieces that customers can't get enough of.",
    image:
      'https://images.unsplash.com/photo-1520975930418-5b233e9894a5?q=80&w=2340&auto=format&fit=crop',
    collection_id: 'pcol_01K4G6886D7GMXZ22JDJJCM615',
  },
  {
    key: 'sale',
    title: 'Sale',
    description: 'Limited-time offers and exclusive discounts.',
    image:
      'https://images.unsplash.com/photo-1592878904946-b3cd9f3fbc4b?q=80&w=2340&auto=format&fit=crop',
    // User provided Sale collection id
    collection_id: 'pcol_01K4G691JSYDWEV61J91JNTWP7',
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header section */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white tracking-tight">
            Discover Our Collections
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
            Explore curated edits designed to elevate your wardrobe.
          </p>
        </div>
      </section>

      {/* Collections grid */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.key}
                href={{ pathname: '/products', query: { collection_id: c.collection_id, page: 1 } }}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/5 dark:bg-white/5 border border-gray-200/60 dark:border-gray-800/60 hover:shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              >
                <div className="relative h-64 sm:h-72 lg:h-80 w-full">
                  <SmartImage
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 p-6 sm:p-7 lg:p-8 flex flex-col justify-end">
                  <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-2">{c.title}</h3>
                    <p className="text-white text-sm sm:text-base mb-2 sm:mb-3">
                      {c.description}
                    </p>
                    <span className="inline-flex items-center text-white/90 group-hover:text-white text-sm">
                      <span className="font-medium">Shop now</span>
                      <span className="ml-2 w-6 h-6 rounded-full border border-white/30 group-hover:border-white flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
