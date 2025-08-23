import { Truck } from 'lucide-react';

export default function ShippingMethodSection({
  cart,
  shippingOptions,
  selectedShippingOptionId,
  onSelectOption,
  shippingError,
  loading = false,
}) {
  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
        <h3 className="text-base sm:text-lg font-semibold">Shipping Method</h3>
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-6 w-64 bg-gray-200 rounded" />
          <div className="h-5 w-52 bg-gray-200 rounded" />
          <div className="h-5 w-44 bg-gray-200 rounded" />
        </div>
      ) : shippingOptions.length === 0 ? (
        <div className="text-sm text-gray-600">No shipping methods available for this cart.</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {shippingOptions.map((opt) => {
            const id = opt.id;
            const label = opt.name || opt.type?.label || 'Shipping Option';
            const price = opt.calculated_price?.calculated_amount ?? opt.amount ?? 0;
            const currency = (process.env.NEXT_PUBLIC_CURRENCY || '').toLowerCase() || opt.calculated_price?.currency_code || cart?.currency_code || cart?.region?.currency_code || 'inr';
            const priceFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: String(currency).toUpperCase() }).format(price || 0);
            return (
              <div className="flex items-center" key={id}>
                <input
                  type="radio"
                  id={`ship_${id}`}
                  name="shippingMethod"
                  value={id}
                  checked={selectedShippingOptionId === id}
                  onChange={() => onSelectOption(id)}
                  className="accent-black"
                />
                <label htmlFor={`ship_${id}`} className="ml-2 text-sm flex items-center gap-2">
                  <span>{label}</span>
                  <span className="text-gray-500">• {priceFmt}</span>
                  {opt.insufficient_inventory ? (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">Limited</span>
                  ) : null}
                </label>
              </div>
            );
          })}
          {shippingError ? <div className="text-sm text-red-600">{shippingError}</div> : null}
        </div>
      )}
    </div>
  );
}
