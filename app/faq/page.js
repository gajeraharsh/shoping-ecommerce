'use client';

import { useState } from 'react';
import TrustFAQ from '@/components/ui/TrustFAQ';
import PageJsonLd from '@/components/seo/PageJsonLd.jsx';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {(() => {
        const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
        return (
          <PageJsonLd
            type="WebPage"
            title="FAQ | Faxio"
            description="Answers to common questions about shipping, returns, orders, and more."
            url={`${base}/faq`}
            breadcrumbs={[
              { name: 'Home', item: `${base}/` },
              { name: 'FAQ', item: `${base}/faq` },
            ]}
          />
        );
      })()}
      <div className="container-fluid section-padding">
        <TrustFAQ />
      </div>

    </div>
  );
}
