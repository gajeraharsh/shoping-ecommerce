'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
      <div className="flex items-baseline space-x-2 overflow-x-auto scrollbar-hide py-1">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-baseline space-x-2 flex-shrink-0">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" style={{marginTop: '1px'}} />
            )}
            {item.current ? (
              <span 
                className="text-gray-500 dark:text-gray-400 text-sm font-medium truncate max-w-[100px] sm:max-w-[140px] md:max-w-[200px]" 
                title={item.name}
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
