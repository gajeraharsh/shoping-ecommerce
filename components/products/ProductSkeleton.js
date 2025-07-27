export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="aspect-[3/4] animate-shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="animate-shimmer h-4 rounded"></div>
        <div className="animate-shimmer h-3 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="animate-shimmer h-5 rounded w-1/3"></div>
          <div className="flex gap-1">
            <div className="animate-shimmer w-4 h-4 rounded-full"></div>
            <div className="animate-shimmer w-4 h-4 rounded-full"></div>
            <div className="animate-shimmer w-4 h-4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}