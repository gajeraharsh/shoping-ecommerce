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
        <h3 id="shipping-method-title" className="text-base sm:text-lg font-semibold">Shipping Method</h3>
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
        <div role="radiogroup" aria-labelledby="shipping-method-title" className="space-y-3 sm:space-y-4">
          {shippingOptions.map((opt) => {
            const id = opt.id;
            const label = opt.name || opt.type?.label || 'Shipping Option';
            const price = opt.calculated_price?.calculated_amount ?? opt.amount ?? 0;
            const currency = (process.env.NEXT_PUBLIC_CURRENCY || '').toLowerCase() || opt.calculated_price?.currency_code || cart?.currency_code || cart?.region?.currency_code || 'inr';
            const priceFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: String(currency).toUpperCase() }).format(price || 0);
            const checked = selectedShippingOptionId === id;
            return (
              <label
                key={id}
                htmlFor={`ship_${id}`}
                className={[
                  'flex items-center justify-between gap-3 rounded-lg border px-3 py-3 sm:px-4 sm:py-3 cursor-pointer transition-colors',
                  checked ? 'border-black' : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="radio"
                    id={`ship_${id}`}
                    name="shippingMethod"
                    value={id}
                    checked={checked}
                    onChange={() => onSelectOption(id)}
                    className="accent-black h-4 w-4"
                    aria-describedby={`ship_label_${id}`}
                  />
                  <div id={`ship_label_${id}`} className="text-sm">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {label}
                      {opt.insufficient_inventory ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">Limited</span>
                      ) : null}
                    </div>
                    {opt?.delivery_time || opt?.estimated_days ? (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {opt.delivery_time || `Est. ${opt.estimated_days} days`}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="text-sm font-medium tabular-nums text-gray-900">{priceFmt}</div>
              </label>
            );
          })}
          {shippingError ? <div role="alert" className="text-sm text-red-600">{shippingError}</div> : null}
        </div>
      )}
    </div>
  );
}
