'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Package,
  Heart,
  CreditCard,
  Award,
  TrendingUp,
  Star,
  Truck,
  RotateCcw
} from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    gender: ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  // Mock data for statistics
  const stats = [
    {
      title: 'Total Orders',
      value: '12',
      icon: Package,
      color: 'bg-primary/10 text-primary',
      trend: '+2 this month'
    },
    {
      title: 'Wishlist Items',
      value: '8',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      trend: '3 new items'
    },
    {
      title: 'Saved Cards',
      value: '3',
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
      trend: 'All active'
    },
    {
      title: 'Loyalty Points',
      value: '2,450',
      icon: Award,
      color: 'bg-purple-100 text-purple-600',
      trend: '+150 earned'
    }
  ];

  const recentActivity = [
    {
      type: 'order',
      title: 'Order #ORD001 delivered',
      description: 'Floral Summer Dress and Cotton Shirt',
      time: '2 hours ago',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      type: 'wishlist',
      title: 'Added Floral Summer Dress to wishlist',
      description: 'Size M, Blue color - ₹1,899',
      time: '1 day ago',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      type: 'review',
      title: 'Reviewed Cotton Kurta Set',
      description: 'Rated 5 stars - "Great quality!"',
      time: '3 days ago',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      type: 'order',
      title: 'Order #ORD002 shipped',
      description: 'Premium Silk Saree - Expected delivery: Jan 25',
      time: '5 days ago',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      type: 'payment',
      title: 'Payment method updated',
      description: 'Added new Visa card ending in 4567',
      time: '1 week ago',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-600">Manage your account and track your fashion journey</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700">{stat.title}</div>
                <div className="text-xs text-green-600">{stat.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile, Loyalty & Quick Actions - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                    {user?.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Add your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                      {formData.phone || 'Add phone number'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                      {formData.dateOfBirth || 'Add date of birth'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                    {formData.gender || 'Add gender'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loyalty Program & Quick Actions Combined */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Loyalty Program */}
            <div className="bg-gradient-to-br from-primary via-pink-500 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Loyalty Program</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-pink-100 text-sm">Current Points</span>
                  <span className="text-xl font-bold">2,450</span>
                </div>
                <div className="w-full bg-pink-500/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-sm text-pink-100">550 points until Gold status</p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                  View Rewards
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900 text-center">Track Order</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <RotateCcw className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-medium text-green-900 text-center">Return Item</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-900 text-center">Wishlist</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
                  <CreditCard className="h-5 w-5 text-pink-600" />
                  <span className="text-xs font-medium text-pink-900 text-center">Payments</span>
                </button>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900">Jan 2023</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total orders</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Amount spent</span>
                  <span className="text-sm font-medium text-gray-900">₹24,750</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Saved amount</span>
                  <span className="text-sm font-medium text-green-600">₹3,240</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
