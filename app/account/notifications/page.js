'use client';

import { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Package,
  Heart,
  Tag,
  CreditCard,
  Shield,
  TrendingUp,
  Star,
  Gift,
  Check,
  X
} from 'lucide-react';

export default function NotificationsPage() {
  const [expandedCategories, setExpandedCategories] = useState({
    transactional: true,
    security: true,
    shopping: false,
    marketing: false,
    engagement: false
  });

  const [settings, setSettings] = useState({
    // Email Notifications
    email: {
      orderUpdates: true,
      shipmentTracking: true,
      deliveryConfirmation: true,
      returnUpdates: true,
      paymentConfirmation: true,
      accountSecurity: true,
      wishlistReminders: false,
      priceDrops: true,
      backInStock: true,
      newArrivals: false,
      salesAndOffers: false,
      personalizedRecommendations: true,
      loyaltyUpdates: true,
      reviewReminders: false,
      newsletter: false
    },
    // SMS Notifications
    sms: {
      orderUpdates: true,
      shipmentTracking: true,
      deliveryConfirmation: true,
      paymentConfirmation: false,
      accountSecurity: true,
      salesAndOffers: false,
      priceDrops: false
    },
    // Push Notifications (for mobile app)
    push: {
      orderUpdates: true,
      newArrivals: false,
      salesAndOffers: false,
      wishlistReminders: true,
      reviewReminders: false
    },
    // Frequency Settings
    frequency: {
      newsletter: 'weekly',
      recommendations: 'bi-weekly',
      salesAlerts: 'daily'
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleFrequencyChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [setting]: value
      }
    }));
  };

  const notificationCategories = [
    {
      id: 'transactional',
      title: 'Transactional',
      description: 'Order and account-related notifications',
      icon: Package,
      color: 'text-blue-600',
      settings: [
        { 
          key: 'orderUpdates', 
          label: 'Order Updates', 
          description: 'Status changes for your orders',
          recommended: true
        },
        { 
          key: 'shipmentTracking', 
          label: 'Shipment Tracking', 
          description: 'Real-time shipping updates',
          recommended: true
        },
        { 
          key: 'deliveryConfirmation', 
          label: 'Delivery Confirmation', 
          description: 'When your order is delivered',
          recommended: true
        },
        { 
          key: 'returnUpdates', 
          label: 'Return Updates', 
          description: 'Status of return and exchange requests',
          recommended: true
        },
        { 
          key: 'paymentConfirmation', 
          label: 'Payment Confirmation', 
          description: 'Payment processing notifications',
          recommended: true
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Account',
      description: 'Account security and login notifications',
      icon: Shield,
      color: 'text-red-600',
      settings: [
        { 
          key: 'accountSecurity', 
          label: 'Security Alerts', 
          description: 'Login attempts and security changes',
          recommended: true,
          required: true
        }
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Product and wishlist notifications',
      icon: Heart,
      color: 'text-pink-600',
      settings: [
        { 
          key: 'wishlistReminders', 
          label: 'Wishlist Reminders', 
          description: 'Reminders about items in your wishlist'
        },
        { 
          key: 'priceDrops', 
          label: 'Price Drop Alerts', 
          description: 'When wishlist items go on sale'
        },
        { 
          key: 'backInStock', 
          label: 'Back in Stock', 
          description: 'When out-of-stock items become available'
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing & Promotions',
      description: 'Sales, offers, and new product notifications',
      icon: Tag,
      color: 'text-green-600',
      settings: [
        { 
          key: 'newArrivals', 
          label: 'New Arrivals', 
          description: 'Latest fashion collections and trends'
        },
        { 
          key: 'salesAndOffers', 
          label: 'Sales & Offers', 
          description: 'Special discounts and promotional deals'
        },
        { 
          key: 'personalizedRecommendations', 
          label: 'Personalized Recommendations', 
          description: 'Products curated based on your preferences'
        },
        { 
          key: 'loyaltyUpdates', 
          label: 'Loyalty Program', 
          description: 'Points balance and rewards updates'
        }
      ]
    },
    {
      id: 'engagement',
      title: 'Engagement',
      description: 'Reviews, newsletters, and community updates',
      icon: Star,
      color: 'text-yellow-600',
      settings: [
        { 
          key: 'reviewReminders', 
          label: 'Review Reminders', 
          description: 'Reminders to review purchased items'
        },
        { 
          key: 'newsletter', 
          label: 'Fashion Newsletter', 
          description: 'Style tips, trends, and fashion inspiration'
        }
      ]
    }
  ];

  const channelIcons = {
    email: Mail,
    sms: MessageSquare,
    push: Smartphone
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'never', label: 'Never' }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h1>
        <p className="text-gray-600">Customize how and when you receive notifications</p>
      </div>

      {/* Quick Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Quick Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Essential Only</div>
                <div className="text-sm text-gray-600">Orders & security</div>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              Apply
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Recommended</div>
                <div className="text-sm text-gray-600">Balanced notifications</div>
              </div>
            </div>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
              Apply
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">All Updates</div>
                <div className="text-sm text-gray-600">Everything enabled</div>
              </div>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-8">
        {notificationCategories.map(category => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${category.color}`} />
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="space-y-4">
                {category.settings.map(setting => (
                  <div key={setting.key} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{setting.label}</h4>
                          {setting.recommended && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                          {setting.required && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Email */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Email</span>
                        </div>
                        <button
                          onClick={() => handleToggle('email', setting.key)}
                          disabled={setting.required}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.email[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          } ${setting.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.email[setting.key] ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* SMS */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">SMS</span>
                        </div>
                        <button
                          onClick={() => handleToggle('sms', setting.key)}
                          disabled={!settings.sms.hasOwnProperty(setting.key)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.sms[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          } ${!settings.sms.hasOwnProperty(setting.key) ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.sms[setting.key] ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Push */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Push</span>
                        </div>
                        <button
                          onClick={() => handleToggle('push', setting.key)}
                          disabled={!settings.push.hasOwnProperty(setting.key)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.push[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          } ${!settings.push.hasOwnProperty(setting.key) ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.push[setting.key] ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequency Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequency Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Newsletter Frequency</div>
              <div className="text-sm text-gray-600">How often you receive fashion newsletters</div>
            </div>
            <select
              value={settings.frequency.newsletter}
              onChange={(e) => handleFrequencyChange('newsletter', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Recommendation Frequency</div>
              <div className="text-sm text-gray-600">How often you receive personalized recommendations</div>
            </div>
            <select
              value={settings.frequency.recommendations}
              onChange={(e) => handleFrequencyChange('recommendations', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Sales Alert Frequency</div>
              <div className="text-sm text-gray-600">How often you receive sales and offer notifications</div>
            </div>
            <select
              value={settings.frequency.salesAlerts}
              onChange={(e) => handleFrequencyChange('salesAlerts', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Check className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}
