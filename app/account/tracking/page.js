'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  Navigation
} from 'lucide-react';

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get('order');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    'ORD-2024-001': {
      orderId: 'ORD-2024-001',
      trackingNumber: 'TRK123456789',
      courier: 'BlueDart',
      status: 'delivered',
      estimatedDelivery: '2024-01-18',
      actualDelivery: '2024-01-18 2:30 PM',
      currentLocation: 'Delivered',
      shipmentValue: 2499,
      weight: '0.8 kg',
      dimensions: '30 x 25 x 5 cm',
      timeline: [
        {
          status: 'Order Picked Up',
          location: 'Mumbai Warehouse',
          date: '2024-01-16 11:00 AM',
          description: 'Package picked up from seller',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Mumbai Sorting Facility',
          date: '2024-01-16 6:45 PM',
          description: 'Package processed at sorting facility',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Mumbai Hub',
          date: '2024-01-17 3:20 AM',
          description: 'Package departed from origin hub',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Delhi Sorting Facility',
          date: '2024-01-17 8:15 PM',
          description: 'Package arrived at destination facility',
          completed: true
        },
        {
          status: 'Out for Delivery',
          location: 'Delhi Local Office',
          date: '2024-01-18 9:00 AM',
          description: 'Package is out for delivery',
          completed: true
        },
        {
          status: 'Delivered',
          location: 'Customer Address',
          date: '2024-01-18 2:30 PM',
          description: 'Package delivered successfully to John Doe',
          completed: true
        }
      ],
      deliveryAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'New Delhi',
        pincode: '110001'
      },
      courierContact: {
        phone: '1800-123-4567',
        email: 'support@bluedart.com',
        website: 'https://bluedart.com'
      }
    },
    'ORD-2024-002': {
      orderId: 'ORD-2024-002',
      trackingNumber: 'TRK987654321',
      courier: 'Delhivery',
      status: 'in_transit',
      estimatedDelivery: '2024-01-20',
      currentLocation: 'Bangalore Hub',
      shipmentValue: 1899,
      weight: '0.5 kg',
      dimensions: '25 x 20 x 3 cm',
      timeline: [
        {
          status: 'Order Picked Up',
          location: 'Bangalore Warehouse',
          date: '2024-01-17 10:30 AM',
          description: 'Package picked up from seller',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Bangalore Sorting Facility',
          date: '2024-01-17 4:45 PM',
          description: 'Package processed at sorting facility',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Bangalore Hub',
          date: '2024-01-18 1:20 AM',
          description: 'Package at hub for further dispatch',
          completed: true
        },
        {
          status: 'In Transit',
          location: 'Chennai Hub',
          date: '2024-01-19 8:00 AM',
          description: 'Package in transit to destination',
          completed: false
        },
        {
          status: 'Out for Delivery',
          location: 'Chennai Local Office',
          date: 'Expected: 2024-01-20 9:00 AM',
          description: 'Package will be out for delivery',
          completed: false
        },
        {
          status: 'Delivered',
          location: 'Customer Address',
          date: 'Expected: 2024-01-20',
          description: 'Package will be delivered',
          completed: false
        }
      ],
      deliveryAddress: {
        name: 'Jane Smith',
        address: '456 Garden Street, Block A',
        city: 'Chennai',
        pincode: '600001'
      },
      courierContact: {
        phone: '1800-987-6543',
        email: 'care@delhivery.com',
        website: 'https://delhivery.com'
      }
    }
  };

  useEffect(() => {
    if (orderParam) {
      setTrackingNumber(orderParam);
      handleTrack(orderParam);
    }
  }, [orderParam]);

  const handleTrack = async (trackingId = trackingNumber) => {
    if (!trackingId.trim()) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const data = mockTrackingData[trackingId] || null;
      setTrackingData(data);
      setLoading(false);
    }, 1000);
  };

  const refreshTracking = () => {
    if (trackingData) {
      handleTrack(trackingData.orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'picked_up': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Get real-time updates on your shipment status</p>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Order ID or Tracking Number
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., ORD-2024-001 or TRK123456789"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Results */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Fetching tracking information...</p>
        </div>
      )}

      {!loading && trackingData && (
        <div className="space-y-8">
          {/* Status Overview */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order #{trackingData.orderId}</h2>
                  <p className="text-gray-600">Tracking: {trackingData.trackingNumber}</p>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(trackingData.status)}`}>
                    <CheckCircle className="h-4 w-4" />
                    {trackingData.status === 'delivered' ? 'Delivered' : 
                     trackingData.status === 'in_transit' ? 'In Transit' : 'Processing'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {trackingData.status === 'delivered' ? 'Delivered on' : 'Expected delivery'}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {trackingData.actualDelivery || trackingData.estimatedDelivery}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Current location: {trackingData.currentLocation}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={refreshTracking}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </button>
              
              <div className="text-sm text-gray-600">
                Courier: <span className="font-medium">{trackingData.courier}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Shipment Timeline
                </h3>
                
                <div className="space-y-6">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        {index < trackingData.timeline.length - 1 && (
                          <div className={`w-px h-12 ${event.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {event.status}
                          </h4>
                          <span className="text-sm text-gray-500">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </h4>
                <div className="text-sm space-y-1 text-gray-600">
                  <div className="font-medium text-gray-900">{trackingData.deliveryAddress.name}</div>
                  <div>{trackingData.deliveryAddress.address}</div>
                  <div>{trackingData.deliveryAddress.city} - {trackingData.deliveryAddress.pincode}</div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium">₹{trackingData.shipmentValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{trackingData.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium">{trackingData.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Courier Contact */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Courier Contact</h4>
                <div className="space-y-3">
                  <a
                    href={`tel:${trackingData.courierContact.phone}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{trackingData.courierContact.phone}</span>
                  </a>
                  
                  <a
                    href={`mailto:${trackingData.courierContact.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">{trackingData.courierContact.email}</span>
                  </a>
                  
                  <a
                    href={trackingData.courierContact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">Visit {trackingData.courier} Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && trackingNumber && !trackingData && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information found</h3>
          <p className="text-gray-500 mb-6">
            Please check your order ID or tracking number and try again.
          </p>
          <p className="text-sm text-gray-400">
            Need help? Try searching with: ORD-2024-001 or ORD-2024-002
          </p>
        </div>
      )}
    </div>
  );
}
