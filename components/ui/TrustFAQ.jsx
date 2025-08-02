'use client';

import { useState } from 'react';
import { ChevronDown, Shield, Truck, RotateCcw, CreditCard, HeartHandshake, Award } from 'lucide-react';

export default function TrustFAQ({ className = '' }) {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqCategories = [
    {
      title: 'Security & Trust',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      faqs: [
        {
          question: 'Is my personal information secure?',
          answer: 'Absolutely. We use bank-level 256-bit SSL encryption to protect all your personal and payment information. We are PCI DSS compliant and never store your credit card details on our servers.'
        },
        {
          question: 'How do I know this website is legitimate?',
          answer: 'Modave is a registered business with verified certifications. We have served over 100,000+ customers since 2018, maintain an A+ Better Business Bureau rating, and are verified by Google and other trusted platforms.'
        },
        {
          question: 'What if I receive a damaged or wrong item?',
          answer: 'We have a 100% satisfaction guarantee. If you receive a damaged or incorrect item, contact us within 48 hours and we\'ll arrange a free replacement or full refund immediately.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      faqs: [
        {
          question: 'How fast do you ship?',
          answer: 'Orders placed before 2 PM are shipped the same day. We offer free standard shipping (3-5 days), express shipping (1-2 days), and next-day delivery options to most locations.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days with full tracking provided.'
        },
        {
          question: 'What if my package is lost?',
          answer: 'All shipments are fully insured. If your package is lost, we\'ll send a replacement immediately at no extra cost or provide a full refund.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: RotateCcw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a generous 30-day return policy. Items must be unworn with original tags. We provide free return shipping and process refunds within 3-5 business days.'
        },
        {
          question: 'Can I exchange for a different size?',
          answer: 'Yes! Exchanges are free and easy. Simply request an exchange online, and we\'ll send the new size immediately while arranging pickup of the original item.'
        },
        {
          question: 'What if the item doesn\'t fit as expected?',
          answer: 'We have detailed size guides and fit guarantees. If an item doesn\'t fit as expected despite following our size guide, we\'ll exchange it for free or provide a full refund.'
        }
      ]
    },
    {
      title: 'Payment & Pricing',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express), UPI, PayPal, Apple Pay, Google Pay, and Cash on Delivery for eligible orders.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'Never. The price you see is the price you pay. Free shipping on orders over ₹2,999, no hidden charges, and transparent pricing always.'
        },
        {
          question: 'Is it safe to save my payment information?',
          answer: 'Yes, we use tokenization technology that replaces your card details with secure tokens. Your actual card information is never stored on our servers.'
        }
      ]
    },
    {
      title: 'Quality & Authenticity',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      faqs: [
        {
          question: 'How do you ensure product quality?',
          answer: 'Every item goes through a 12-point quality check. We partner only with certified manufacturers and conduct regular factory audits to maintain our high standards.'
        },
        {
          question: 'Are all products authentic?',
          answer: '100% guaranteed. We source directly from authorized distributors and have zero tolerance for counterfeit items. Every product comes with an authenticity guarantee.'
        },
        {
          question: 'What if I\'m not satisfied with the quality?',
          answer: 'We stand behind every product. If you\'re not completely satisfied with the quality, return it within 30 days for a full refund, no questions asked.'
        }
      ]
    },
    {
      title: 'Customer Support',
      icon: HeartHandshake,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      faqs: [
        {
          question: 'How can I contact customer support?',
          answer: 'Our support team is available 24/7 via live chat, email (support@modave.com), or phone (+1-555-123-4567). Average response time is under 2 hours.'
        },
        {
          question: 'Do you have a size consultation service?',
          answer: 'Yes! Our styling experts offer free size and fit consultations via chat or video call to help you find the perfect fit.'
        },
        {
          question: 'What if I need help after my purchase?',
          answer: 'We provide lifetime customer support for all purchases. Whether it\'s styling advice, care instructions, or any issues, we\'re here to help.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, faqIndex) => {
    const itemId = `${categoryIndex}-${faqIndex}`;
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Everything you need to know about shopping with confidence at Modave
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          
          return (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Category Header */}
              <div className={`${category.bgColor} dark:bg-gray-700 p-6`}>
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${category.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>
              </div>

              {/* FAQs */}
              <div className="p-6 space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems.has(itemId);

                  return (
                    <div key={faqIndex} className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(categoryIndex, faqIndex)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Support CTA */}
      <div className="mt-12 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Still Have Questions?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Our customer support team is here to help 24/7
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@modave.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <HeartHandshake className="h-5 w-5" />
            Email Support
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
}
