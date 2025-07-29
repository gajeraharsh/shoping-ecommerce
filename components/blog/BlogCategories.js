export default function BlogCategories({ categories }) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
              category.active
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-600 hover:text-pink-600 dark:hover:text-pink-400'
            }`}
          >
            {category.name}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              category.active
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
