'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-black/10 dark:bg-white/20 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-black dark:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-300">support@modave.com</p>
                  <p className="text-gray-600 dark:text-gray-300">business@modave.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4568</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Visit Us</h3>
                  <p className="text-gray-600 dark:text-gray-300">123 Fashion Street</p>
                  <p className="text-gray-600 dark:text-gray-300">New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="shipping">Shipping Questions</option>
                  <option value="product">Product Information</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What are your shipping options?</h3>
              <p className="text-gray-600 dark:text-gray-300">We offer standard, express, and overnight shipping options. Free shipping on orders over $75.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is your return policy?</h3>
              <p className="text-gray-600 dark:text-gray-300">We accept returns within 30 days of purchase. Items must be in original condition with tags.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, we ship to most countries worldwide. International shipping rates apply.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How can I track my order?</h3>
              <p className="text-gray-600 dark:text-gray-300">You'll receive a tracking number via email once your order ships. You can track it on our website.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
