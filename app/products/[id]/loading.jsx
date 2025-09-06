export default function Loading() {
  // Route-level skeleton to avoid flicker during reloads and navigations
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <div className="w-full aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          <div className="h-5 w-1/3 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />

          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          </div>

          {/* Options skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <div className="h-11 w-36 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            <div className="h-11 w-11 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          </div>

          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
