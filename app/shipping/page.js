import { Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Delivery',
      time: '7-10 days',
      cost: 'FREE',
      description: 'Reliable delivery for everyday orders – now free',
      icon: Truck
    },
    {
      name: 'Priority Delivery',
      time: '7-10 days',
      cost: 'FREE',
      description: 'Estimated delivery across India within 7-10 days',
      icon: Clock
    },
    {
      name: 'Assured Delivery',
      time: '7-10 days',
      cost: 'FREE',
      description: 'Consistent delivery timelines across India',
      icon: Package
    },
    {
      name: 'Free Shipping',
      time: '7-10 days',
      cost: 'FREE',
      description: 'Free shipping across India',
      icon: MapPin
    }
  ];


  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Shipping Across India</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enjoy free shipping on all orders across India. Delivery timelines vary by destination and service speed.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Shipping Options (All Free)</h2>
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

        {/* International Shipping - Removed for India-only site */}

        {/* Processing and Handling */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Processing & Handling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Orders placed before 2 PM IST ship the same business day
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Orders placed after 2 PM IST ship the next business day
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
                  <li>• Signature required for orders over ₹200</li>
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
      
    </div>
  );
}
