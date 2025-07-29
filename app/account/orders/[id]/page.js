'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Download,
  Star,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  Share2
} from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  // Mock order details (in real app, fetch based on orderId)
  const orderDetails = {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 2499,
    subtotal: 2100,
    shipping: 99,
    tax: 300,
    discount: 0,
    couponCode: '',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    trackingNumber: 'TRK123456789',
    deliveryDate: '2024-01-18',
    items: [
      {
        id: 1,
        name: 'Floral Summer Dress',
        description: 'Beautiful floral print summer dress made with premium cotton fabric',
        image: '/api/placeholder/400/400',
        price: 1899,
        originalPrice: 2299,
        quantity: 1,
        size: 'M',
        color: 'Blue',
        sku: 'FSD-001-M-BL',
        canReturn: true,
        canReview: true
      },
      {
        id: 2,
        name: 'Cotton Casual Shirt',
        description: 'Comfortable cotton casual shirt perfect for everyday wear',
        image: '/api/placeholder/400/400',
        price: 600,
        originalPrice: 799,
        quantity: 1,
        size: 'L',
        color: 'White',
        sku: 'CCS-002-L-WH',
        canReturn: true,
        canReview: true
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    billingAddress: {
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-15 10:30 AM',
        description: 'Your order has been confirmed',
        completed: true
      },
      {
        status: 'Payment Confirmed',
        date: '2024-01-15 10:32 AM',
        description: 'Payment has been processed successfully',
        completed: true
      },
      {
        status: 'Order Prepared',
        date: '2024-01-16 2:15 PM',
        description: 'Your items have been picked and packed',
        completed: true
      },
      {
        status: 'Shipped',
        date: '2024-01-16 6:45 PM',
        description: 'Your order is on the way',
        completed: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-18 9:00 AM',
        description: 'Your order is out for delivery',
        completed: true
      },
      {
        status: 'Delivered',
        date: '2024-01-18 2:30 PM',
        description: 'Order delivered successfully',
        completed: true
      }
    ]
  };

  const statusConfig = {
    processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    shipped: { color: 'bg-blue-100 text-blue-800', icon: Truck },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const currentStatus = statusConfig[orderDetails.status] || statusConfig.processing;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Order #{orderDetails.id}
            </h1>
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-600">
              <span>Placed on {new Date(orderDetails.date).toLocaleDateString()}</span>
              <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full font-medium ${currentStatus.color} w-fit`}>
                <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Download Invoice</span>
              <span className="xs:hidden">Invoice</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base lg:text-lg">Order Items ({orderDetails.items.length})</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              {orderDetails.items.map(item => (
                <div key={item.id} className="flex flex-col xs:flex-row gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 border border-gray-100 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 xs:w-24 xs:h-24 object-cover rounded-lg flex-shrink-0 mx-auto xs:mx-0"
                  />

                  <div className="flex-1 space-y-2 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 hidden sm:block">{item.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                      <span>Qty: {item.quantity}</span>
                      <span className="hidden sm:inline">SKU: {item.sku}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">₹{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2">
                      {item.canReview && (
                        <button className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-xs sm:text-sm">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Write Review</span>
                          <span className="xs:hidden">Review</span>
                        </button>
                      )}
                      {item.canReturn && (
                        <button className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors text-xs sm:text-sm">
                          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Return Item</span>
                          <span className="xs:hidden">Return</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base lg:text-lg">Order Timeline</span>
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {orderDetails.timeline.map((event, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {event.completed ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    {index < orderDetails.timeline.length - 1 && (
                      <div className={`w-px h-8 sm:h-12 ${event.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                    )}
                  </div>

                  <div className="flex-1 pb-6 sm:pb-8 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                      <h3 className={`text-sm sm:text-base font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'} line-clamp-1`}>
                        {event.status}
                      </h3>
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{event.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{orderDetails.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{orderDetails.tax}</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{orderDetails.discount}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Payment Details</span>
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="text-green-600 font-medium">{orderDetails.paymentStatus}</span>
              </div>
              {orderDetails.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number</span>
                  <span className="font-medium text-blue-600">{orderDetails.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Shipping Address</span>
            </h3>
            
            <div className="text-xs sm:text-sm space-y-1 text-gray-600">
              <div className="font-medium text-gray-900">{orderDetails.shippingAddress.name}</div>
              <div className="line-clamp-2">{orderDetails.shippingAddress.address}</div>
              <div>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}</div>
              <div>{orderDetails.shippingAddress.country}</div>
              <div className="flex items-center gap-2 pt-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="break-all">{orderDetails.shippingAddress.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="break-all">{orderDetails.shippingAddress.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>

            <div className="space-y-3">
              <Link
                href={`/account/tracking?order=${orderDetails.id}`}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
              >
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium">Track Your Order</span>
              </Link>

              <button className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-sm sm:text-base">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium">Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
