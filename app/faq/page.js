'use client';

import { useState } from 'react';
import TrustFAQ from '@/components/ui/TrustFAQ';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-fluid section-padding">
        <TrustFAQ />
      </div>

    </div>
  );
}
