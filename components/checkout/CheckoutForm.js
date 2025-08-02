'use client';

import { useState } from 'react';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import TrustBadges, { PaymentSecurityBadges } from '@/components/ui/TrustBadges';

export default function CheckoutForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card'
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Contact Information */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Shipping Address</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, apartment, suite, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Payment Method</h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="card" className="text-sm sm:text-base font-medium">Credit/Debit Card</label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="cod" className="text-sm sm:text-base font-medium">Cash on Delivery</label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="upi"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === 'upi'}
              onChange={handleChange}
              className="mr-3"
            />
            <label htmlFor="upi" className="text-sm sm:text-base font-medium">UPI Payment</label>
          </div>
        </div>
      </div>

      {/* Security Assurance */}
      <TrustBadges variant="checkout" className="mb-6" />

      {/* Payment Security */}
      <PaymentSecurityBadges className="mb-6" />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 sm:py-4 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
