export default function ProductFilters({ filters, onFilterChange }) {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'kurtis', label: 'Kurtis' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'ethnic', label: 'Ethnic Wear' },
    { value: 'tops', label: 'Tops' },
    { value: 'jackets', label: 'Jackets' }
  ];

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-999', label: 'Under ₹999' },
    { value: '1000-1999', label: '₹1000 - ₹1999' },
    { value: '2000-2999', label: '₹2000 - ₹2999' },
    { value: '3000-4999', label: '₹3000 - ₹4999' },
    { value: '5000-10000', label: 'Above ₹5000' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Grey', value: 'grey', hex: '#6B7280' },
    { name: 'Navy', value: 'navy', hex: '#1E3A8A' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="heading-sm text-gray-900 dark:text-white lg:block hidden">Filters</h3>
      
      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
          <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
          Category
        </h4>
        <div className="space-y-3">
          {categories.map(category => (
            <label key={category.value} className="flex items-center cursor-pointer touch-manipulation p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group min-h-[52px]">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-4 h-5 w-5 text-black dark:text-white focus:ring-black dark:focus:ring-white focus:ring-2 border-2 border-gray-300 dark:border-gray-600 transition-colors"
              />
              <span className="text-base text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
          <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
          Price Range
        </h4>
        <div className="space-y-3">
          {priceRanges.map(range => (
            <label key={range.value} className="flex items-center cursor-pointer touch-manipulation p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group min-h-[52px]">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="mr-4 h-5 w-5 text-black dark:text-white focus:ring-black dark:focus:ring-white focus:ring-2 border-2 border-gray-300 dark:border-gray-600 transition-colors"
              />
              <span className="text-base text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
          <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
          Size
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
              className={`py-4 text-base border-2 rounded-xl transition-all duration-200 font-semibold touch-manipulation min-h-[56px] flex items-center justify-center transform hover:scale-105 active:scale-95 ${
                filters.size === size
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
          <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
          Color
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {colors.map(color => (
            <div key={color.value} className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleFilterChange('color', filters.color === color.value ? '' : color.value)}
                className={`w-14 h-14 rounded-full border-3 transition-all duration-200 touch-manipulation flex items-center justify-center relative transform hover:scale-110 active:scale-95 ${
                  filters.color === color.value
                    ? 'border-gray-900 dark:border-white scale-110 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md'
                } ${color.value === 'white' ? 'border-gray-400' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {filters.color === color.value && (
                  <div className="w-3 h-3 bg-white dark:bg-black rounded-full shadow-sm"></div>
                )}
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({
          category: '',
          priceRange: '',
          size: '',
          color: ''
        })}
        className="w-full text-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-base py-5 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold touch-manipulation min-h-[60px] flex items-center justify-center transform hover:scale-102 active:scale-98 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md"
      >
        Clear All Filters
      </button>
    </div>
  );
}
