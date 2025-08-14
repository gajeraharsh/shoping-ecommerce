'use client';

import { useEffect, useRef } from 'react';

export default function useRevealOnScroll(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial = 'opacity-0 translate-y-6';
    const revealed = 'opacity-100 translate-y-0';
    el.classList.add(...initial.split(' '));
    el.style.transition = 'opacity 600ms ease, transform 600ms ease';

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove(...initial.split(' '));
            el.classList.add(...revealed.split(' '));
            obs.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15, ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return ref;
}
