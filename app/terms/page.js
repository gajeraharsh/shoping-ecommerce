import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our services. 
            By shopping with us, you agree to these terms and conditions.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Clear Terms</h3>
                <p className="text-sm text-gray-600">Easy to understand conditions</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fair Policies</h3>
                <p className="text-sm text-gray-600">Balanced rights and responsibilities</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Protection</h3>
                <p className="text-sm text-gray-600">Safeguarding both parties</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Important</h3>
                <p className="text-sm text-gray-600">Legally binding agreement</p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By accessing and using the Fashionista website and services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These terms constitute a legally binding agreement between you and Fashionista. We reserve the right to 
                  change these terms at any time, and such changes will be effective immediately upon posting.
                </p>
              </div>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Use of Website</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Permitted Use</h3>
                  <p className="text-gray-600 mb-3">You may use our website to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Browse and purchase products for personal use</li>
                    <li>Create and manage your account</li>
                    <li>Read product information and reviews</li>
                    <li>Contact customer service</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Use</h3>
                  <p className="text-gray-600 mb-3">You may not:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Use the website for any unlawful purpose</li>
                    <li>Resell products purchased for commercial purposes without authorization</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Upload viruses or malicious code</li>
                    <li>Interfere with the website's operation</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Account Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Account Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current 
                  at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <p>
                  You must immediately notify us of any unauthorized uses of your account or any other breaches of security. 
                  We will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result 
                  of such acts or omissions.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> You must be at least 18 years old to create an account and make purchases.
                  </p>
                </div>
              </div>
            </section>

            {/* Orders and Payment */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Orders and Payment</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Acceptance</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>All orders are subject to availability and confirmation</li>
                    <li>We reserve the right to refuse or cancel any order</li>
                    <li>Prices and availability are subject to change without notice</li>
                    <li>We may limit order quantities on certain products</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Payment is due at the time of order placement</li>
                    <li>We accept major credit cards, PayPal, and other approved payment methods</li>
                    <li>All prices are in INR and include applicable taxes</li>
                    <li>Additional charges may apply for international orders</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Cancellation</h3>
                  <p className="text-gray-600 mb-2">You may cancel your order:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Within 1 hour of placing the order if it hasn't shipped</li>
                    <li>By contacting customer service immediately</li>
                    <li>Subject to our cancellation policy and any applicable fees</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Shipping and Delivery</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We will make every effort to deliver products within the estimated timeframes, but delivery dates are not guaranteed. 
                  Risk of loss and title for products purchased pass to you upon delivery to the carrier.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Shipping costs are calculated based on destination and delivery speed</li>
                  <li>International orders may be subject to customs duties and taxes</li>
                  <li>Delivery timeframes are estimates and may vary due to external factors</li>
                  <li>You are responsible for providing accurate shipping information</li>
                </ul>
              </div>
            </section>

            {/* Returns and Exchanges */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Returns and Exchanges</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our return policy allows returns within 30 days of delivery for most items. Please refer to our 
                  detailed Return Policy page for complete terms and conditions.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Items must be in original condition with tags attached. Some items may not be eligible for return 
                    due to hygiene or safety reasons.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The service and its original content, features, and functionality are and will remain the exclusive property 
                  of Fashionista and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
                  republish, download, store, or transmit any of the material on our website without prior written consent.
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Privacy</h2>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                to understand our practices regarding the collection and use of your personal information.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">9. Disclaimers</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
                  this company excludes all representations, warranties, conditions and terms.
                </p>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We strive for accuracy but cannot guarantee error-free product information</li>
                    <li>Colors may appear differently due to monitor settings</li>
                    <li>Actual products may vary slightly from photos</li>
                    <li>Sizing may vary between brands and styles</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">10. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  In no event shall Fashionista, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                  limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  Our total liability for any claim arising out of or relating to these terms or our services shall not 
                  exceed the amount you paid for the product or service in question.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">11. Indemnification</h2>
              <p className="text-gray-600">
                You agree to defend, indemnify, and hold harmless Fashionista and its licensee and licensors, and their 
                employees, contractors, agents, officers and directors, from and against any and all claims, damages, 
                obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">12. Termination</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice 
                  or liability, under our sole discretion, for any reason whatsoever and without limitation, including but 
                  not limited to a breach of the terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using the service or contact us to 
                  request account deletion.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">13. Governing Law</h2>
              <p className="text-gray-600">
                These terms shall be interpreted and enforced in accordance with the laws of the State of New York, 
                without regard to conflict of law provisions. Any disputes arising from these terms will be resolved 
                in the courts of New York.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">14. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">15. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> legal@fashionista.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Mail:</strong> Fashionista Legal Department, 123 Fashion Street, New York, NY 10001</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
    </div>
  );
}
