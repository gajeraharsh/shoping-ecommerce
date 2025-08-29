'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { updateMe } from '@/services/modules/customer/customerService'
import { notify } from '@/utils/notify'
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  CreditCard,
  ArrowLeft,
  Edit,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  AlertCircle,
  Trash2,
  Download
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize profile fields. Email is view-only (cannot be updated via API).
  // Prefer v2 fields; gracefully fall back to legacy name split.
  const initialFirst = user?.first_name || (user?.name ? String(user.name).split(' ')[0] : '')
  const initialLast = user?.last_name || (user?.name ? String(user.name).split(' ').slice(1).join(' ') : '')
  const [profile, setProfile] = useState({
    first_name: initialFirst,
    last_name: initialLast,
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.metadata?.dob || '',
    gender: user?.metadata?.gender || 'prefer-not-to-say'
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    priceDrops: true,
    newsletter: false,
    sms: true,
    push: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    activitySharing: false,
    dataAnalytics: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  // Helper: map current auth user shape to form state
  const mapUserToProfile = (rawUser) => {
    if (!rawUser) return null;
    const u = (rawUser && (rawUser.customer || rawUser?.data?.customer)) ? (rawUser.customer || rawUser?.data?.customer) : rawUser;
    // Derive name fallbacks if first/last aren't present
    let first = u?.first_name;
    let last = u?.last_name;
    const full = u?.name || u?.full_name || u?.fullName;
    if ((!first || first.length === 0) && full) {
      const parts = String(full).trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ');
    }
    // Metadata fallbacks for dob/gender
    const md = u?.metadata || {};
    const dob = md.dob || md.date_of_birth || md.dateOfBirth || '';
    const gender = md.gender || md.sex || 'prefer-not-to-say';
    return {
      first_name: first || initialFirst || '',
      last_name: last || initialLast || '',
      email: u?.email || '',
      phone: u?.phone || '',
      dateOfBirth: dob,
      gender: gender,
    };
  };

  // Keep form defaults in sync with context user (root fetch handles /me)
  useEffect(() => {
    if (!user) return;
    const mapped = mapUserToProfile(user);
    if (mapped) setProfile(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Also re-apply defaults when the Profile tab is opened explicitly
  useEffect(() => {
    if (editingSection !== 'profile') return;
    const mapped = mapUserToProfile(user);
    if (mapped) setProfile(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSection]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {};
      if (profile.first_name) payload.first_name = profile.first_name.trim();
      if (profile.last_name) payload.last_name = profile.last_name.trim();
      // company_name not editable per requirements
      if (profile.phone) payload.phone = profile.phone.trim(); // optional
      const metadata = {};
      if (profile.dateOfBirth) metadata.dob = profile.dateOfBirth;
      if (profile.gender) metadata.gender = profile.gender;
      if (Object.keys(metadata).length > 0) payload.metadata = metadata;

      await updateMe(payload);
      // Immediately refresh /me so context + form reflect new values
      try {
        const fresh = await refreshUser();
        const mapped = mapUserToProfile(fresh || user);
        if (mapped) setProfile(mapped);
      } catch (_) {}
      notify.success('Profile updated successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile';
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setEditingSection(null);
      // Show success message
    }, 1000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode toggle logic here
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      logout();
    }
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Update your personal details',
      icon: User,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Password and account security',
      icon: Shield,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/account"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settingSections.map((section) => {
            const Icon = section.icon;
            const isActive = editingSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setEditingSection(section.id)}
                aria-pressed={isActive}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 active:scale-95
                  ${isActive
                    ? 'bg-white dark:bg-gray-700 border-2 border-black dark:border-white shadow-md ring-1 ring-black/5'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md hover:-translate-y-1'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.color} ${isActive ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-current' : ''}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold text-sm ${isActive ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'}`}>{section.title}</h3>
                  <p className={`text-xs mt-1 ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>{section.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Information Section */}
      {editingSection === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            {/* <button
              onClick={() => setEditingSection(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address (not changeable)
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'prefer-not-to-say'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, gender }))}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                      profile.gender === gender
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Section */}
      {editingSection === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Privacy</h2>
            {/* <button
              onClick={() => setEditingSection(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>

          <div className="space-y-6">
            {/* Password Update */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Notifications Section removed as per requirements */}

      {/* Appearance & Language Section removed as per requirements */}

      {/* Account Actions section removed as per requirements */}
    </div>
  );
}
