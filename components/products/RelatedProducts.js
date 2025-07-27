'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '@/utils/mockData';

export default function RelatedProducts({ currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Get 4 random products excluding current product
    const filtered = mockProducts.filter(p => p.id !== currentProductId);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setRelatedProducts(shuffled.slice(0, 4));
  }, [currentProductId]);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}