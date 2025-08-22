'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Truck, MapPin, Home, Building2, Plus } from 'lucide-react';
import SimpleTrustBadges, { SimplePaymentBadges } from '@/components/ui/SimpleTrustBadges';
import AddAddressModal from '@/components/modals/AddAddressModal';
import { listAddresses, createAddress, updateAddress } from '@/services/customer/addressService';

export default function CheckoutForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card'
  });

  // Saved addresses from backend
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load addresses from backend
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      const def = list.find((a) => a.isDefault);
      setSelectedAddressId(def?.id ?? (list[0]?.id || null));
    } catch (e) {
      // global toasts handled by api client
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedAddress = addresses.find(a => a.id === selectedAddressId) || null;
    onSubmit({ ...formData, selectedAddress });
  };

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'office', label: 'Office', icon: Building2 },
    { value: 'other', label: 'Other', icon: MapPin }
  ];

  const getTypeIcon = (type) => {
    const typeConfig = addressTypes.find(t => t.value === type);
    return typeConfig?.icon || MapPin;
  };

  const handleAddAddress = async (data) => {
    try {
      const prevIds = new Set(addresses.map(a => a.id));
      await createAddress(data, { successMessage: 'Address added' });
      // Refresh and auto-select the newly added address
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      const newlyAdded = list.find(a => !prevIds.has(a.id));
      if (newlyAdded) {
        setSelectedAddressId(newlyAdded.id);
      } else {
        const def = list.find((a) => a.isDefault);
        setSelectedAddressId(def?.id ?? (list[0]?.id || null));
      }
    } catch (e) {
      // error toast handled globally
    }
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data, { successMessage: 'Address updated' });
        setEditingAddress(null);
        await fetchAddresses();
      } else {
        await handleAddAddress(data);
      }
    } catch (e) {
      // handled by global toasts
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Contact Information */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editingAddress={editingAddress}
      />

      {/* Shipping Address */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Shipping Address</h3>
        </div>
        
        {/* If saved addresses exist: show selection UI */}
        {addresses.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Select a saved address</p>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAddModal(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); } }}
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => {
                const Icon = getTypeIcon(address.type);
                const selected = selectedAddressId === address.id || (!selectedAddressId && address.isDefault);
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
                        onChange={() => setSelectedAddressId(address.id)}
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
        ) : (
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px] touch-manipulation"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px] touch-manipulation"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, apartment, suite, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px] touch-manipulation"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px] touch-manipulation"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px] touch-manipulation"
                required
              />
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Payment Method</h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="card" className="text-sm sm:text-base font-medium">Credit/Debit Card</label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="cod" className="text-sm sm:text-base font-medium">Cash on Delivery</label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="upi"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === 'upi'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="upi" className="text-sm sm:text-base font-medium">UPI Payment</label>
          </div>
        </div>
      </div>

      {/* Security Assurance */}
      <SimpleTrustBadges className="mb-6" />

      {/* Payment Security */}
      <SimplePaymentBadges className="mb-6" />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-4 px-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
