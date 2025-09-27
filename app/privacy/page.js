import { Shield, Eye, Lock, Users } from 'lucide-react';
import PageJsonLd from '@/components/seo/PageJsonLd.jsx';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {(() => {
        const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
        return (
          <PageJsonLd
            type="WebPage"
            title="Privacy Policy | Faxio"
            description="Learn how Faxio collects, uses, and protects your information. Read our privacy practices."
            url={`${base}/privacy`}
            breadcrumbs={[
              { name: 'Home', item: `${base}/` },
              { name: 'Privacy Policy', item: `${base}/privacy` },
            ]}
          />
        );
      })()}
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                <p className="text-sm text-gray-600">We use industry-standard security measures</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">Clear information about data usage</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
                <p className="text-sm text-gray-600">Manage your privacy preferences</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Selling</h3>
                <p className="text-sm text-gray-600">We never sell your personal data</p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                  <p className="text-gray-600 mb-3">We collect information you provide directly to us, such as:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                    <li>Account preferences and communication settings</li>
                    <li>Customer service interactions and feedback</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Automatically Collected Information</h3>
                  <p className="text-gray-600 mb-3">We automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and general location information</li>
                    <li>Website usage patterns and preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Use Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Service Provision</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Process orders and manage your account</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Process returns and exchanges</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Communication</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Send promotional emails and newsletters (with your consent)</li>
                    <li>Notify you about sales, new products, and special offers</li>
                    <li>Conduct surveys and gather feedback</li>
                    <li>Send important account and service announcements</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Improvement and Analytics</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Analyze website usage to improve our services</li>
                    <li>Personalize your shopping experience</li>
                    <li>Develop new features and products</li>
                    <li>Prevent fraud and enhance security</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Share Information</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-blue-800 font-medium">We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Service Providers</h3>
                  <p className="text-gray-600 mb-2">We share information with trusted third parties who help us operate our business:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Payment processors for secure transaction handling</li>
                    <li>Shipping companies for order delivery</li>
                    <li>Email service providers for communications</li>
                    <li>Analytics platforms for website improvement</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Legal Requirements</h3>
                  <p className="text-gray-600">We may disclose information when required by law or to protect our rights, such as:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mt-2">
                    <li>Responding to legal requests or court orders</li>
                    <li>Investigating fraud or security issues</li>
                    <li>Protecting the safety of our customers or employees</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. Our security practices include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure data storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>PCI DSS compliance for payment processing</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Privacy Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Access and Control</h3>
                  <p className="text-gray-600 mb-2">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Access and review your personal information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Delete your account and personal data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request data portability</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Marketing Preferences</h3>
                  <p className="text-gray-600">
                    You can unsubscribe from marketing emails at any time by clicking the unsubscribe link 
                    in our emails or by updating your account preferences.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your browsing experience. Types of cookies we use:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm">Required for basic website functionality, shopping cart, and security.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm">Help us understand how visitors use our website to improve performance.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preference Cookies</h3>
                  <p className="text-gray-600 text-sm">Remember your settings and preferences for a personalized experience.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600 text-sm">Used to show relevant advertisements and measure campaign effectiveness.</p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have collected personal 
                information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">International Users</h2>
              <p className="text-gray-600">
                If you are visiting from outside the United States, please note that your information may be 
                transferred to, stored, and processed in the United States. By using our services, you consent 
                to this transfer and processing.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the "last updated" date. We encourage you to 
                review this policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> storemanager.faxio@gmail.com</p>
                <p><strong>Phone:</strong> 7801959924</p>
                <p><strong>Mail:</strong> Faxio Privacy Team, A/10 Harikrishan Socity Ahmedabad Thakkarnagar, Gujarat, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
