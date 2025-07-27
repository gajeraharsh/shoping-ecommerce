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
  const colors = ['Black', 'White', 'Blue', 'Red', 'Pink', 'Green', 'Grey', 'Navy'];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-medium mb-3">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
              className={`px-3 py-1 text-sm border rounded transition-colors ${
                filters.size === size
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="font-medium mb-3">Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                filters.color === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:scale-105'
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
        className="w-full text-center text-primary hover:underline text-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
}