'use client';

import { useEffect } from 'react';

export default function PaginationLinks({ basePath = '/products', page = 1, limit = 24, count = 0 }) {
  useEffect(() => {
    try {
      const totalPages = limit > 0 ? Math.max(1, Math.ceil(count / limit)) : 1;
      const url = new URL(window.location.href);
      const sp = url.searchParams;

      const makeUrl = (newPage) => {
        const u = new URL(url.origin + basePath);
        const params = new URLSearchParams(sp);
        if (newPage > 1) {
          params.set('page', String(newPage));
        } else {
          params.delete('page');
        }
        // Preserve other known params
        ['q', 'category_id', 'collection_id', 'sort', 'limit'].forEach((k) => {
          const v = sp.get(k);
          if (v) params.set(k, v);
        });
        const qs = params.toString();
        u.search = qs ? `?${qs}` : '';
        return u.toString();
      };

      const cleanup = [];
      const addLink = (rel, href) => {
        if (!href) return;
        const link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        document.head.appendChild(link);
        cleanup.push(() => link.remove());
      };

      if (page > 1) addLink('prev', makeUrl(page - 1));
      if (page < totalPages) addLink('next', makeUrl(page + 1));

      return () => cleanup.forEach((fn) => fn());
    } catch {
      // no-op
    }
  }, [basePath, page, limit, count]);

  return null;
}
