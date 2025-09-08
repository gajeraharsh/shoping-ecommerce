'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Truck, Plus, User, Phone, Check } from 'lucide-react';
import SimpleTrustBadges, { SimplePaymentBadges } from '@/components/ui/SimpleTrustBadges';
import AddAddressModal from '@/components/modals/AddAddressModal';
import { listAddresses, createAddress, updateAddress } from '@/services/customer/addressService';
import { paymentService } from '@/services/modules/payment/paymentService';
import { shippingService } from '@/services/modules/shipping/shippingService';
import { loadRazorpay } from '@/utils/razorpay';
import ContactInformationSection from '@/components/checkout/sections/ContactInformationSection';
import ShippingMethodSection from '@/components/checkout/sections/ShippingMethodSection';
import PaymentMethodSection from '@/components/checkout/sections/PaymentMethodSection';
import CheckoutLoading from '@/components/checkout/sections/CheckoutLoading';
import { addressTypes, getTypeIcon } from '@/components/checkout/utils/addressTypes';
import AddressBookSection from '@/components/checkout/sections/AddressBookSection';
import InlineAddressForm from '@/components/checkout/sections/InlineAddressForm';
import useSubmittingLock from '@/hooks/checkout/useSubmittingLock';
import useEmailSync from '@/hooks/checkout/useEmailSync';
import useAutoSaveTempAddress from '@/hooks/checkout/useAutoSaveTempAddress';

export default function CheckoutForm({ onSubmit, loading, onSubmittingChange }) {
  // Persisted submit flag to avoid brief re-enables during async cart refreshes
  const SUBMIT_FLAG_KEY = 'checkout_is_submitting';
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
  // UX loading flags to avoid flicker
  const [isApplyingAddress, setIsApplyingAddress] = useState(false);
  const [isLoadingShippingOptions, setIsLoadingShippingOptions] = useState(true);
  const [isChangingShipping, setIsChangingShipping] = useState(false);
  // Unified submit/loading state to avoid flicker (extracted without behavior change)
  const { isSubmitting, isSubmittingRef, lockSubmitting, releaseSubmitting } = useSubmittingLock(SUBMIT_FLAG_KEY);
  // Debounced visual submitting state to avoid flicker on fast transitions (mobile)
  const [visualSubmitting, setVisualSubmitting] = useState(false);
  const submitShownAtRef = useRef(0);
  // Only show full-page skeleton on the first visit
  const [hasSeenInitialSkeleton, setHasSeenInitialSkeleton] = useState(false);

  useEffect(() => {
    let showTimer = null;
    const MIN_SHOW_MS = 600; // keep visible at least this long once shown
    const SHOW_DELAY_MS = 200; // delay before showing to avoid quick flashes
    if (isSubmitting) {
      // schedule show after delay if not already showing
      if (!visualSubmitting) {
        showTimer = setTimeout(() => {
          submitShownAtRef.current = Date.now();
          setVisualSubmitting(true);
        }, SHOW_DELAY_MS);
      }
    } else {
      // hide with minimum duration enforcement
      if (visualSubmitting) {
        const elapsed = Date.now() - submitShownAtRef.current;
        const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
        const t = setTimeout(() => setVisualSubmitting(false), remaining);
        return () => clearTimeout(t);
      }
    }
    return () => {
      if (showTimer) clearTimeout(showTimer);
    };
  }, [isSubmitting, visualSubmitting]);

  // Initialize the "seen" flag from sessionStorage
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('checkout_seen_initial_skeleton');
      if (seen === 'true') setHasSeenInitialSkeleton(true);
    } catch {}
  }, []);

  // Notify parent about submitting states (for mobile external button)
  useEffect(() => {
    if (typeof onSubmittingChange === 'function') {
      onSubmittingChange({ isSubmitting, visualSubmitting });
    }
  }, [isSubmitting, visualSubmitting, onSubmittingChange]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  // Debounced visual loaders for smoother mobile experience
  const [visualLoadingAddresses, setVisualLoadingAddresses] = useState(false);
  const [visualLoadingShipping, setVisualLoadingShipping] = useState(false);
  const [visualLoadingProviders, setVisualLoadingProviders] = useState(false);
  const addrShownAtRef = useRef(0);
  const shipShownAtRef = useRef(0);
  const provShownAtRef = useRef(0);

  useEffect(() => {
    const MIN_SHOW_MS = 400;
    const SHOW_DELAY_MS = 150;
    let timer;
    if (isLoadingAddresses) {
      if (!visualLoadingAddresses) {
        timer = setTimeout(() => {
          addrShownAtRef.current = Date.now();
          setVisualLoadingAddresses(true);
        }, SHOW_DELAY_MS);
      }
    } else if (visualLoadingAddresses) {
      const elapsed = Date.now() - addrShownAtRef.current;
      const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      timer = setTimeout(() => setVisualLoadingAddresses(false), remaining);
    }
    return () => timer && clearTimeout(timer);
  }, [isLoadingAddresses, visualLoadingAddresses]);

  useEffect(() => {
    const MIN_SHOW_MS = 400;
    const SHOW_DELAY_MS = 150;
    let timer;
    if (isLoadingShippingOptions) {
      if (!visualLoadingShipping) {
        timer = setTimeout(() => {
          shipShownAtRef.current = Date.now();
          setVisualLoadingShipping(true);
        }, SHOW_DELAY_MS);
      }
    } else if (visualLoadingShipping) {
      const elapsed = Date.now() - shipShownAtRef.current;
      const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      timer = setTimeout(() => setVisualLoadingShipping(false), remaining);
    }
    return () => timer && clearTimeout(timer);
  }, [isLoadingShippingOptions, visualLoadingShipping]);

  useEffect(() => {
    const MIN_SHOW_MS = 400;
    const SHOW_DELAY_MS = 150;
    let timer;
    if (isLoadingProviders) {
      if (!visualLoadingProviders) {
        timer = setTimeout(() => {
          provShownAtRef.current = Date.now();
          setVisualLoadingProviders(true);
        }, SHOW_DELAY_MS);
      }
    } else if (visualLoadingProviders) {
      const elapsed = Date.now() - provShownAtRef.current;
      const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      timer = setTimeout(() => setVisualLoadingProviders(false), remaining);
    }
    return () => timer && clearTimeout(timer);
  }, [isLoadingProviders, visualLoadingProviders]);

  // Load addresses from backend
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Load payment providers for the region
  useEffect(() => {
    (async () => {
      try {
        setIsLoadingProviders(true);
        const { payment_providers = [] } = await paymentService.listProviders({ region_id: cart?.region?.id });
        setPaymentProviders(payment_providers);
        // Do not auto-select any payment method; require explicit user choice
        setSelectedProviderId((prev) => prev && payment_providers.some(p => p.id === prev) ? prev : null);
      } catch (e) {
        // global toast via interceptor
      } finally {
        setIsLoadingProviders(false);
      }
    })();
  }, [cart?.region?.id]);

  // Load shipping options for the cart
  useEffect(() => {
    if (!cart?.id) return;
    (async () => {
      try {
        setIsLoadingShippingOptions(true);
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
      } finally {
        setIsLoadingShippingOptions(false);
      }
    })();
  }, [cart?.id, cart?.shipping_address?.country_code]);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const { addresses: list } = await listAddresses();
      setAddresses(list);
      // Do not auto-select or set on cart. User must select explicitly.
      setSelectedAddressId(null);
      setAddressError('');
    } catch (e) {
      // global toasts handled by api client
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Email prefill + debounced sync (extracted without behavior change)
  useEmailSync({
    cartEmail: cart?.email,
    formEmail: formData.email,
    setFormEmail: (val) => setFormData((prev) => ({ ...prev, email: val })),
    setCartEmail: setEmail,
    debounceMs: 400,
  });

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
        country_code: 'in',
        isDefault: typeof formData.isDefault === 'boolean' ? formData.isDefault : true,
      };
      let newId = tempAddressId;
      if (!tempAddressId) {
        const created = await createAddress(uiAddr, { successMessage: 'Address saved' });
        newId = created?.address?.id || created?.id;
        if (newId) setTempAddressId(newId);
        if (newId) {
          // Optimistically add to local list to avoid refetch flicker
          setAddresses(prev => [{ ...uiAddr, id: newId, isDefault: uiAddr.isDefault }, ...prev]);
        }
      } else {
        await updateAddress(tempAddressId, uiAddr, { successMessage: 'Address updated' });
        // Optimistically update local list
        setAddresses(prev => prev.map(a => a.id === tempAddressId ? { ...a, ...uiAddr } : a));
      }
      const picked = { ...uiAddr, id: newId || tempAddressId };
      try {
        await setShippingAddress(picked);
        await setBillingAddress(picked);
        // Avoid refresh() to prevent UI flicker; rely on local state
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
  // Auto-save temp address when no saved addresses (extracted without behavior change)
  useAutoSaveTempAddress({
    addressesLength: addresses.length,
    autoSaveEnabled,
    formData,
    tempAddressId,
    setTempAddressId,
    setAddresses,
    setAddressError,
    validateInlineAddress,
    createAddress,
    updateAddress,
    setShippingAddress,
    setBillingAddress,
    debounceMs: 600,
    autoSaveTimerRef,
  });

  // Coupon UI removed; managed within Order Summary

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return; // guard against double submit
    // Lock immediately for smooth UX; revert on validation failure
    lockSubmitting();
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
        releaseSubmitting();
        return;
      }
      // If valid and not yet saved, persist inline address before proceeding (same as Save button)
      try {
        const saved = await saveInlineAddress();
        if (!saved) {
          releaseSubmitting();
          return; // saving failed or invalid
        }
        savedInlineAddr = saved;
      } catch (_) {
        releaseSubmitting();
        return;
      }
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
      // Avoid immediate refresh to reduce flicker; rely on local state and validations below
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
      scrollToFirstInvalid();
      releaseSubmitting();
      return;
    }
    // Payment v2: Create payment collection then init session for selected provider
    if (!cart?.id) {
      setPaymentError('Cart not ready');
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollToFirstInvalid();
      releaseSubmitting();
      return;
    }
    // Ensure a payment method is chosen
    if (!selectedProviderId) {
      setPaymentError('Please select a payment method.');
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollToFirstInvalid();
      releaseSubmitting();
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
      scrollToFirstInvalid();
      releaseSubmitting();
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
        scrollToFirstInvalid();
        releaseSubmitting();
        return;
      }
    }
    try {
      // Use the returned payment_collection so we don't need to refetch it
      paymentCollection = await paymentService.initPaymentSession({ payment_collection_id: paymentCollection?.id, provider_id });
    } catch (err) {
      const msg = err?.message || 'Failed to initialize payment session';
      setPaymentError(msg);
      if (paymentSectionRef.current) {
        paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollToFirstInvalid();
      releaseSubmitting();
      return;
    }
    // If Razorpay selected, open Checkout before completing cart
    // Medusa v2 provider ids are often prefixed, e.g., 'pp_razorpay_razorpay'. Match by substring.
    const isRazorpayProvider = typeof provider_id === 'string' && provider_id.toLowerCase().includes('razorpay')
    if (isRazorpayProvider) {
      try {
        // Load Razorpay script
        await loadRazorpay();
        // Use the payment collection returned by initPaymentSession
        const pc = paymentCollection;
        const session = (pc?.payment_sessions || pc?.sessions || []).find((s) =>
          typeof s?.provider_id === 'string' && s.provider_id.toLowerCase().includes('razorpay')
        );
        if (!session) {
          throw new Error('Razorpay session not found');
        }
        const sdata = session?.data || {};
        const key_id = sdata.key_id;
        const order_id = sdata.order_id;
        const currency = (sdata.currency_code || 'INR').toUpperCase();
        if (!key_id || !order_id) {
          throw new Error('Razorpay session data incomplete');
        }

        let resolveFlow;
        const flowPromise = new Promise((resolve) => { resolveFlow = resolve });

        const options = {
          key: key_id,
          // Do not pass amount when order_id is provided; Razorpay uses the order's amount.
          currency,
          name: 'Faxio',
          description: 'Order Payment',
          order_id,
          prefill: {
            email: cart?.email || '',
            contact: defaultAddress?.phone || '',
            name: defaultAddress?.name || '',
          },
          theme: { color: '#000000' },
          handler: async function (resp) {
            try {
              await paymentService.verifyRazorpayPayment({
                payment_collection_id: pc.id,
                session_id: session.id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_signature: resp.razorpay_signature,
              })
              resolveFlow(true)
            } catch (e) {
              setPaymentError(e?.message || 'Payment verification failed. Please try again.')
              releaseSubmitting()
              resolveFlow(false)
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentError('Payment cancelled');
              releaseSubmitting();
              resolveFlow(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        const completed = await flowPromise;
        if (!completed) return; // early exit after ondismiss
      } catch (e) {
        setPaymentError(e?.message || 'Razorpay checkout failed to start');
        releaseSubmitting();
        return;
      }
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
        scrollToFirstInvalid();
        releaseSubmitting();
        return;
      }
      if (result?.type === 'order' && result?.order?.id) {
        // Force-create a brand new cart after successful order (Medusa v2)
        try { await createCart(); } catch {}
        try {
          // Clear the submitting flag
          sessionStorage.removeItem(SUBMIT_FLAG_KEY);
          // Persist the order so confirmation page can show real data
          sessionStorage.setItem('last_order', JSON.stringify(result.order));
        } catch {}
        router.push(`/order-confirmation?order_id=${encodeURIComponent(result.order.id)}`);
        return;
      }
      // Any non-order response is treated as failure; stay on page
      const errMsg = 'Unable to complete order. Please review your details and try again.';
      setAddressError(errMsg);
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollToFirstInvalid();
      releaseSubmitting();
    } catch (err) {
      const msg = err?.message || 'Failed to complete order';
      setAddressError(msg);
      if (shippingSectionRef.current) {
        shippingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollToFirstInvalid();
      releaseSubmitting();
    }
    // Also pass form data upward if a parent wants to track it
    onSubmit?.({ ...formData, selectedAddress: defaultAddress });
  };

  // addressTypes and getTypeIcon are imported from utils to keep concerns separated

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

  const isInitialLoading = !cart?.id || isLoadingAddresses || isLoadingProviders || isLoadingShippingOptions;
  const shouldShowFullSkeleton = !hasSeenInitialSkeleton && isInitialLoading;

  // Once the initial loading completes for the first time, persist the flag
  useEffect(() => {
    if (!isInitialLoading && !hasSeenInitialSkeleton) {
      try {
        sessionStorage.setItem('checkout_seen_initial_skeleton', 'true');
      } catch {}
      setHasSeenInitialSkeleton(true);
    }
  }, [isInitialLoading, hasSeenInitialSkeleton]);

  // Scroll to the first invalid field (aria-invalid=true) or error alert
  const scrollToFirstInvalid = () => {
    try {
      const el = document.querySelector('[aria-invalid="true"], [data-error="true"], [role="alert"].text-red-600');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof el.focus === 'function') {
          el.focus({ preventScroll: true });
        }
      }
    } catch {}
  };

  if (shouldShowFullSkeleton) {
    return <CheckoutLoading isSubmitting={isSubmitting} onSubmit={handleSubmit} />;
  }

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative">
      {/* Contact Information */}
      <div ref={shippingSectionRef}>
        <ContactInformationSection formData={formData} onChange={handleChange} />
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
      <div className={`bg-white border rounded-xl p-4 sm:p-6 shadow-sm relative transition-opacity duration-200 lg:transition-none ${visualLoadingAddresses ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          <h3 className="text-base sm:text-lg font-semibold">Shipping Address</h3>
        </div>
        {visualLoadingAddresses ? (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10 animate-pulse lg:hidden" aria-hidden />
        ) : null}
        
        {/* If saved addresses exist: show selection UI */}
        {addresses.length > 0 ? (
          <AddressBookSection
            addresses={addresses}
            addressError={addressError}
            isApplyingAddress={isApplyingAddress}
            onAddAddress={() => setShowAddModal(true)}
            getTypeIcon={getTypeIcon}
            onSelect={async (address) => {
              const id = address?.id;
              setSelectedAddressId(id || null);
              if (!id) {
                setAddressError('No address id found for this selection. Please choose another or add a new address.');
                return;
              }
              try {
                setIsApplyingAddress(true);
                // Optimistically mark default locally to avoid UI jump
                setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
                await updateAddress(id, { isDefault: true }, { successMessage: null });
                setSelectedAddressId(id);
                setAddressError('');
                const picked = { ...address };
                try {
                  await setShippingAddress(picked);
                } catch (err) {
                  setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to set address on cart');
                }
                // Re-load shipping options without auto-selecting to prevent jumps
                try {
                  setIsLoadingShippingOptions(true);
                  const { shipping_options = [] } = await shippingService.listCartOptions({ cart_id: cart?.id });
                  setShippingOptions(shipping_options);
                  // keep current selection if still valid
                  setSelectedShippingOptionId((prev) => (prev && shipping_options.some((o) => o.id === prev) ? prev : null));
                  setShippingError('');
                } catch (err) {
                  setShippingOptions([]);
                  setSelectedShippingOptionId(null);
                  setShippingError(err?.message || 'Failed to load shipping options');
                } finally {
                  setIsLoadingShippingOptions(false);
                  setIsApplyingAddress(false);
                }
              } catch (e) {
                setAddressError(typeof e === 'string' ? e : e?.message || 'Failed to set default address');
                setIsApplyingAddress(false);
              }
            }}
          />
        ) : (
          <InlineAddressForm
            formData={formData}
            inlineErrors={inlineErrors}
            onChange={handleChange}
            onSave={saveInlineAddress}
            saving={savingAddress}
            addressTypes={addressTypes}
            onSelectType={(val) => setFormData((prev) => ({ ...prev, type: val }))}
          />
        )}
      </div>

      {/* Shipping Method */}
      <div className={`relative transition-opacity duration-200 lg:transition-none ${visualLoadingShipping ? 'opacity-60 pointer-events-none' : ''}`}>
        {visualLoadingShipping ? (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10 animate-pulse lg:hidden" aria-hidden />
        ) : null}
        <ShippingMethodSection
          cart={cart}
          shippingOptions={shippingOptions}
          selectedShippingOptionId={selectedShippingOptionId}
          loading={visualLoadingShipping || isChangingShipping}
          onSelectOption={async (id) => {
            setSelectedShippingOptionId(id);
            setShippingError('');
            try {
              if (!cart?.id) throw new Error('Cart not ready');
              setIsChangingShipping(true);
              await shippingService.addShippingMethod({ cartId: cart.id, option_id: id });
              await refresh();
            } catch (e) {
              setShippingError(e?.message || 'Failed to set shipping method');
            } finally {
              setIsChangingShipping(false);
            }
          }}
          shippingError={shippingError}
        />
      </div>

      {/* Payment Method */}
      <div ref={paymentSectionRef} className={`relative transition-opacity duration-200 lg:transition-none ${visualLoadingProviders ? 'opacity-60 pointer-events-none' : ''}`}>
        {visualLoadingProviders ? (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10 animate-pulse lg:hidden" aria-hidden />
        ) : null}
        <PaymentMethodSection
          paymentProviders={paymentProviders}
          selectedProviderId={selectedProviderId}
          loading={visualLoadingProviders}
          onSelect={(id) => {
            setSelectedProviderId(id);
            setFormData((prev) => ({ ...prev, paymentMethod: id }));
          }}
          paymentError={paymentError}
        />
      </div>

      {/* Trust and payment badges near CTA */}
      <section aria-labelledby="payment-security-label" className="mb-6">
        <h4 id="payment-security-label" className="sr-only">Payment security and assurances</h4>
        <div className="bg-gray-50 border rounded-xl p-4 sm:p-5">
          <SimpleTrustBadges className="mb-4 sm:mb-5" />
          <SimplePaymentBadges />
        </div>
      </section>

      <button
        type="submit"
        aria-busy={isSubmitting}
        disabled={isSubmitting || !selectedShippingOptionId || !selectedProviderId}
        className="hidden lg:block w-full bg-black text-white py-4 px-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white transition-transform active:scale-[0.99]"
      >
        <span className="inline-flex justify-center min-w-[140px]">
          {visualSubmitting ? 'Processing...' : 'Place Order'}
        </span>
      </button>
      <div
        className={`absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] transition-opacity duration-200 ${visualSubmitting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden
      />
    </form>
  );
}
