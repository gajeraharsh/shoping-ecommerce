'use client';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { 
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Grid3X3,
  List,
  Star,
  Trash2,
  Eye,
  Share2,
  SortAsc,
  ChevronDown
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock extended wishlist data
  const extendedWishlistItems = [
    {
      id: 1,
      name: 'Floral Summer Dress',
      price: 1899,
      originalPrice: 2299,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'dresses',
      brand: 'FashionCo',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      addedDate: '2024-01-10',
      discount: 17
    },
    {
      id: 2,
      name: 'Designer Kurta Set',
      price: 2499,
      originalPrice: 2999,
      image: 'https://images.pexels.com/photos/8674628/pexels-photo-8674628.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'ethnic',
      brand: 'EthnicWear',
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
      addedDate: '2024-01-08',
      discount: 17
    },
    {
      id: 3,
      name: 'Casual Cotton Shirt',
      price: 799,
      originalPrice: 999,
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'shirts',
      brand: 'CasualWear',
      rating: 4.2,
      reviewCount: 56,
      inStock: false,
      addedDate: '2024-01-05',
      discount: 20
    },
    {
      id: 4,
      name: 'Premium Silk Saree',
      price: 4999,
      originalPrice: 5999,
      image: 'https://images.pexels.com/photos/9558618/pexels-photo-9558618.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'sarees',
      brand: 'SilkCraft',
      rating: 4.9,
      reviewCount: 203,
      inStock: true,
      addedDate: '2024-01-03',
      discount: 17
    },
    {
      id: 5,
      name: 'Denim Jacket',
      price: 1599,
      originalPrice: 1999,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'jackets',
      brand: 'DenimCo',
      rating: 4.3,
      reviewCount: 74,
      inStock: true,
      addedDate: '2024-01-01',
      discount: 20
    },
    {
      id: 6,
      name: 'Party Wear Gown',
      price: 3499,
      originalPrice: 4299,
      image: 'https://images.pexels.com/photos/8939970/pexels-photo-8939970.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'dresses',
      brand: 'PartyWear',
      rating: 4.6,
      reviewCount: 145,
      inStock: true,
      addedDate: '2023-12-28',
      discount: 19
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items', count: extendedWishlistItems.length },
    { id: 'dresses', label: 'Dresses', count: extendedWishlistItems.filter(item => item.category === 'dresses').length },
    { id: 'ethnic', label: 'Ethnic Wear', count: extendedWishlistItems.filter(item => item.category === 'ethnic').length },
    { id: 'shirts', label: 'Shirts', count: extendedWishlistItems.filter(item => item.category === 'shirts').length },
    { id: 'sarees', label: 'Sarees', count: extendedWishlistItems.filter(item => item.category === 'sarees').length },
    { id: 'jackets', label: 'Jackets', count: extendedWishlistItems.filter(item => item.category === 'jackets').length }
  ];

  const filteredItems = extendedWishlistItems.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.addedDate) - new Date(a.addedDate);
      case 'oldest': return new Date(a.addedDate) - new Date(b.addedDate);
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'discount': return b.discount - a.discount;
      default: return 0;
    }
  });

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === sortedItems.length 
        ? [] 
        : sortedItems.map(item => item.id)
    );
  };

  const handleBulkRemove = () => {
    selectedItems.forEach(itemId => removeFromWishlist(itemId));
    setSelectedItems([]);
  };

  const handleAddToCart = (item) => {
    addToCart({
      ...item,
      size: 'M', // Default size
      color: 'Default',
      quantity: 1
    });
  };

  if (extendedWishlistItems.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist and never lose track of them again.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Heart className="h-4 w-4" />
            Start Wishlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              My Wishlist ({sortedItems.length})
            </h1>
            <p className="text-gray-600">Your saved fashion favorites</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remove Selected ({selectedItems.length})
              </button>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Share2 className="h-4 w-4" />
              Share List
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Best Discount</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === category.id
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterCategory === category.id ? 'bg-pink-200' : 'bg-gray-200'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {sortedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.length === sortedItems.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                Select All
              </button>
              {selectedItems.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Display */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'space-y-6'
        }>
          {sortedItems.map(item => (
            <div key={item.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group ${
              viewMode === 'list' ? 'flex gap-6 p-6' : 'p-5'
            }`}>
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="rounded"
                />
              </div>

              {/* Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'aspect-[3/4] mb-5'}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white font-medium text-sm">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {item.discount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{item.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 pr-2">{item.name}</h3>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    >
                      <Heart className="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-500 mb-3 font-medium">{item.brand}</div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700 ml-1">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({item.reviewCount} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-base text-gray-500 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-4' : ''}`}>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <Link
                    href={`/products/${item.id}`}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
