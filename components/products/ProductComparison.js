'use client';

import { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Plus, Minus, Star, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

export default function ProductComparison({ isOpen, onClose, compareProducts, onRemoveProduct }) {
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize default selections
    const sizes = {};
    const colors = {};
    compareProducts.forEach(product => {
      sizes[product.id] = product.sizes?.[0] || '';
      colors[product.id] = product.colors?.[0] || '';
    });
    setSelectedSizes(sizes);
    setSelectedColors(colors);
  }, [compareProducts]);

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id];
    const color = selectedColors[product.id];
    
    if (!size) {
      showToast('Please select a size', 'error');
      return;
    }
    if (!color) {
      showToast('Please select a color', 'error');
      return;
    }
    
    addToCart(product, size, color, 1);
    showToast('Added to cart successfully!', 'success');
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      showToast('Product is already in wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  const comparisonFeatures = [
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'rating' },
    { key: 'reviews', label: 'Reviews', type: 'number' },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'care', label: 'Care Instructions', type: 'text' },
    { key: 'sizes', label: 'Available Sizes', type: 'array' },
    { key: 'colors', label: 'Available Colors', type: 'array' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'sustainable', label: 'Eco-Friendly', type: 'boolean' },
    { key: 'stock', label: 'Stock Status', type: 'stock' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full p-4 flex items-start justify-center pt-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compare Products ({compareProducts.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {compareProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products to compare
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add products to comparison from the product listing page
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <table className="w-full">
                  {/* Product Images and Basic Info */}
                  <thead>
                    <tr>
                      <td className="p-6 w-48 border-r border-gray-200 dark:border-gray-700">
                        <div className="font-semibold text-gray-900 dark:text-white">Products</div>
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-6 border-r border-gray-200 dark:border-gray-700 min-w-72">
                          <div className="text-center">
                            <div className="relative mb-4">
                              <button
                                onClick={() => onRemoveProduct(product.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <Link href={`/products/${product.id}`}>
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform"
                                />
                              </Link>
                            </div>
                            <Link 
                              href={`/products/${product.id}`}
                              className="font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors line-clamp-2"
                            >
                              {product.name}
                            </Link>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Comparison Features */}
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature.key} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {feature.label}
                          </div>
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="p-4 border-r border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                              {feature.type === 'price' && (
                                <div>
                                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₹{product.price?.toLocaleString()}
                                  </div>
                                  {product.originalPrice && (
                                    <div className="text-sm text-gray-500 line-through">
                                      ₹{product.originalPrice?.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              )}
                              {feature.type === 'rating' && (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-gray-900 dark:text-white">
                                    {product.rating || 'N/A'}
                                  </span>
                                </div>
                              )}
                              {feature.type === 'number' && (
                                <span className="text-gray-900 dark:text-white">
                                  {product[feature.key] || 'N/A'}
                                </span>
                              )}
                              {feature.type === 'text' && (
                                <span className="text-gray-900 dark:text-white text-sm">
                                  {product[feature.key] || 'N/A'}
                                </span>
                              )}
                              {feature.type === 'array' && (
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {product[feature.key]?.join(', ') || 'N/A'}
                                </div>
                              )}
                              {feature.type === 'boolean' && (
                                <div className="flex justify-center">
                                  {product[feature.key] ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                              )}
                              {feature.type === 'stock' && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  product.stock > 0
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                                }`}>
                                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Size Selection */}
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-gray-900 dark:text-white">Select Size</div>
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4 border-r border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {product.sizes?.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSizes({...selectedSizes, [product.id]: size})}
                                className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                                  selectedSizes[product.id] === size
                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Color Selection */}
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-gray-900 dark:text-white">Select Color</div>
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4 border-r border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {product.colors?.map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColors({...selectedColors, [product.id]: color})}
                                className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                                  selectedColors[product.id] === color
                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Action Buttons */}
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-gray-900 dark:text-white">Actions</div>
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4 border-r border-gray-200 dark:border-gray-700">
                          <div className="space-y-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="h-4 w-4" />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleWishlistToggle(product)}
                              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
