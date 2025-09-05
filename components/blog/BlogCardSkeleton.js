export default function BlogCardSkeleton() {
  return (
    <div className="card-elevated animate-pulse">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-t-2xl" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1">
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="mt-2 h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  )
}
