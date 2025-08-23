import { Plus } from 'lucide-react';

export default function AddressBookSection({
  addresses = [],
  addressError,
  isApplyingAddress,
  onAddAddress,
  onSelect,
  getTypeIcon,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Select a saved address</p>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddAddress?.(); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); } }}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
       >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>
      {addressError ? (
        <p className="text-xs text-red-600">{addressError}</p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => {
          const Icon = getTypeIcon(address.type);
          const selected = !!address.isDefault;
          return (
            <label
              key={address.id}
              className={`relative group cursor-pointer rounded-2xl border p-4 transition-all ${
                selected ? 'border-black shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selected}
                  onChange={() => onSelect?.(address)}
                  className="mt-1 accent-black"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-semibold capitalize">{address.type} Address</span>
                    {address.isDefault && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">Default</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {address.name} • {address.phone}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {address.street}{address.landmark ? `, Near ${address.landmark}` : ''}
                  </div>
                  <div className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
