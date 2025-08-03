'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddAddressModal from '@/components/modals/AddAddressModal';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Home,
  Building2,
  ArrowLeft,
  Check,
  X,
  Phone,
  User,
  Navigation,
  Heart
} from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    // Mock addresses data
    setTimeout(() => {
      setAddresses([
        {
          id: 1,
          type: 'home',
          name: 'John Doe',
          phone: '+91 98765 43210',
          street: '123 Main Street, Apartment 4B',
          landmark: 'Near Central Mall',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        },
        {
          id: 2,
          type: 'office',
          name: 'John Doe',
          phone: '+91 98765 43210',
          street: '456 Business Park, Tower A, Floor 12',
          landmark: 'Opposite Metro Station',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051',
          isDefault: false
        },
        {
          id: 3,
          type: 'other',
          name: 'Jane Doe',
          phone: '+91 98765 43211',
          street: '789 Residential Complex, Block C',
          landmark: 'Behind City Hospital',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'office', label: 'Office', icon: Building2 },
    { value: 'other', label: 'Other', icon: MapPin }
  ];

  const handleAddAddress = async (addressData) => {
    const address = {
      ...addressData,
      id: Date.now()
    };

    if (address.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, address]);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleUpdateAddress = async (addressData) => {
    if (addressData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => prev.map(addr =>
      addr.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : addr
    ));

    setEditingAddress(null);
  };

  const handleModalSubmit = async (addressData) => {
    if (editingAddress) {
      await handleUpdateAddress(addressData);
    } else {
      await handleAddAddress(addressData);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getTypeIcon = (type) => {
    const typeConfig = addressTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || MapPin;
    return Icon;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'home':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'office':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Addresses</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your delivery locations</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-3 rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Address</span>
          </button>
        </div>

        {addresses.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">Quick Delivery</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'} for faster checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editingAddress={editingAddress}
      />

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No addresses saved</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your first delivery address to speed up checkout
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>
        ) : (
          addresses.map((address) => {
            const Icon = getTypeIcon(address.type);
            return (
              <div
                key={address.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
              >
                {address.isDefault && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-bl-2xl font-semibold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Default
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(address.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg capitalize">
                          {address.type} Address
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.isDefault && 'Default • '}{address.name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-900 dark:text-white">{address.street}</p>
                      {address.landmark && <p className="text-sm">Near: {address.landmark}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        {address.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 py-2 px-4 rounded-xl font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm"
                      >
                        <Heart className="w-4 h-4" />
                        Make Default
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 py-2 px-4 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 py-2 px-4 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
