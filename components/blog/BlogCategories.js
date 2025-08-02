export default function BlogCategories({ categories }) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              category.active
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
            <span className="ml-2 text-sm opacity-75">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
