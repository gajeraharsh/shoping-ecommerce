'use client';

import { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail,
  Globe,
  Trash2,
  Download,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    twoFactor: false,
    emailLogin: true,
    phoneLogin: false,
    loginAlerts: true,
    accountActivity: true,
    marketing: false,
    orderUpdates: true,
    newsletters: false,
    recommendations: true
  });

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic here
    alert('Password updated successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion logic here
      alert('Account deletion initiated. You will receive an email with further instructions.');
    }
  };

  const exportData = (type) => {
    // Handle data export logic here
    alert(`${type} export initiated. You will receive a download link via email.`);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your security, privacy and data preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 lg:p-8">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      settings.twoFactor ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {settings.twoFactor ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Two-Factor Authentication {settings.twoFactor ? 'Enabled' : 'Disabled'}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {settings.twoFactor 
                          ? 'Your account is protected with two-factor authentication.'
                          : 'Add an extra layer of security to your account.'
                        }
                      </p>
                      <button
                        onClick={() => handleSettingToggle('twoFactor')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settings.twoFactor
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {settings.twoFactor ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Methods */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Email Login</div>
                        <div className="text-sm text-gray-600">Login with your email address</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('emailLogin')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.emailLogin ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.emailLogin ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Phone Login</div>
                        <div className="text-sm text-gray-600">Login with your phone number</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('phoneLogin')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.phoneLogin ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.phoneLogin ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              {/* Security Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Login Alerts</div>
                      <div className="text-sm text-gray-600">Get notified when someone logs into your account</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('loginAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Account Activity</div>
                      <div className="text-sm text-gray-600">Monitor account changes and updates</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('accountActivity')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.accountActivity ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.accountActivity ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Order Updates</div>
                      <div className="text-sm text-gray-600">Receive updates about your orders</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('orderUpdates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.orderUpdates ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Marketing Emails</div>
                      <div className="text-sm text-gray-600">Receive promotional offers and deals</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('marketing')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.marketing ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Newsletters</div>
                      <div className="text-sm text-gray-600">Get fashion tips and trends</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('newsletters')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.newsletters ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.newsletters ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Recommendations</div>
                      <div className="text-sm text-gray-600">Get personalized product suggestions</div>
                    </div>
                    <button
                      onClick={() => handleSettingToggle('recommendations')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.recommendations ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.recommendations ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data & Export Tab */}
          {activeTab === 'data' && (
            <div className="space-y-8">
              {/* Data Export */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Your Data
                </h3>
                <p className="text-gray-600 mb-6">
                  Download a copy of your account data. You'll receive an email with download links.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => exportData('Profile')}
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Profile Data</div>
                      <div className="text-sm text-gray-600">Personal information and preferences</div>
                    </div>
                  </button>

                  <button
                    onClick={() => exportData('Orders')}
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Order History</div>
                      <div className="text-sm text-gray-600">Complete order and purchase history</div>
                    </div>
                  </button>

                  <button
                    onClick={() => exportData('Wishlist')}
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Wishlist Data</div>
                      <div className="text-sm text-gray-600">Saved items and favorites</div>
                    </div>
                  </button>

                  <button
                    onClick={() => exportData('All')}
                    className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Complete Data</div>
                      <div className="text-sm text-gray-600">All your account information</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Deletion */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. This will permanently delete your profile, 
                        order history, wishlist, and all associated data.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
