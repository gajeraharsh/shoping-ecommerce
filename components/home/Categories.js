import Link from 'next/link';
import { categories } from '@/utils/mockData';
import SmartImage from '@/components/ui/SmartImage';

export default function Categories() {
  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Shop by Category
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Explore our diverse collection across different styles and occasions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category_id=${encodeURIComponent(category.id || category.slug)}`}
              className="group relative overflow-hidden rounded-lg sm:rounded-2xl aspect-square bg-gray-200 hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0">
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                <h3 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-bold mb-1 line-clamp-1">{category.name}</h3>
                <p className="text-xs sm:text-sm opacity-90">{category.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
