'use client';

export default function CartItemsSkeleton() {
  const rows = [1, 2, 3];
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-full overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {rows.map((i) => (
          <div key={i} className="p-4 sm:p-6">
            {/* Mobile */}
            <div className="flex gap-3 sm:hidden">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 border-2 border-gray-200 dark:border-gray-800 rounded-lg animate-pulse" />
                    <div className="h-5 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="w-9 h-9 border-2 border-gray-200 dark:border-gray-800 rounded-lg animate-pulse" />
                  </div>
                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden sm:flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-gray-200 dark:border-gray-800 rounded animate-pulse" />
                <div className="h-6 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="w-8 h-8 border border-gray-200 dark:border-gray-800 rounded animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
