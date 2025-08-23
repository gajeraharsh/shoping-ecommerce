'use client';

export default function CartSummarySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mt-6" />
      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-4 mx-auto" />
    </div>
  );
}
