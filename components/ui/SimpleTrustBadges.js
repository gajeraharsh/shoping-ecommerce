'use client';

import { Shield, Lock } from 'lucide-react';

export default function SimpleTrustBadges({ className = '' }) {
  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="font-semibold text-green-800">Secure Checkout</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
}

export function SimplePaymentBadges({ className = '' }) {
  return (
    <div className={`flex justify-center gap-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="text-sm font-medium text-gray-700">Secure payments with:</div>
      <div className="flex gap-3">
        <span className="bg-white px-3 py-1 rounded text-xs font-medium border">VISA</span>
        <span className="bg-white px-3 py-1 rounded text-xs font-medium border">MASTERCARD</span>
        <span className="bg-white px-3 py-1 rounded text-xs font-medium border">UPI</span>
      </div>
    </div>
  );
}
