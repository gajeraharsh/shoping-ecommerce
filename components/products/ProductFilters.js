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
    <div className="card-minimal p-6 space-y-6">
      <h3 className="heading-sm text-gray-900 dark:text-white lg:block hidden">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Category</h4>
        <div className="space-y-3">
          {categories.map(category => (
            <label key={category.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-3 h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Price Range</h4>
        <div className="space-y-3">
          {priceRanges.map(range => (
            <label key={range.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="mr-3 h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Size</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
              className={`px-3 py-2 text-sm border rounded-lg transition-all font-medium ${
                filters.size === size
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Color</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                filters.color === color
                  ? 'border-gray-900 dark:border-white scale-110 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:scale-105 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
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
        className="w-full text-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
}
