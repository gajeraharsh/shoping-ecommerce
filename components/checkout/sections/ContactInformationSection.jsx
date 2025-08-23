import { MapPin } from 'lucide-react';

export default function ContactInformationSection({ formData, onChange }) {
  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
        <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px]"
          required
        />
        <p className="mt-1 text-xs text-gray-500">We’ll send order updates to this email.</p>
      </div>
    </div>
  );
}
