export default function BlogCategoriesSkeleton({ count = 6 }) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-full" />
        ))}
      </div>
    </div>
  )
}
