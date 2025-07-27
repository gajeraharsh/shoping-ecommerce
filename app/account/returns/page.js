'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  Package, 
  Search, 
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MessageCircle,
  ArrowRight,
  FileText,
  Truck
} from 'lucide-react';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('returns');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock returns data
  const returns = [
    {
      id: 'RET-001',
      orderId: 'ORD-2024-001',
      status: 'approved',
      type: 'return',
      reason: 'Size too small',
      requestDate: '2024-01-20',
      expectedRefund: 1899,
      refundMethod: 'Original Payment Method',
      items: [
        {
          id: 1,
          name: 'Floral Summer Dress',
          image: '/api/placeholder/100/100',
          price: 1899,
          size: 'M',
          color: 'Blue',
          quantity: 1
        }
      ],
      timeline: [
        { status: 'Request Submitted', date: '2024-01-20 10:30 AM', completed: true },
        { status: 'Under Review', date: '2024-01-20 2:15 PM', completed: true },
        { status: 'Approved', date: '2024-01-21 11:00 AM', completed: true },
        { status: 'Pickup Scheduled', date: '2024-01-22 9:00 AM', completed: false },
        { status: 'Item Received', date: 'Pending', completed: false },
        { status: 'Refund Processed', date: 'Pending', completed: false }
      ]
    },
    {
      id: 'EXC-001',
      orderId: 'ORD-2024-002',
      status: 'processing',
      type: 'exchange',
      reason: 'Color not as expected',
      requestDate: '2024-01-18',
      items: [
        {
          id: 2,
          name: 'Designer Kurta Set',
          image: '/api/placeholder/100/100',
          price: 2499,
          size: 'L',
          color: 'Navy',
          quantity: 1
        }
      ],
      exchangeItem: {
        name: 'Designer Kurta Set',
        size: 'L',
        color: 'Black'
      },
      timeline: [
        { status: 'Request Submitted', date: '2024-01-18 3:45 PM', completed: true },
        { status: 'Under Review', date: '2024-01-19 10:20 AM', completed: true },
        { status: 'Approved', date: 'Pending', completed: false },
        { status: 'Pickup Scheduled', date: 'Pending', completed: false },
        { status: 'Exchange Processed', date: 'Pending', completed: false }
      ]
    },
    {
      id: 'RET-002',
      orderId: 'ORD-2024-003',
      status: 'rejected',
      type: 'return',
      reason: 'Defective item',
      requestDate: '2024-01-15',
      rejectionReason: 'Item shows signs of use beyond return policy',
      items: [
        {
          id: 3,
          name: 'Cotton Casual Shirt',
          image: '/api/placeholder/100/100',
          price: 799,
          size: 'M',
          color: 'White',
          quantity: 1
        }
      ],
      timeline: [
        { status: 'Request Submitted', date: '2024-01-15 4:20 PM', completed: true },
        { status: 'Under Review', date: '2024-01-16 9:30 AM', completed: true },
        { status: 'Rejected', date: '2024-01-17 1:15 PM', completed: true }
      ]
    }
  ];

  // Mock eligible orders for new returns
  const eligibleOrders = [
    {
      id: 'ORD-2024-004',
      date: '2024-01-22',
      status: 'delivered',
      items: [
        {
          id: 4,
          name: 'Premium Silk Saree',
          image: '/api/placeholder/100/100',
          price: 4999,
          size: 'Free Size',
          color: 'Gold',
          quantity: 1,
          eligible: true,
          eligibleUntil: '2024-02-05'
        }
      ]
    },
    {
      id: 'ORD-2024-005',
      date: '2024-01-25',
      status: 'delivered',
      items: [
        {
          id: 5,
          name: 'Denim Jacket',
          image: '/api/placeholder/100/100',
          price: 1599,
          size: 'L',
          color: 'Blue',
          quantity: 1,
          eligible: true,
          eligibleUntil: '2024-02-08'
        },
        {
          id: 6,
          name: 'Casual T-Shirt',
          image: '/api/placeholder/100/100',
          price: 499,
          size: 'M',
          color: 'Black',
          quantity: 2,
          eligible: false,
          eligibleUntil: null,
          reason: 'Return period expired'
        }
      ]
    }
  ];

  const statusConfig = {
    processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
  };

  const filteredReturns = returns.filter(returnItem => {
    if (filterStatus !== 'all' && returnItem.status !== filterStatus) return false;
    if (searchQuery && !returnItem.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !returnItem.orderId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusIcon = (status) => {
    const config = statusConfig[status] || statusConfig.processing;
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Returns & Exchanges</h1>
        <p className="text-gray-600">Manage your return and exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('returns')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'returns'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Returns & Exchanges
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Start New Return
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by return ID or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Returns List */}
          <div className="space-y-6">
            {filteredReturns.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                <RotateCcw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No returns found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t made any return requests yet'}
                </p>
              </div>
            ) : (
              filteredReturns.map(returnItem => {
                const statusConfig = statusConfig[returnItem.status] || statusConfig.processing;
                return (
                  <div key={returnItem.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500">
                            {returnItem.type === 'return' ? 'Return' : 'Exchange'} #{returnItem.id}
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            {getStatusIcon(returnItem.status)}
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(returnItem.requestDate).toLocaleDateString()}
                          </div>
                          <div>Order #{returnItem.orderId}</div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={returnItem.items[0].image}
                          alt={returnItem.items[0].name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{returnItem.items[0].name}</h4>
                          <div className="text-sm text-gray-500">
                            {returnItem.items[0].size} | {returnItem.items[0].color} | Qty: {returnItem.items[0].quantity}
                          </div>
                          <div className="text-sm font-medium text-gray-900">₹{returnItem.items[0].price}</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 mb-1">Reason: {returnItem.reason}</div>
                          {returnItem.rejectionReason && (
                            <div className="text-red-600">Rejection Reason: {returnItem.rejectionReason}</div>
                          )}
                          {returnItem.exchangeItem && (
                            <div className="text-blue-600">
                              Exchange for: {returnItem.exchangeItem.size} | {returnItem.exchangeItem.color}
                            </div>
                          )}
                          {returnItem.expectedRefund && (
                            <div className="text-green-600">Expected Refund: ₹{returnItem.expectedRefund}</div>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="border-t pt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Status Timeline</h5>
                        <div className="space-y-2">
                          {returnItem.timeline.slice(0, 3).map((event, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <div className={`w-2 h-2 rounded-full ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className={event.completed ? 'text-gray-900' : 'text-gray-500'}>
                                {event.status}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">{event.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex gap-3">
                        <Link
                          href={`/account/returns/${returnItem.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                        
                        {returnItem.status === 'processing' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                            <XCircle className="h-4 w-4" />
                            Cancel Request
                          </button>
                        )}
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          <MessageCircle className="h-4 w-4" />
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'new' && (
        <div className="space-y-6">
          {/* Return Policy Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Return Policy Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Return Window</h4>
                <ul className="space-y-1">
                  <li>• 14 days from delivery date</li>
                  <li>• Items must be in original condition</li>
                  <li>• Tags and packaging intact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Exchange Policy</h4>
                <ul className="space-y-1">
                  <li>• Size/color exchanges allowed</li>
                  <li>• Subject to stock availability</li>
                  <li>• One exchange per item</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Eligible Orders */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Eligible Orders for Return/Exchange</h2>
            
            {eligibleOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Delivered on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="text-sm text-gray-500">
                          {item.size} | {item.color} | Qty: {item.quantity}
                        </div>
                        <div className="text-sm font-medium text-gray-900">₹{item.price}</div>
                      </div>
                      
                      <div className="text-right">
                        {item.eligible ? (
                          <div>
                            <div className="text-sm text-green-600 font-medium mb-2">
                              Eligible until {new Date(item.eligibleUntil).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                Return Item
                              </button>
                              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                Exchange Item
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600">
                            {item.reason || 'Not eligible for return'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {eligibleOrders.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eligible orders</h3>
                <p className="text-gray-500 mb-6">
                  You don't have any orders eligible for return or exchange at the moment.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Shop Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
