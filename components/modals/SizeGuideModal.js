'use client';

import { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose, category = 'general' }) {
  const [activeTab, setActiveTab] = useState('size-chart');

  if (!isOpen) return null;

  const sizeCharts = {
    kurtis: {
      title: 'Kurti Size Guide',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '26"', hip: '34"', length: '44"' },
        { size: 'S', bust: '34"', waist: '28"', hip: '36"', length: '44"' },
        { size: 'M', bust: '36"', waist: '30"', hip: '38"', length: '45"' },
        { size: 'L', bust: '38"', waist: '32"', hip: '40"', length: '45"' },
        { size: 'XL', bust: '40"', waist: '34"', hip: '42"', length: '46"' },
        { size: 'XXL', bust: '42"', waist: '36"', hip: '44"', length: '46"' }
      ]
    },
    dresses: {
      title: 'Dress Size Guide',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '24"', hip: '34"', length: '52"' },
        { size: 'S', bust: '34"', waist: '26"', hip: '36"', length: '52"' },
        { size: 'M', bust: '36"', waist: '28"', hip: '38"', length: '53"' },
        { size: 'L', bust: '38"', waist: '30"', hip: '40"', length: '53"' },
        { size: 'XL', bust: '40"', waist: '32"', hip: '42"', length: '54"' },
        { size: 'XXL', bust: '42"', waist: '34"', hip: '44"', length: '54"' }
      ]
    },
    tops: {
      title: 'Top Size Guide',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '26"', hip: '34"', length: '24"' },
        { size: 'S', bust: '34"', waist: '28"', hip: '36"', length: '24"' },
        { size: 'M', bust: '36"', waist: '30"', hip: '38"', length: '25"' },
        { size: 'L', bust: '38"', waist: '32"', hip: '40"', length: '25"' },
        { size: 'XL', bust: '40"', waist: '34"', hip: '42"', length: '26"' },
        { size: 'XXL', bust: '42"', waist: '36"', hip: '44"', length: '26"' }
      ]
    },
    general: {
      title: 'General Size Guide',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '26"', hip: '34"', length: '32"' },
        { size: 'S', bust: '34"', waist: '28"', hip: '36"', length: '33"' },
        { size: 'M', bust: '36"', waist: '30"', hip: '38"', length: '34"' },
        { size: 'L', bust: '38"', waist: '32"', hip: '40"', length: '35"' },
        { size: 'XL', bust: '40"', waist: '34"', hip: '42"', length: '36"' },
        { size: 'XXL', bust: '42"', waist: '36"', hip: '44"', length: '37"' }
      ]
    }
  };

  const currentChart = sizeCharts[category] || sizeCharts.general;

  const measurementTips = [
    {
      title: 'Bust Measurement',
      description: 'Measure around the fullest part of your bust, keeping the tape measure level.'
    },
    {
      title: 'Waist Measurement', 
      description: 'Measure around your natural waistline, which is the narrowest part of your torso.'
    },
    {
      title: 'Hip Measurement',
      description: 'Measure around the fullest part of your hips, usually about 8 inches below your waist.'
    },
    {
      title: 'Length Measurement',
      description: 'For kurtis and dresses, measure from shoulder to desired hem length.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-center justify-center min-h-full p-4 safe-area-top safe-area-bottom">
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Ruler className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentChart.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('size-chart')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'size-chart'
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Size Chart
              </button>
              <button
                onClick={() => setActiveTab('how-to-measure')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'how-to-measure'
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                How to Measure
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'size-chart' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      All measurements are in inches. Choose the size that best matches your measurements.
                    </span>
                  </div>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Size</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Bust</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Waist</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hip</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChart.measurements.map((measurement, index) => (
                        <tr key={measurement.size} className={`border-b border-gray-100 dark:border-gray-800 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{measurement.size}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{measurement.bust}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{measurement.waist}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{measurement.hip}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{measurement.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {currentChart.measurements.map((measurement) => (
                    <div key={measurement.size} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Size {measurement.size}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Bust:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">{measurement.bust}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Waist:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">{measurement.waist}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Hip:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">{measurement.hip}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Length:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">{measurement.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'how-to-measure' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    How to Take Accurate Measurements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Follow these guidelines for the most accurate fit
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {measurementTips.map((tip, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        {tip.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Pro Tips
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                        <li>• Use a cloth measuring tape for accuracy</li>
                        <li>• Measure over your undergarments</li>
                        <li>• Stand straight and breathe normally</li>
                        <li>• Have someone help you for better results</li>
                        <li>• If between sizes, size up for comfort</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Still need help choosing the right size?
              </p>
              <button className="text-black dark:text-white font-medium text-sm underline hover:no-underline">
                Contact our sizing experts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
