'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrustFAQ from '@/components/ui/TrustFAQ';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container-fluid section-padding">
        <TrustFAQ />
      </div>

      <Footer />
    </div>
  );
}
