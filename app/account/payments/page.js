'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Star,
  Shield,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4567',
      expiryMonth: '12',
      expiryYear: '2025',
      holderName: 'John Doe',
      isDefault: true,
      nickname: 'Primary Card'
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8901',
      expiryMonth: '08',
      expiryYear: '2026',
      holderName: 'John Doe',
      isDefault: false,
      nickname: 'Backup Card'
    },
    {
      id: 3,
      type: 'amex',
      last4: '2345',
      expiryMonth: '03',
      expiryYear: '2024',
      holderName: 'John Doe',
      isDefault: false,
      nickname: 'Business Card'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    nickname: '',
    isDefault: false
  });

  const cardBrands = {
    visa: {
      name: 'Visa',
      color: 'bg-blue-600',
      textColor: 'text-white'
    },
    mastercard: {
      name: 'Mastercard',
      color: 'bg-red-600',
      textColor: 'text-white'
    },
    amex: {
      name: 'American Express',
      color: 'bg-green-600',
      textColor: 'text-white'
    },
    discover: {
      name: 'Discover',
      color: 'bg-orange-600',
      textColor: 'text-white'
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.match(/^4/)) return 'visa';
    if (cleanNumber.match(/^5[1-5]/) || cleanNumber.match(/^2[2-7]/)) return 'mastercard';
    if (cleanNumber.match(/^3[47]/)) return 'amex';
    if (cleanNumber.match(/^6/)) return 'discover';
    return 'visa';
  };

  const openAddModal = () => {
    setEditingCard(null);
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
      nickname: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditingCard(card);
    setFormData({
      cardNumber: `**** **** **** ${card.last4}`,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvv: '',
      holderName: card.holderName,
      nickname: card.nickname,
      isDefault: card.isDefault
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCard) {
      // Update existing card
      setPaymentMethods(prev => prev.map(card => 
        card.id === editingCard.id 
          ? { 
              ...card, 
              expiryMonth: formData.expiryMonth,
              expiryYear: formData.expiryYear,
              holderName: formData.holderName,
              nickname: formData.nickname,
              isDefault: formData.isDefault
            } 
          : card
      ));
    } else {
      // Add new card
      const newCard = {
        id: Date.now(),
        type: detectCardType(formData.cardNumber),
        last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        holderName: formData.holderName,
        nickname: formData.nickname,
        isDefault: formData.isDefault
      };
      setPaymentMethods(prev => [...prev, newCard]);
    }
    
    // If this is set as default, remove default from others
    if (formData.isDefault) {
      setPaymentMethods(prev => prev.map(card => ({
        ...card,
        isDefault: card.id === (editingCard?.id || Date.now()) ? true : false
      })));
    }
    
    closeModal();
  };

  const handleDelete = (cardId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
    }
  };

  const setAsDefault = (cardId) => {
    setPaymentMethods(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const isCardExpired = (month, year) => {
    const now = new Date();
    const expiry = new Date(parseInt(year), parseInt(month) - 1);
    return expiry < now;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Payment Methods</h1>
            <p className="text-gray-600">Manage your saved payment methods for faster checkout</p>
          </div>
          
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Card
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Secure Payment Processing</h3>
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and stored securely. We never store your complete card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">No payment methods saved</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add your payment methods to make checkout faster and more convenient.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paymentMethods.map(card => {
            const brand = cardBrands[card.type] || cardBrands.visa;
            const expired = isCardExpired(card.expiryMonth, card.expiryYear);
            
            return (
              <div key={card.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Card Visual */}
                <div className={`${brand.color} ${brand.textColor} p-6 relative`}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="text-sm opacity-75 mb-1">{card.nickname}</div>
                      <div className="text-lg font-semibold">{brand.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault && (
                        <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                          Default
                        </div>
                      )}
                      {expired && (
                        <div className="bg-red-500 px-2 py-1 rounded-full text-xs font-medium">
                          Expired
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-xl font-mono tracking-wider">
                      •••• •••• •••• {card.last4}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-75">CARDHOLDER</div>
                        <div className="font-medium">{card.holderName}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-75">EXPIRES</div>
                        <div className="font-medium">{card.expiryMonth}/{card.expiryYear}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4">
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <button
                        onClick={() => setAsDefault(card.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Star className="h-4 w-4" />
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(card)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCard ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setFormData(prev => ({ ...prev, cardNumber: formatted }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={19}
                  disabled={editingCard}
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">MM</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">YYYY</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="holderName"
                  value={formData.holderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Nickname (Optional)</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="e.g., Primary Card, Work Card"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Set as Default */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  {editingCard ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
