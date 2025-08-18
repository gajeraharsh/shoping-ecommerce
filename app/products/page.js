"use client";
import { Suspense } from 'react';
import ProductsClient from '@/components/products/ProductsClient';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}> 
      <ProductsClient />
    </Suspense>
  );
}
