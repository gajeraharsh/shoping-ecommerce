import { User, Phone, Check } from 'lucide-react';

export default function InlineAddressForm({
  formData,
  inlineErrors,
  onChange,
  onSave,
  saving,
  addressTypes,
  onSelectType,
}) {
  return (
    <div className="space-y-6">
      {/* Address Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Address Type</label>
        <div className="grid grid-cols-3 gap-3">
          {addressTypes.map((type) => {
            const Icon = type.icon;
            const selected = formData.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onSelectType?.(type.value)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  selected
                    ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${selected ? 'text-black dark:text-white' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${selected ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                inlineErrors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {inlineErrors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                inlineErrors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="+91 98765 43210"
            />
          </div>
          {inlineErrors.phone && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address *</label>
        <textarea
          name="street"
          value={formData.street}
          onChange={onChange}
          rows={3}
          className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors ${
            inlineErrors.street ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="House/Flat no., Building name, Street name..."
        />
        {inlineErrors.street && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.street}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Landmark (Optional)</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={onChange}
          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          placeholder="Near famous location, building, etc."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              inlineErrors.city ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Mumbai"
          />
          {inlineErrors.city && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onChange}
            className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              inlineErrors.state ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Maharashtra"
          />
          {inlineErrors.state && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">PIN Code *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={onChange}
            className={`w-full px-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              inlineErrors.pincode ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="400001"
            maxLength="6"
          />
          {inlineErrors.pincode && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inlineErrors.pincode}</p>
          )}
        </div>
      </div>

      {/* Default Address Checkbox */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={!!formData.isDefault}
          onChange={onChange}
          className="w-5 h-5 text-black focus:ring-black border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          Make this my default address
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 px-5 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Address
            </>
          )}
        </button>
      </div>
    </div>
  );
}
