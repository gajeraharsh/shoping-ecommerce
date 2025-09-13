"use client";
import Link from 'next/link';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import SmartImage from '@/components/ui/SmartImage';

export default function Categories() {
  // Use categories already fetched for header via Redux (feature/categorySlice)
  const categoryTree = useSelector((s) => s.category?.items || []);

  // Flatten tree and filter nodes marked for home display
  const categories = useMemo(() => {
    const out = [];
    const visit = (node) => {
      if (!node) return;
      const m = node.metadata || node.meta || {};
      const isForHome = m?.is_category_list === true || m?.is_category_list === 'true' || m?.is_category_list === 1 || m?.is_category_list === '1';
      if (isForHome) out.push(node);
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    categoryTree.forEach(visit);
    // Keep stable order by name, then id
    return out.sort((a, b) => (a?.name || '').localeCompare(b?.name || '') || String(a?.id).localeCompare(String(b?.id))).slice(0, 8);
  }, [categoryTree]);

  if (!categories.length) return null; // No selected categories; hide section
  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Shop by Category
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Explore our diverse collection across different styles and occasions
          </p>
        </div>

        {/* Mobile: Horizontal scrollable categories */}
        <div className="sm:hidden -mx-3 pb-1">
          <div
            className="flex gap-3 overflow-x-auto px-3 scroll-smooth snap-x snap-mandatory"
            role="list"
            aria-label="Browse categories"
          >
            {categories.map((category, idx) => {
              const image = category?.metadata?.image_url || category?.meta?.image_url || category?.thumbnail || '/icons/fallback-image.svg'
              return (
              <Link
                key={category.id}
                href={`/products?category_id=${encodeURIComponent(category.id || category.slug)}`}
                aria-label={`Open category ${category.name}`}
                className="group relative overflow-hidden rounded-2xl min-w-[72%] xs:min-w-[64%] aspect-[4/5] bg-gray-200 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-black/20 dark:hover:border-white/20 snap-start touch-manipulation active:scale-[0.99] transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <SmartImage
                    src={image}
                    alt={`Category: ${category.name}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
                    priority={idx === 0}
                  />
                </div>
                {/* Minimal: only category name, bright image, no overlays */}
                <div className="absolute inset-x-3 bottom-3">
                  <h3 className="text-white text-lg xs:text-xl font-semibold tracking-tight leading-none line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                    {category.name}
                  </h3>
                </div>
              </Link>
              )
            })}
          </div>
        </div>

        {/* Tablet/Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category, idx) => {
            const image = category?.metadata?.image_url || category?.meta?.image_url || category?.thumbnail || '/icons/fallback-image.svg'
            return (
            <Link
              key={category.id}
              href={`/products?category_id=${encodeURIComponent(category.id || category.slug)}`}
              aria-label={`Open category ${category.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-200 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 dark:focus-visible:ring-white/60"
            >
              <div className="absolute inset-0">
                <SmartImage
                  src={image}
                  alt={`Category: ${category.name}`}
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={idx === 0}
                />
              </div>
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                <h3 className="text-white text-base sm:text-lg lg:text-2xl font-semibold tracking-tight leading-none line-clamp-1 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.65)]">
                  {category.name}
                </h3>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}

