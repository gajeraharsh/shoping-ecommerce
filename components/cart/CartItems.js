'use client';

import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';

export default function CartItems() {
  const { items, cart, updateQuantity, removeItem } = useCart();

  const formatCurrency = (amount, currency) => {
    if (typeof amount !== 'number') return '0';
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: (currency || 'USD').toUpperCase(),
      }).format(amount);
    } catch (_) {
      // Fallback to plain number if currency code invalid
      return amount.toLocaleString();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-full overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Cart Items ({items.length})</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map(item => (
          <div key={item.id} className="p-4 sm:p-6">
            {/* Mobile Layout */}
            <div className="flex gap-3 sm:hidden">
              <Link href="#" className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <SmartImage src={item.thumbnail} alt={item.title} className="object-cover" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href="#">
                  <h3 className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <div className="mt-1 text-xs text-gray-500">
                  {item?.variant?.title || item?.description || 'Variant'}
                </div>
                <div className="mt-1 text-base font-semibold">{formatCurrency(item.unit_price, cart?.currency_code)}</div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity({ line_id: item.id, quantity: item.quantity - 1 })}
                      className="w-9 h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity({ line_id: item.id, quantity: item.quantity + 1 })}
                      className="w-9 h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem({ line_id: item.id })}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex gap-4">
              <Link href="#" className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <SmartImage src={item.thumbnail} alt={item.title} className="object-cover" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href="#">
                  <h3 className="font-medium text-gray-900 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="mt-1 text-sm text-gray-500">
                  {item?.variant?.title || item?.description || 'Variant'}
                </div>
                <div className="mt-2 text-lg font-semibold">{formatCurrency(item.unit_price, cart?.currency_code)}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity({ line_id: item.id, quantity: item.quantity - 1 })}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity({ line_id: item.id, quantity: item.quantity + 1 })}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem({ line_id: item.id })}
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
