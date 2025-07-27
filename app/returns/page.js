import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { RotateCcw, Package, CreditCard, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Contact our customer service or use our online return portal within 30 days',
      icon: AlertCircle
    },
    {
      step: 2,
      title: 'Pack Your Items',
      description: 'Securely package items with original tags and packaging when possible',
      icon: Package
    },
    {
      step: 3,
      title: 'Ship Back',
      description: 'Use the prepaid return label or ship to our returns center',
      icon: RotateCcw
    },
    {
      step: 4,
      title: 'Get Refunded',
      description: 'Receive your refund within 5-7 business days of our receipt',
      icon: CreditCard
    }
  ];

  const exchangeReasons = [
    'Different size needed',
    'Different color preference',
    'Item damaged or defective',
    'Not as described online',
    'Changed mind about purchase',
    'Gift exchange'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, 
            we make returns and exchanges easy and hassle-free.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Our Return Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">30 Days</div>
              <div className="text-green-800">Return window from delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
              <div className="text-green-800">Return shipping on defective items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5-7 Days</div>
              <div className="text-green-800">Refund processing time</div>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">How to Return an Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="h-8 w-8 text-primary" />
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Conditions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Return Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">✓ What We Accept</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items returned within 30 days of delivery
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items in original condition with tags attached
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Unworn and unwashed items
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items in original packaging when applicable
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Defective or damaged items (any time)
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">✗ What We Don't Accept</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items returned after 30 days
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Worn, washed, or altered items
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Items without original tags
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Undergarments and intimate apparel
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Customized or personalized items
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Exchanges</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Size & Color Exchanges</h3>
            <p className="text-blue-800 mb-4">
              Need a different size or color? We make exchanges simple! Just follow the same return 
              process and specify your exchange preference.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Exchange Process:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Return your original item</li>
                  <li>• Specify your exchange preference</li>
                  <li>• We'll ship your new item immediately</li>
                  <li>• No additional shipping charges for exchanges</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Common Exchange Reasons:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {exchangeReasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Refund Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Methods</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Original payment method (credit/debit card)
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Store credit for faster processing
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Gift card if original purchase was with gift card
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  PayPal refund for PayPal purchases
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Times</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Store credit: Immediate upon receipt
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Credit card: 5-7 business days
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Debit card: 7-10 business days
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  PayPal: 3-5 business days
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Return Shipping */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Return Shipping</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Free Return Shipping</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Defective or damaged items</li>
                  <li>• Wrong item shipped</li>
                  <li>• Items significantly different from description</li>
                  <li>• Quality issues or manufacturing defects</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Pays Shipping ($7.99)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Change of mind returns</li>
                  <li>• Size or color exchanges</li>
                  <li>• Items that don't fit as expected</li>
                  <li>• Style preference changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* International Returns */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">International Returns</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-4">Special Instructions for International Customers:</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• Return window is extended to 45 days for international orders</li>
              <li>• Customer responsible for return shipping costs</li>
              <li>• Mark package as "RETURNED GOODS" to avoid customs fees</li>
              <li>• Include original invoice with returned items</li>
              <li>• Refunds exclude original international shipping charges</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-primary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
          <p className="mb-6">Our customer service team is ready to assist you with any return questions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="mailto:returns@fashionista.com"
              className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold"
            >
              Email Returns Team
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
