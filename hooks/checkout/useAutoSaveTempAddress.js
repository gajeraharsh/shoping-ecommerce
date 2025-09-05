import { useEffect } from 'react';

// Mirrors the existing auto-save behavior exactly. It only runs when
// there are no saved addresses and autoSaveEnabled is true. It validates
// the inline form, then creates or updates a temp default address and
// applies it to the cart (shipping + billing), with a debounce.
export default function useAutoSaveTempAddress({
  addressesLength,
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
  debounceMs = 600,
  autoSaveTimerRef,
}) {
  useEffect(() => {
    if (addressesLength > 0) return; // only when there are no saved addresses
    if (!autoSaveEnabled) return; // only after user explicitly saved once
    const errs = validateInlineAddress(formData);
    const hasMin = Object.keys(errs).length === 0;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!hasMin) return;
      try {
        const { firstName, lastName, address, city, state, zipCode, phone } = formData;
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
          const created = await createAddress(uiAddr, { successMessage: null });
          const newId = created?.address?.id || created?.id;
          if (newId) {
            setTempAddressId(newId);
            setAddresses(prev => [{ ...uiAddr, id: newId, isDefault: true }, ...prev]);
            const picked = { ...uiAddr, id: newId };
            try {
              await setShippingAddress(picked);
              await setBillingAddress(picked);
            } catch {}
          }
        } else {
          await updateAddress(tempAddressId, uiAddr, { successMessage: null });
          setAddresses(prev => prev.map(a => a.id === tempAddressId ? { ...a, ...uiAddr } : a));
          const picked = { ...uiAddr, id: tempAddressId };
          try {
            await setShippingAddress(picked);
            await setBillingAddress(picked);
          } catch {}
        }
        setAddressError('');
      } catch (err) {
        setAddressError(typeof err === 'string' ? err : err?.message || 'Failed to save address');
      }
    }, debounceMs);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [
    addressesLength,
    autoSaveEnabled,
    formData.firstName,
    formData.lastName,
    formData.address,
    formData.city,
    formData.state,
    formData.zipCode,
    formData.phone,
    tempAddressId,
    createAddress,
    updateAddress,
    setShippingAddress,
    setBillingAddress,
    debounceMs,
  ]);
}
