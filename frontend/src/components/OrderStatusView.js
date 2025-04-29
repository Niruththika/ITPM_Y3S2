import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderStatusView = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/orders/${id}`);
      setOrderData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Define statuses and their corresponding steps in order process
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'InProgress', 'Delivered', 'Cancled'];
  
  const getStatusIndex = (status) => {
    // Fix for 'Cancelled' spelling variations
    if (status?.toLowerCase() === 'cancled' || status?.toLowerCase() === 'canceled') {
      return -1; // Special case for cancelled orders
    }
    
    const index = orderStatuses.findIndex(s => 
      s.toLowerCase() === status?.toLowerCase()
    );
    return index >= 0 ? index : 0; // Default to 0 if not found
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#38A169'; // Green
      case 'pending':
        return '#ECC94B'; // Yellow
      case 'processing':
        return '#4299E1'; // Blue
      case 'shipped':
        return '#9F7AEA'; // Purple
      case 'inprogress':
        return '#ED8936'; // Orange
      case 'cancled':
      case 'canceled':
        return '#E53E3E'; // Red
      default:
        return '#A0AEC0'; // Gray
    }
  };

  if (loading) return <div className="text-center p-8">Loading order details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!orderData) return <div className="text-center p-8">Please select an order to view details.</div>;

  const currentStatusIndex = getStatusIndex(orderData.status);
  const isCancelled = orderData.status?.toLowerCase() === 'cancled' || orderData.status?.toLowerCase() === 'canceled';

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
        <div className="text-sm text-gray-500">
          Order ID: <span className="font-semibold">{orderData.id}</span>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="bg-gray-50 p-4 rounded-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">Customer</div>
          <div className="font-medium">{orderData.name || 'N/A'}</div>
          <div className="text-sm">{orderData.email || 'N/A'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Current Location</div>
          <div className="font-medium">{orderData.currentLocation || 'N/A'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Destination</div>
          <div className="font-medium">{orderData.arrival || 'N/A'}</div>
        </div>
      </div>

      {/* Order Status Timeline */}
      {isCancelled ? (
        <div className="relative mb-8">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 z-0"></div>
          <div className="relative z-10 flex items-center justify-center">
            <div 
              className="rounded-full h-14 w-14 flex items-center justify-center" 
              style={{ backgroundColor: getStatusColor(orderData.status) }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="font-bold text-lg">Order Cancelled</div>
            <p className="text-gray-600">This order has been cancelled and will not be processed further.</p>
          </div>
        </div>
      ) : (
        <div className="relative mb-8">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          <div className="relative z-10 flex justify-between">
            {orderStatuses.slice(0, 5).map((status, index) => { // Exclude 'Cancled' from timeline
              const isActive = index <= currentStatusIndex;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`rounded-full h-10 w-10 flex items-center justify-center
                      ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}
                  >
                    {isActive && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Status Card */}
      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <div className="flex items-center">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: getStatusColor(orderData.status) }}
          >
            {orderData.status?.toLowerCase() === 'delivered' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {(orderData.status?.toLowerCase() === 'pending' || orderData.status?.toLowerCase() === 'processing') && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {orderData.status?.toLowerCase() === 'shipped' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {orderData.status?.toLowerCase() === 'inprogress' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
            {(orderData.status?.toLowerCase() === 'cancled' || orderData.status?.toLowerCase() === 'canceled') && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">Status: {orderData.status}</h3>
            <p className="text-gray-600">
              {orderData.status?.toLowerCase() === 'pending' && 'Your order has been received and is pending processing.'}
              {orderData.status?.toLowerCase() === 'processing' && 'Your order is being processed and prepared for shipment.'}
              {orderData.status?.toLowerCase() === 'shipped' && 'Your order has been shipped and is on its way to you.'}
              {orderData.status?.toLowerCase() === 'inprogress' && 'Your order is in transit and moving towards its destination.'}
              {orderData.status?.toLowerCase() === 'delivered' && 'Your order has been delivered successfully to its destination.'}
              {(orderData.status?.toLowerCase() === 'cancled' || orderData.status?.toLowerCase() === 'canceled') && 'This order has been cancelled.'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Tracking Map (Simplified visual) */}
      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <h3 className="text-lg font-medium mb-4">Order Journey</h3>
        <div className="h-48 relative bg-blue-50 rounded-md border border-gray-200">
          {/* Simplified tracking path */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-300 transform -translate-y-1/2"></div>
          
          {/* Origin point */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="mt-2 text-xs">Origin</div>
          </div>
          
          {/* Current location indicator */}
          {!isCancelled && (
            <div 
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ 
                left: `${Math.min(85, Math.max(15, (currentStatusIndex / 4) * 100))}%` 
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="mt-2 text-xs font-medium">Current</div>
            </div>
          )}
          
          {/* Destination point */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="mt-2 text-xs">Destination</div>
          </div>
          
          {/* Locations label */}
          <div className="absolute bottom-2 left-4 text-xs text-gray-500">
            {orderData.currentLocation || 'Origin'}
          </div>
          <div className="absolute bottom-2 right-4 text-xs text-gray-500">
            {orderData.arrival || 'Destination'}
          </div>
        </div>
      </div>

      {/* Estimated Delivery Section (if not cancelled or delivered) */}
      {!isCancelled && orderData.status?.toLowerCase() !== 'delivered' && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Estimated Delivery</h3>
              <p className="text-gray-600">Your package is on track for delivery.</p>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {/* Mock delivery date - could be replaced with actual data */}
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusView;