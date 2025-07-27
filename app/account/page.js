'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, Heart, Settings } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your account</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const mockOrders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      total: 2499,
      status: 'Delivered',
      items: 2
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      total: 1899,
      status: 'In Transit',
      items: 1
    }
  ];

  const mockAddresses = [
    {
      id: 1,
      type: 'Home',
      address: '123 Main St, New York, NY 10001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      address: '456 Office Blvd, New York, NY 10002',
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                  {user.name.charAt(0)}
                </div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border rounded-lg p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Add phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Order History</h3>
                  <div className="space-y-4">
                    {mockOrders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{order.items} items</span>
                          <span className="font-semibold">₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>
                  <div className="space-y-4">
                    {mockAddresses.map(address => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{address.type}</h4>
                            <p className="text-gray-600">{address.address}</p>
                            {address.isDefault && (
                              <span className="text-xs bg-primary text-white px-2 py-1 rounded mt-2 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                          <button className="text-primary hover:underline text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-primary hover:text-primary transition-colors">
                      + Add New Address
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">My Wishlist</h3>
                  <p className="text-gray-600">Your wishlist items will appear here.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Get delivery updates via SMS</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}