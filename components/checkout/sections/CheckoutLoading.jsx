export default function CheckoutLoading({ isSubmitting, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8 min-h-[80vh] relative">
      <div className="space-y-6 animate-pulse">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-12 w-full bg-gray-200 rounded" />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm min-h-[240px]">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm min-h-[200px]">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-12 bg-gray-200 rounded mb-3" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm min-h-[200px]">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-12 bg-gray-200 rounded mb-3" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
        <div className="w-full bg-gray-200 rounded-xl h-14" />
      </div>
      {isSubmitting ? (
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px]" aria-hidden />
      ) : null}
    </form>
  );
}
