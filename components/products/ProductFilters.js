"use client";

import { useState, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';

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

  // Collapsible sections
  const [open, setOpen] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
  });

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearOne = (key) => onFilterChange({ [key]: '' });

  const appliedChips = useMemo(() => {
    const chips = [];
    if (filters.category) {
      const label = categories.find(c => c.value === filters.category)?.label || filters.category;
      chips.push({ key: 'category', label });
    }
    if (filters.priceRange) {
      const label = priceRanges.find(p => p.value === filters.priceRange)?.label || filters.priceRange;
      chips.push({ key: 'priceRange', label });
    }
    if (filters.size) chips.push({ key: 'size', label: `Size: ${filters.size}` });
    if (filters.color) {
      const cname = colors.find(c => c.value === filters.color)?.name || filters.color;
      chips.push({ key: 'color', label: `Color: ${cname}` });
    }
    return chips;
  }, [filters, categories, priceRanges, colors]);

  return (
    <div className="space-y-6">
      <h3 className="heading-sm text-gray-900 dark:text-white lg:block hidden">Filters</h3>

      {/* Applied Filters Chips */}
      {appliedChips.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Filters</p>
            <button
              onClick={() => onFilterChange({ category: '', priceRange: '', size: '', color: '' })}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {appliedChips.map(chip => (
              <span key={chip.key} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {chip.label}
                <button
                  onClick={() => clearOne(chip.key)}
                  className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label={`Remove ${chip.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => ({ ...o, category: !o.category }))}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
            Category
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open.category ? '' : '-rotate-90'}`} />
        </button>
        {open.category && (
          <div className="space-y-3 mt-4">
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
        )}
      </div>

      {/* Price Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => ({ ...o, price: !o.price }))}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
            Price Range
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open.price ? '' : '-rotate-90'}`} />
        </button>
        {open.price && (
          <div className="space-y-3 mt-4">
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
        )}
      </div>

      {/* Size Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => ({ ...o, size: !o.size }))}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
            Size
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open.size ? '' : '-rotate-90'}`} />
        </button>
        {open.size && (
          <div className="grid grid-cols-3 gap-3 mt-4">
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
        )}
      </div>

      {/* Color Filter */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => ({ ...o, color: !o.color }))}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
            Color
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open.color ? '' : '-rotate-90'}`} />
        </button>
        {open.color && (
          <div className="grid grid-cols-4 gap-4 mt-4">
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
        )}
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
