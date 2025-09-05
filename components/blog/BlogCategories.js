export default function BlogCategories({ categories = [], selectedId = null, onSelect, disabled = false }) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
        {categories.map((category) => {
          const isActive = category.active || (selectedId != null && category.id === selectedId)
          return (
            <button
              key={category.id ?? category.name}
              type="button"
              disabled={disabled}
              onClick={() => onSelect && onSelect(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {category.name}
              {typeof category.count === 'number' && (
                <span className="ml-2 text-sm opacity-75">
                  {category.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  );
}
