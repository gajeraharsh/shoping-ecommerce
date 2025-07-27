'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-full p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated with Latest Trends
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion tips.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white dark:bg-gray-800 text-primary px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>

          <p className="text-white/80 text-sm mt-4">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
