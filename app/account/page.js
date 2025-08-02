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
    setIsEditing(false);
  };

  const stats = [
    {
      title: 'Total Orders',
      value: '12',
      icon: Package,
      color: 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
      trend: '+2 this month'
    },
    {
      title: 'Wishlist Items',
      value: '8',
      icon: Heart,
      color: 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
      trend: '3 new items'
    },
    {
      title: 'Saved Cards',
      value: '3',
      icon: CreditCard,
      color: 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
      trend: 'All active'
    }
  ];

  const recentActivity = [
    {
      type: 'order',
      title: 'Order #ORD001 delivered',
      description: 'Floral Summer Dress and Cotton Shirt',
      time: '2 hours ago',
      icon: Package,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      type: 'wishlist',
      title: 'Added Floral Summer Dress to wishlist',
      description: 'Size M, Blue color - ₹1,899',
      time: '1 day ago',
      icon: Heart,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      type: 'review',
      title: 'Reviewed Cotton Kurta Set',
      description: 'Rated 5 stars - "Great quality!"',
      time: '3 days ago',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      type: 'order',
      title: 'Order #ORD002 shipped',
      description: 'Premium Silk Saree - Expected delivery: Jan 25',
      time: '5 days ago',
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      type: 'payment',
      title: 'Payment method updated',
      description: 'Added new Visa card ending in 4567',
      time: '1 week ago',
      icon: CreditCard,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-lg text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="body-base text-fade">
          Manage your account and track your fashion journey
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-minimal p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</div>
                <div className="text-xs text-green-600 dark:text-green-400">{stat.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Information & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card-minimal p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-sm text-gray-900 dark:text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                    {user?.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                      {formData.phone || 'Add phone number'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                      {formData.dateOfBirth || 'Add date of birth'}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} className="btn-primary">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card-minimal p-6 h-full">
            <h3 className="heading-sm text-gray-900 dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors">
                <Package className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Track Order</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors">
                <RotateCcw className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Return Item</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors">
                <Heart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Wishlist</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors">
                <CreditCard className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Payments</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member since</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Jan 2023</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total orders</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">12</p>
            </div>
            <Package className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount spent</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">₹24,750</p>
            </div>
            <CreditCard className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <div className="card-minimal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saved amount</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">₹3,240</p>
            </div>
            <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-minimal p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="heading-sm text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
            <button className="text-sm text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors">
              View All →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivity.slice(0, 6).map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center ${activity.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 leading-tight">{activity.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-tight">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
