import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 business days',
      cost: '$5.99',
      description: 'Reliable delivery for everyday orders',
      icon: Truck
    },
    {
      name: 'Express Shipping',
      time: '2-3 business days',
      cost: '$12.99',
      description: 'Faster delivery when you need it sooner',
      icon: Clock
    },
    {
      name: 'Overnight Shipping',
      time: '1 business day',
      cost: '$24.99',
      description: 'Next-day delivery for urgent orders',
      icon: Package
    },
    {
      name: 'Free Shipping',
      time: '5-7 business days',
      cost: 'FREE',
      description: 'On orders over $75',
      icon: MapPin
    }
  ];

  const internationalRates = [
    { region: 'Canada', time: '7-10 business days', cost: '$15.99' },
    { region: 'United Kingdom', time: '10-14 business days', cost: '$19.99' },
    { region: 'European Union', time: '10-14 business days', cost: '$22.99' },
    { region: 'Australia & New Zealand', time: '12-16 business days', cost: '$25.99' },
    { region: 'Asia', time: '14-21 business days', cost: '$28.99' },
    { region: 'Other Countries', time: '14-21 business days', cost: '$32.99' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer multiple shipping options to get your fashion favorites to you quickly and safely.
          </p>
        </div>

        {/* Domestic Shipping Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Domestic Shipping (United States)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">{option.cost}</div>
                  <div className="text-gray-600 mb-3">{option.time}</div>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">International Shipping</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-600 mb-4">
              We're proud to ship to customers worldwide! International shipping rates vary by destination.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internationalRates.map((rate, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-2">{rate.region}</h3>
                  <div className="text-primary font-semibold">{rate.cost}</div>
                  <div className="text-sm text-gray-600">{rate.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Important Notes for International Orders:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Additional duties and taxes may apply upon delivery</li>
              <li>• Delivery times may vary due to customs processing</li>
              <li>• Free shipping promotions apply to domestic orders only</li>
            </ul>
          </div>
        </div>

        {/* Processing and Handling */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Processing & Handling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Orders placed before 2 PM EST ship the same business day
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Orders placed after 2 PM EST ship the next business day
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Weekend orders are processed on Monday
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Processing may take 1-2 additional days during peak seasons
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  All items are carefully packaged to prevent damage
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Eco-friendly packaging materials when possible
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Gift wrapping available for special occasions
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Discreet packaging for privacy
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Order Tracking</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Order</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Receive tracking information via email once your order ships</li>
                  <li>• Track your package on our website or the carrier's site</li>
                  <li>• Get real-time updates on your order status</li>
                  <li>• Contact us if you need assistance with tracking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Signature required for orders over $200</li>
                  <li>• Leave delivery instructions during checkout</li>
                  <li>• Packages may be left with neighbors if authorized</li>
                  <li>• P.O. Box delivery available for standard shipping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Restrictions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Shipping Restrictions</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-4">Please Note:</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• We cannot ship to P.O. Boxes for express or overnight delivery</li>
              <li>• Some remote locations may have extended delivery times</li>
              <li>• Certain products may have shipping restrictions based on destination</li>
              <li>• We do not ship to military APO/FPO addresses at this time</li>
              <li>• Holiday seasons may affect processing and delivery times</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-primary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Questions About Shipping?</h2>
          <p className="mb-6">Our customer service team is here to help with any shipping questions.</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
