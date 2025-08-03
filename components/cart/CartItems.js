'use client';

import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartItems() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-full overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Cart Items ({cartItems.length})</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {cartItems.map(item => (
          <div key={item.cartId} className="p-4 sm:p-6">
            {/* Mobile Layout */}
            <div className="flex gap-3 sm:hidden">
              <Link href={`/products/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <div className="mt-1 text-xs text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </div>
                <div className="mt-1 text-base font-semibold">₹{item.price}</div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="w-9 h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="w-9 h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex gap-4">
              <Link href={`/products/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="mt-1 text-sm text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </div>
                <div className="mt-2 text-lg font-semibold">₹{item.price}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.cartId)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
