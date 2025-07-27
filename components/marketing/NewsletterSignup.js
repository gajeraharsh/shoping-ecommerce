'use client';

import { useState } from 'react';
import { Mail, Gift, Star, CheckCircle, X } from 'lucide-react';

export default function NewsletterSignup({ variant = 'default', onClose }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
      
      // Close popup after success if it's a popup variant
      if (variant === 'popup' && onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 1000);
  };

  const benefits = [
    'Exclusive access to sales & new arrivals',
    'Get 10% off your first order',
    'Style tips from fashion experts',
    'Early bird notifications for limited editions'
  ];

  if (variant === 'popup') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          {isSubscribed ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Fashionista!</h3>
              <p className="text-gray-600 mb-4">Check your email for your 10% discount code.</p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <span className="text-primary font-semibold">Discount Code: WELCOME10</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header with Gift Icon */}
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 text-center">
                <Gift className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Get 10% Off Your First Order!</h3>
                <p className="text-primary-100 text-sm">
                  Join our VIP list for exclusive deals and early access
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="relative mb-4">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Claim My 10% Discount'}
                  </button>
                </form>

                <div className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
          <p className="text-gray-600 text-sm">Get the latest trends and exclusive offers</p>
        </div>

        {isSubscribed ? (
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-600 font-medium">Successfully subscribed!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Default variant - full section
  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 fill-white" />
            <span className="text-primary-100 font-medium">VIP MEMBERSHIP</span>
            <Star className="h-6 w-6 fill-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Fashionista Family
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get exclusive access to new collections, special offers, and fashion tips
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-primary-100">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              {isSubscribed ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Welcome to the family!</h3>
                  <p className="text-primary-100">Check your email for exclusive offers</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <Gift className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                    <h3 className="text-xl font-bold mb-2">Get 10% Off Today!</h3>
                    <p className="text-primary-100 text-sm">Instant discount on your first purchase</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-white text-primary py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-bold disabled:opacity-50"
                    >
                      {isLoading ? 'Joining...' : 'Join & Get 10% Off'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-primary-200 mt-6">
            We respect your privacy. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </div>
  );
}
