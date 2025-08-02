'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrustFAQ from '@/components/ui/TrustFAQ';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});
  
  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: 'Orders & Shipping',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. Free shipping on orders over $75 takes 5-7 business days.'
        },
        {
          question: 'Do you offer international shipping?',
          answer: 'Yes! We ship to most countries worldwide. International shipping takes 10-21 business days depending on the destination. Additional duties and taxes may apply.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can track your package on our website or directly on the carrier\'s website.'
        },
        {
          question: 'What if my order is delayed?',
          answer: 'If your order is delayed beyond the expected delivery date, please contact our customer service team. We\'ll track your package and provide updates or arrange a replacement if necessary.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We accept returns within 30 days of delivery. Items must be in original condition with tags attached, unworn and unwashed. Some items like undergarments cannot be returned for hygiene reasons.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Contact our customer service team or use our online return portal to initiate a return. We\'ll provide you with a prepaid return label (for defective items) or return instructions.'
        },
        {
          question: 'How long do refunds take?',
          answer: 'Refunds are processed within 5-7 business days of receiving your returned item. Store credit is available immediately upon receipt.'
        },
        {
          question: 'Can I exchange for a different size or color?',
          answer: 'Yes! Exchanges are free and follow the same return process. Just specify your exchange preference when initiating the return.'
        }
      ]
    },
    {
      title: 'Sizing & Fit',
      faqs: [
        {
          question: 'How do I find my size?',
          answer: 'Check our detailed size guide which includes measurement instructions and size charts for different product types. When in doubt between sizes, we recommend sizing up.'
        },
        {
          question: 'Do sizes run true to size?',
          answer: 'Most of our items run true to size, but some styles may fit differently. Check individual product pages for specific sizing notes and customer reviews for fit feedback.'
        },
        {
          question: 'What if the item doesn\'t fit?',
          answer: 'We offer free size exchanges within 30 days. You can return the item and we\'ll send you a different size at no extra cost.'
        },
        {
          question: 'Do you offer plus sizes?',
          answer: 'Yes! We carry sizes XS through XXL in most styles. We\'re committed to inclusive sizing and regularly expand our size range based on customer feedback.'
        }
      ]
    },
    {
      title: 'Products & Quality',
      faqs: [
        {
          question: 'What materials are your clothes made from?',
          answer: 'We use a variety of high-quality materials including cotton, silk, polyester blends, and sustainable fabrics. Each product page lists the specific fabric composition and care instructions.'
        },
        {
          question: 'How do I care for my items?',
          answer: 'Care instructions are provided on each product page and on the item\'s care label. Generally, we recommend gentle machine wash or hand wash for delicate items.'
        },
        {
          question: 'Are your products ethically made?',
          answer: 'Yes, we work with suppliers who meet our ethical standards for fair labor practices. We also offer a sustainable collection made from eco-friendly materials.'
        },
        {
          question: 'Do you restock sold-out items?',
          answer: 'We restock popular items regularly, but availability depends on seasonal collections and supplier capacity. Sign up for restock notifications on product pages.'
        }
      ]
    },
    {
      title: 'Account & Payment',
      faqs: [
        {
          question: 'Do I need an account to shop?',
          answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and enjoy faster checkout for future purchases.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and gift cards.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use SSL encryption and PCI-compliant payment processing to ensure your personal and payment information is completely secure.'
        },
        {
          question: 'Can I save items for later?',
          answer: 'Yes! Add items to your wishlist to save them for later. You can access your wishlist anytime when logged into your account.'
        }
      ]
    },
    {
      title: 'Promotions & Discounts',
      faqs: [
        {
          question: 'How do I use a discount code?',
          answer: 'Enter your discount code in the "Promo Code" field during checkout. The discount will be applied to your order total before payment.'
        },
        {
          question: 'Can I combine multiple discounts?',
          answer: 'Generally, only one discount code can be used per order. However, some promotions may be stackable - check the terms and conditions of each offer.'
        },
        {
          question: 'How can I stay updated on sales?',
          answer: 'Subscribe to our newsletter to be the first to know about sales, new arrivals, and exclusive offers. Follow us on social media for flash sales and special promotions.'
        },
        {
          question: 'Do you offer student discounts?',
          answer: 'Yes! We offer a 10% student discount. Verify your student status through our partner verification service to receive your discount code.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to the most common questions about shopping with Fashionista.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-600">Try different keywords or browse all categories</p>
            </div>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category.title}</h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemKey = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems[itemKey];
                    
                    return (
                      <div key={faqIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <span className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-primary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6">Can't find what you're looking for? Our customer service team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@fashionista.com"
              className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
