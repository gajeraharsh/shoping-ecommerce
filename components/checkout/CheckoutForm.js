'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { CreditCard, Truck, MapPin, Home, Building2, Plus } from 'lucide-react';
import SimpleTrustBadges, { SimplePaymentBadges } from '@/components/ui/SimpleTrustBadges';
import AddAddressModal from '@/components/modals/AddAddressModal';
import { listAddresses, createAddress, updateAddress } from '@/services/customer/addressService';
import { paymentService } from '@/services/modules/payment/paymentService';

export default function CheckoutForm({ onSubmit, loading }) {
  const router = useRouter();
  const { cart, setEmail, setShippingAddress, setBillingAddress, completeCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod'
  });

  // Saved addresses from backend
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressError, setAddressError] = useState('');
  const shippingSectionRef = useRef(null);
  const paymentSectionRef = useRef(null);
  // Payment providers
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('cod');
  const [paymentError, setPaymentError] = useState('');

  // Load addresses from backend
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Load payment providers for the region
  useEffect(() => {
    (async () => {
      try {
        const { payment_providers = [] } = await paymentService.listProviders({ region_id: cart?.region?.id });
        setPaymentProviders(payment_providers);
        // Prefer COD if available, otherwise first provider
        const cod = payment_providers.find((p) => p.id === 'cod');
        const def = cod?.id || payment_providers[0]?.id;
        if (def) {
          setSelectedProviderId(def);
          setFormData((prev) => ({ ...prev, paymentMethod: def }));
        }
      } catch (e) {
        // global toast via interceptor
      }
    })();
  }, [cart?.region?.id]);

  const fetchAddresses = async () => {
    try {
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      // Do not auto-select or set on cart. User must select explicitly.
      setSelectedAddressId(null);
      setAddressError('');
    } catch (e) {
      // global toasts handled by api client
    }
  };

  // Prefill email from cart when available
  useEffect(() => {
    if (cart?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: cart.email }));
    }
  }, [cart?.email]);

  // Debounced update to cart email when user types a valid email
  useEffect(() => {
    if (!formData.email) return;
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(formData.email);
    if (!isValid) return;
    const same = cart?.email === formData.email;
    const t = setTimeout(() => {
      if (!same) setEmail(formData.email);
    }, 400);
    return () => clearTimeout(t);
  }, [formData.email, cart?.email, setEmail]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Coupon UI removed; managed within Order Summary

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Always use the current default address when placing order
    const defaultAddress = addresses.find(a => a.isDefault) || null;
    if (!defaultAddress) {
      setAddressError('Please select or set a default shipping address to continue.');
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    try {
      await setShippingAddress(defaultAddress);
      await setBillingAddress(defaultAddress);
      setAddressError('');
    } catch (err) {
      setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to set address on cart');
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    // Payment v2: Create payment collection then init session for selected provider
    if (!cart?.id) {
      setPaymentError('Cart not ready');
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const provider_id = selectedProviderId || formData.paymentMethod || 'cod';
    setPaymentError('');
    let paymentCollection = cart?.payment_collection || null;
    if (!paymentCollection?.id) {
      try {
        paymentCollection = await paymentService.createPaymentCollection({ cartId: cart.id });
      } catch (err) {
        const msg = err?.message || 'Failed to create payment collection';
        setPaymentError(msg);
        if (paymentSectionRef.current) {
          paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
    }
    try {
      await paymentService.initPaymentSession({ payment_collection_id: paymentCollection?.id, provider_id });
    } catch (err) {
      const msg = err?.message || 'Failed to initialize payment session';
      setPaymentError(msg);
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    // Trigger cart completion
    try {
      const result = await completeCart();
      if (result?.type === 'order' && result?.order?.id) {
        // Navigate to thank-you page
        router.push(`/thank-you?order_id=${encodeURIComponent(result.order.id)}`);
        return;
      }
      // If completion returned a cart, show error message
      const errMsg = result?.error || 'Unable to complete order. Please review your details and try again.';
      setAddressError(errMsg);
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      const msg = err?.message || 'Failed to complete order';
      setAddressError(msg);
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // Also pass form data upward if a parent wants to track it
    onSubmit?.({ ...formData, selectedAddress: defaultAddress });
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
      // Refresh list without auto-setting cart or auto-selecting.
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      setSelectedAddressId(null);
      setAddressError('');
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
      <div ref={shippingSectionRef} className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
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
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-[48px]"
            required
          />
          <p className="mt-1 text-xs text-gray-500">We’ll send order updates to this email.</p>
        </div>
      </div>

      {/* Coupon UI managed in Order Summary component */}

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
            {addressError && (
              <p className="text-xs text-red-600">{addressError}</p>
            )}

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
                        onChange={async () => {
                          const id = address?.id
                          setSelectedAddressId(id || null)
                          if (!id) {
                            setAddressError('No address id found for this selection. Please choose another or add a new address.')
                            return
                          }
                          try {
                            // Only change customer's default address; do not hit cart here
                            await updateAddress(id, { isDefault: true }, { successMessage: 'Default address updated' })
                            // Refresh list to reflect new default state
                            const { addresses: list } = await listAddresses()
                            setAddresses(list)
                            setSelectedAddressId(id)
                            setAddressError('')
                          } catch (e) {
                            setAddressError(typeof e === 'string' ? e : e?.message || 'Failed to set default address')
                          }
                        }}
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
      <div ref={paymentSectionRef} className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Payment Method</h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {paymentProviders.length > 0 ? (
            paymentProviders.map((p) => {
              const id = p.id
              const label = id === 'cod' ? 'Cash on Delivery' : id?.replace(/^pp_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              return (
                <div className="flex items-center" key={id}>
                  <input
                    type="radio"
                    id={`pm_${id}`}
                    name="paymentMethod"
                    value={id}
                    checked={selectedProviderId === id}
                    onChange={() => {
                      setSelectedProviderId(id)
                      setFormData((prev) => ({ ...prev, paymentMethod: id }))
                    }}
                    className="accent-black"
                  />
                  <label htmlFor={`pm_${id}`} className="ml-2 text-sm">{label}</label>
                </div>
              )
            })
          ) : (
            <div className="text-sm text-gray-600">No payment methods available for this region.</div>
          )}
          {paymentError ? (
            <div className="text-sm text-red-600">{paymentError}</div>
          ) : null}
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
