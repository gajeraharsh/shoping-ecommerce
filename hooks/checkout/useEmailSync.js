import { useEffect } from 'react';

// Preserves existing behavior: prefill from cart when form is empty,
// and debounce updating cart email when a valid, changed email is typed.
export default function useEmailSync({ cartEmail, formEmail, setFormEmail, setCartEmail, debounceMs = 400 }) {
  // Prefill email from cart when available and form is empty
  useEffect(() => {
    if (cartEmail && !formEmail) {
      setFormEmail(cartEmail);
    }
  }, [cartEmail, formEmail, setFormEmail]);

  // Debounced update to cart email when user types a valid email
  useEffect(() => {
    if (!formEmail) return;
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(formEmail);
    if (!isValid) return;
    const same = cartEmail === formEmail;
    const t = setTimeout(() => {
      if (!same) setCartEmail(formEmail);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [formEmail, cartEmail, setCartEmail, debounceMs]);
}
