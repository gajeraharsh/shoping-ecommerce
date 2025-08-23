'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { CreditCard, Truck, MapPin, Home, Building2, Plus, User, Phone, Check } from 'lucide-react';
import SimpleTrustBadges, { SimplePaymentBadges } from '@/components/ui/SimpleTrustBadges';
import AddAddressModal from '@/components/modals/AddAddressModal';
import { listAddresses, createAddress, updateAddress } from '@/services/customer/addressService';
import { paymentService } from '@/services/modules/payment/paymentService';
import { shippingService } from '@/services/modules/shipping/shippingService';

export default function CheckoutForm({ onSubmit, loading }) {
  const router = useRouter();
  const { cart, setEmail, setShippingAddress, setBillingAddress, completeCart, refresh, createCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    // Inline address form (mirrors AddAddressModal)
    type: 'home',
    name: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
    // Legacy keys retained for compatibility in other parts if referenced
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
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
  // In "no saved address" scenario, persist a temporary address in account and cart as the user fills the form
  const [tempAddressId, setTempAddressId] = useState(null);
  const autoSaveTimerRef = useRef(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [inlineErrors, setInlineErrors] = useState({});
  const [savingAddress, setSavingAddress] = useState(false);
  // Payment providers
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  // Shipping methods
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState(null);
  const [shippingError, setShippingError] = useState('');

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
        // Do not auto-select any payment method; require explicit user choice
        setSelectedProviderId((prev) => prev && payment_providers.some(p => p.id === prev) ? prev : null);
      } catch (e) {
        // global toast via interceptor
      }
    })();
  }, [cart?.region?.id]);

  // Load shipping options for the cart
  useEffect(() => {
    if (!cart?.id) return;
    (async () => {
      try {
        const { shipping_options = [] } = await shippingService.listCartOptions({ cart_id: cart.id });
        setShippingOptions(shipping_options);
        // If cart already has a shipping method, keep it selected; else preselect first option
        const currentId = cart?.shipping_methods?.[0]?.shipping_option_id || null;
        // Do not auto-select first option when none present
        const def = currentId || null;
        setSelectedShippingOptionId(def);
        setShippingError('');
      } catch (e) {
        // Errors are globally handled; keep local message minimal
        setShippingOptions([]);
        setSelectedShippingOptionId(null);
        setShippingError(e?.message || 'Failed to load shipping options');
      }
    })();
  }, [cart?.id, cart?.shipping_address?.country_code]);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateInlineAddress = (data) => {
    const errs = {};
    const name = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();
    const street = (data.street || data.address || '').trim();
    const pincode = (data.pincode || data.zipCode || '').trim();
    if (!name) errs.name = 'Name is required';
    if (!data.phone?.trim()) errs.phone = 'Phone number is required';
    if (!street) errs.street = 'Street address is required';
    if (!data.city?.trim()) errs.city = 'City is required';
    if (!data.state?.trim()) errs.state = 'State is required';
    if (!pincode) errs.pincode = 'PIN code is required';
    if (data.phone && !/^[+]?[\d\s-()]{10,}$/.test(data.phone.replace(/\s/g, ''))) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (pincode && !/^\d{6}$/.test(pincode)) {
      errs.pincode = 'PIN code must be 6 digits';
    }
    return errs;
  };

  const saveInlineAddress = async () => {
    const errs = validateInlineAddress(formData);
    setInlineErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setSavingAddress(true);
      const uiAddr = {
        name: (formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`).trim(),
        type: formData.type || 'home',
        phone: formData.phone || '',
        street: formData.street || formData.address,
        landmark: formData.landmark || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode || formData.zipCode,
        country_code: 'dk',
        isDefault: typeof formData.isDefault === 'boolean' ? formData.isDefault : true,
      };
      if (!tempAddressId) {
        const created = await createAddress(uiAddr, { successMessage: 'Address saved' });
        const newId = created?.address?.id || created?.id;
        if (newId) setTempAddressId(newId);
      } else {
        await updateAddress(tempAddressId, uiAddr, { successMessage: 'Address updated' });
      }
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      const picked = tempAddressId ? (list.find(a => a.id === tempAddressId) || uiAddr) : (list[0] || uiAddr);
      try {
        await setShippingAddress(picked);
        await setBillingAddress(picked);
        await refresh();
      } catch {}
      setAutoSaveEnabled(true); // enable future debounced updates
      setAddressError('');
      return picked;
    } catch (e) {
      setAddressError(typeof e === 'string' ? e : e?.message || 'Failed to save address');
      return null;
    } finally {
      setSavingAddress(false);
    }
  };

  // When there are no saved addresses, auto-create/update an account address from inline form
  useEffect(() => {
    if (addresses.length > 0) return; // only when there are no saved addresses
    if (!autoSaveEnabled) return; // only after user explicitly saved once
    // basic validity check before auto-saving
    const { firstName, lastName, address, city, state, zipCode, phone } = formData;
    const errs = validateInlineAddress(formData);
    const hasMin = Object.keys(errs).length === 0;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!hasMin) return;
      try {
        const uiAddr = {
          name: `${firstName} ${lastName || ''}`.trim(),
          type: 'home',
          phone: phone || '',
          street: address,
          city,
          state,
          pincode: zipCode,
          country_code: 'dk',
          isDefault: true,
        };
        if (!tempAddressId) {
          // Create once, store id
          const created = await createAddress(uiAddr, { successMessage: null });
          const newId = created?.address?.id || created?.id;
          if (newId) setTempAddressId(newId);
          // Refresh list to keep UI in sync
          const { addresses: list } = await listAddresses();
          setAddresses(list);
          // Set on cart to unlock shipping options
          const picked = list.find(a => a.id === newId) || uiAddr;
          try {
            await setShippingAddress(picked);
            await setBillingAddress(picked);
            await refresh();
          } catch (e) {
            // handled globally; keep quiet
          }
        } else {
          // Update existing temp address as user edits
          await updateAddress(tempAddressId, uiAddr, { successMessage: null });
          const { addresses: list } = await listAddresses();
          setAddresses(list);
          const picked = list.find(a => a.id === tempAddressId) || uiAddr;
          try {
            await setShippingAddress(picked);
            await setBillingAddress(picked);
            await refresh();
          } catch (e) {}
        }
        setAddressError('');
      } catch (err) {
        // show minimal inline error
        setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to save address');
      }
    }, 600);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [addresses.length, autoSaveEnabled, formData.firstName, formData.lastName, formData.address, formData.city, formData.state, formData.zipCode, formData.phone, tempAddressId, createAddress, updateAddress, listAddresses, setShippingAddress, setBillingAddress, refresh]);

  // Coupon UI removed; managed within Order Summary

  const handleSubmit = async (e) => {
    e.preventDefault();
    let savedInlineAddr = null;
    // If no saved addresses, validate inline form first
    if (!addresses.length) {
      const errs = validateInlineAddress(formData);
      setInlineErrors(errs);
      if (Object.keys(errs).length) {
        setAddressError('Please fill all required address fields.');
        if (shippingSectionRef.current) {
          shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      // If valid and not yet saved, persist inline address before proceeding (same as Save button)
      try {
        const saved = await saveInlineAddress();
        if (!saved) return; // saving failed or invalid
        savedInlineAddr = saved;
      } catch (_) {}
    }
    // Always use the current default address when placing order
    const defaultAddress = addresses.find(a => a.isDefault) || savedInlineAddr || null;
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
      // Refresh cart so state reflects latest addresses before we validate
      await refresh();
      setAddressError('');
    } catch (err) {
      setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to set address on cart');
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    // Do not re-check cart.shipping_address here; we just set it and the selector may be stale in this tick.
    // Ensure a shipping method is chosen before payment
    if (!selectedShippingOptionId) {
      setShippingError('Please select a shipping method.');
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
    // Ensure a payment method is chosen
    if (!selectedProviderId) {
      setPaymentError('Please select a payment method.');
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const provider_id = selectedProviderId;
    setPaymentError('');
    // Apply the selected shipping method on the server unconditionally for this submit
    try {
      await shippingService.addShippingMethod({ cartId: cart.id, option_id: selectedShippingOptionId });
    } catch (err) {
      setShippingError(err?.message || 'Failed to set shipping method');
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
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
      // If result missing or has error, do NOT redirect
      if (!result || result?.error) {
        const errMsg = result?.error || 'Unable to complete order. Please review your details and try again.';
        setAddressError(errMsg);
        if (shippingSectionRef.current) {
          shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      if (result?.type === 'order' && result?.order?.id) {
        // Force-create a brand new cart after successful order (Medusa v2)
        try { await createCart(); } catch {}
        router.push(`/order-confirmation?order_id=${encodeURIComponent(result.order.id)}`);
        return;
      }
      // Any non-order response is treated as failure; stay on page
      const errMsg = 'Unable to complete order. Please review your details and try again.';
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
                            // 1) Set as customer's default
                            await updateAddress(id, { isDefault: true }, { successMessage: 'Default address updated' })
                            // 2) Refresh saved addresses to reflect new default
                            const { addresses: list } = await listAddresses()
                            setAddresses(list)
                            setSelectedAddressId(id)
                            setAddressError('')
                            // 3) Also set this address on the cart immediately so shipping options resolve
                            const picked = list.find(a => a.id === id) || address
                            try {
                              await setShippingAddress(picked)
                              await refresh()
                            } catch (err) {
                              // cart set failure handled by global toasts; show minimal inline error
                              setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to set address on cart')
                            }
                            // 4) Re-load shipping options now that address is set
                            try {
                              const { shipping_options = [] } = await shippingService.listCartOptions({ cart_id: cart?.id })
                              setShippingOptions(shipping_options)
                              const currentId = cart?.shipping_methods?.[0]?.shipping_option_id || null
                              const def = currentId || shipping_options[0]?.id || null
                              setSelectedShippingOptionId(def)
                              setShippingError('')
                            } catch (err) {
                              setShippingOptions([])
                              setSelectedShippingOptionId(null)
                              setShippingError(err?.message || 'Failed to load shipping options')
                            }
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
          <div className="space-y-6">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Address Type</label>
              <div className="grid grid-cols-3 gap-3">
                {addressTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                        formData.type === type.value
                          ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${
                        formData.type === type.value ? 'text-black dark:text-white' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.type === type.value ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
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
                onClick={saveInlineAddress}
                disabled={savingAddress}
                className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 px-5 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
              >
                {savingAddress ? (
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
        )}
      </div>

      {/* Shipping Method */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Shipping Method</h3>
        </div>

        {shippingOptions.length === 0 ? (
          <div className="text-sm text-gray-600">No shipping methods available for this cart.</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {shippingOptions.map((opt) => {
              const id = opt.id
              const label = opt.name || opt.type?.label || 'Shipping Option'
              const price = opt.calculated_price?.calculated_amount ?? opt.amount ?? 0
              const currency = (process.env.NEXT_PUBLIC_CURRENCY || '').toLowerCase() || opt.calculated_price?.currency_code || cart?.currency_code || cart?.region?.currency_code || 'inr'
              const priceFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: String(currency).toUpperCase() }).format(price || 0)
              return (
                <div className="flex items-center" key={id}>
                  <input
                    type="radio"
                    id={`ship_${id}`}
                    name="shippingMethod"
                    value={id}
                    checked={selectedShippingOptionId === id}
                    onChange={async () => {
                      setSelectedShippingOptionId(id)
                      setShippingError('')
                      try {
                        if (!cart?.id) throw new Error('Cart not ready')
                        await shippingService.addShippingMethod({ cartId: cart.id, option_id: id })
                        await refresh()
                      } catch (e) {
                        setShippingError(e?.message || 'Failed to set shipping method')
                      }
                    }}
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
              )
            })}
            {shippingError ? (
              <div className="text-sm text-red-600">{shippingError}</div>
            ) : null}
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
