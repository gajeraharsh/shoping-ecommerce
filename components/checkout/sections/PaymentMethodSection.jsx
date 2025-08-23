import { CreditCard } from 'lucide-react';

export default function PaymentMethodSection({
  paymentProviders,
  selectedProviderId,
  onSelect,
  paymentError,
}) {
  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
        <h3 className="text-base sm:text-lg font-semibold">Payment Method</h3>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {paymentProviders.length > 0 ? (
          paymentProviders.map((p) => {
            const id = p.id;
            const label = id === 'cod'
              ? 'Cash on Delivery'
              : id?.replace(/^pp_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div className="flex items-center" key={id}>
                <input
                  type="radio"
                  id={`pm_${id}`}
                  name="paymentMethod"
                  value={id}
                  checked={selectedProviderId === id}
                  onChange={() => onSelect(id)}
                  className="accent-black"
                />
                <label htmlFor={`pm_${id}`} className="ml-2 text-sm">{label}</label>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-600">No payment methods available for this region.</div>
        )}
        {paymentError ? <div className="text-sm text-red-600">{paymentError}</div> : null}
      </div>
    </div>
  );
}
