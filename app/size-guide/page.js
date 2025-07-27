import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Ruler, Users, AlertTriangle } from 'lucide-react';

export default function SizeGuidePage() {
  const generalSizing = [
    { size: 'XS', bust: '32-34', waist: '24-26', hips: '34-36', dress: '0-2' },
    { size: 'S', bust: '34-36', waist: '26-28', hips: '36-38', dress: '4-6' },
    { size: 'M', bust: '36-38', waist: '28-30', hips: '38-40', dress: '8-10' },
    { size: 'L', bust: '38-40', waist: '30-32', hips: '40-42', dress: '12-14' },
    { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44', dress: '16-18' },
    { size: 'XXL', bust: '42-44', waist: '34-36', hips: '44-46', dress: '20-22' }
  ];

  const kurtiSizing = [
    { size: 'XS', bust: '32', length: '42', shoulder: '14' },
    { size: 'S', bust: '34', length: '43', shoulder: '14.5' },
    { size: 'M', bust: '36', length: '44', shoulder: '15' },
    { size: 'L', bust: '38', length: '45', shoulder: '15.5' },
    { size: 'XL', bust: '40', length: '46', shoulder: '16' },
    { size: 'XXL', bust: '42', length: '47', shoulder: '16.5' }
  ];

  const measurementTips = [
    {
      title: 'Bust/Chest',
      description: 'Measure around the fullest part of your bust/chest, keeping the tape parallel to the floor.',
      tip: 'Wear a well-fitting bra for most accurate measurements'
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, which is typically the narrowest part of your torso.',
      tip: 'Don\'t suck in your stomach - breathe normally'
    },
    {
      title: 'Hips',
      description: 'Measure around the fullest part of your hips, typically 7-9 inches below your waist.',
      tip: 'Keep feet together and tape parallel to the floor'
    },
    {
      title: 'Shoulder',
      description: 'Measure from shoulder point to shoulder point across your back.',
      tip: 'Have someone help you for the most accurate measurement'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. 
            Take accurate measurements for the best shopping experience.
          </p>
        </div>

        {/* Measurement Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {measurementTips.map((tip, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Ruler className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 mb-3">{tip.description}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800"><strong>Tip:</strong> {tip.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Sizing Chart */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">General Size Chart</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-left font-semibold">Bust (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Waist (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Hips (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Dress Size</th>
                  </tr>
                </thead>
                <tbody>
                  {generalSizing.map((size, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-primary">{size.size}</td>
                      <td className="px-6 py-4">{size.bust}</td>
                      <td className="px-6 py-4">{size.waist}</td>
                      <td className="px-6 py-4">{size.hips}</td>
                      <td className="px-6 py-4">{size.dress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kurti Sizing Chart */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Kurti Size Chart</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-left font-semibold">Bust (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Length (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Shoulder (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {kurtiSizing.map((size, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-primary">{size.size}</td>
                      <td className="px-6 py-4">{size.bust}</td>
                      <td className="px-6 py-4">{size.length}</td>
                      <td className="px-6 py-4">{size.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Size Conversion */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">International Size Conversion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary text-white px-6 py-4">
                <h3 className="font-semibold">Women's Dress Sizes</h3>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">US</th>
                      <th className="text-left py-2">UK</th>
                      <th className="text-left py-2">EU</th>
                      <th className="text-left py-2">India</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b"><td className="py-2">0</td><td>4</td><td>32</td><td>28</td></tr>
                    <tr className="border-b"><td className="py-2">2</td><td>6</td><td>34</td><td>30</td></tr>
                    <tr className="border-b"><td className="py-2">4</td><td>8</td><td>36</td><td>32</td></tr>
                    <tr className="border-b"><td className="py-2">6</td><td>10</td><td>38</td><td>34</td></tr>
                    <tr className="border-b"><td className="py-2">8</td><td>12</td><td>40</td><td>36</td></tr>
                    <tr className="border-b"><td className="py-2">10</td><td>14</td><td>42</td><td>38</td></tr>
                    <tr><td className="py-2">12</td><td>16</td><td>44</td><td>40</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary text-white px-6 py-4">
                <h3 className="font-semibold">Bra Sizes</h3>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">US/UK</th>
                      <th className="text-left py-2">EU</th>
                      <th className="text-left py-2">India</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b"><td className="py-2">32A</td><td>70A</td><td>70A</td></tr>
                    <tr className="border-b"><td className="py-2">34A</td><td>75A</td><td>75A</td></tr>
                    <tr className="border-b"><td className="py-2">36A</td><td>80A</td><td>80A</td></tr>
                    <tr className="border-b"><td className="py-2">32B</td><td>70B</td><td>70B</td></tr>
                    <tr className="border-b"><td className="py-2">34B</td><td>75B</td><td>75B</td></tr>
                    <tr className="border-b"><td className="py-2">36B</td><td>80B</td><td>80B</td></tr>
                    <tr><td className="py-2">38B</td><td>85B</td><td>85B</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Fit Guide */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Fit Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Regular Fit</h3>
              <p className="text-green-800 text-sm mb-3">
                Classic fit that follows the body's natural shape without being too tight or loose.
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Comfortable room for movement</li>
                <li>• Not form-fitting</li>
                <li>• Suitable for most body types</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Slim Fit</h3>
              <p className="text-blue-800 text-sm mb-3">
                More tailored fit that follows closer to the body's contours.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Fitted through the body</li>
                <li>• Shows silhouette</li>
                <li>• Consider sizing up if between sizes</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Relaxed Fit</h3>
              <p className="text-purple-800 text-sm mb-3">
                Loose, comfortable fit with extra room for a casual, relaxed look.
              </p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Roomy and comfortable</li>
                <li>• Casual, easy-going style</li>
                <li>• Great for layering</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-3">Important Notes</h3>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li>• Measurements may vary slightly between different styles and brands</li>
                  <li>• When in doubt between two sizes, we recommend sizing up</li>
                  <li>• Check individual product pages for specific sizing information</li>
                  <li>• Contact our customer service team if you need help choosing a size</li>
                  <li>• We offer free exchanges for size-related issues within 30 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-primary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Still Need Help Finding Your Size?</h2>
          <p className="mb-6">Our sizing experts are here to help you find the perfect fit.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="mailto:sizing@fashionista.com"
              className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold"
            >
              Email Sizing Team
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
