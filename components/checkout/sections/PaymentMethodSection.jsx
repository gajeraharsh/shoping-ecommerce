import { CreditCard } from 'lucide-react';

export default function PaymentMethodSection({
  paymentProviders,
  selectedProviderId,
  onSelect,
  paymentError,
  loading = false,
}) {
  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
        <h3 id="payment-method-title" className="text-base sm:text-lg font-semibold">Payment Method</h3>
      </div>
      <div role="radiogroup" aria-labelledby="payment-method-title" className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-6 w-56 bg-gray-200 rounded" />
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
          </div>
        ) : paymentProviders.length > 0 ? (
          paymentProviders.map((p) => {
            const id = p.id;
            const label = id === 'cod'
              ? 'Cash on Delivery'
              : id?.replace(/^pp_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            const checked = selectedProviderId === id;
            return (
              <label
                key={id}
                htmlFor={`pm_${id}`}
                className={[
                  'flex items-center justify-between gap-3 rounded-lg border px-3 py-3 sm:px-4 sm:py-3 cursor-pointer transition-colors',
                  checked ? 'border-black' : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="radio"
                    id={`pm_${id}`}
                    name="paymentMethod"
                    value={id}
                    checked={checked}
                    onChange={() => onSelect(id)}
                    className="accent-black h-4 w-4"
                    aria-describedby={`pm_label_${id}`}
                  />
                  <div id={`pm_label_${id}`} className="text-sm font-medium text-gray-900">{label}</div>
                </div>
              </label>
            );
          })
        ) : (
          <div className="text-sm text-gray-600">No payment methods available for this region.</div>
        )}
        {paymentError ? <div role="alert" className="text-sm text-red-600">{paymentError}</div> : null}
      </div>
    </div>
  );
}
