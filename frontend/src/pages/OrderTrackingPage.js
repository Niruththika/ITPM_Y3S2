import React, { useState } from 'react';
import OrderStatusView from '../components/OrderStatusView';
import axios from 'axios';

const OrderTrackingPage = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [error, setError] = useState(null);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!orderIdInput.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }
    
    try {
      // Verify if order exists before showing the tracking page
      await axios.get(`${apiUrl}/api/orders/${orderIdInput}`);
      setCurrentOrderId(orderIdInput);
      setError(null);
    } catch (err) {
      setError('Order not found. Please check your Order ID and try again.');
      setCurrentOrderId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Enter your order ID to track your package</p>
      </div>
      
      <div className="max-w-xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-red-500 text-white px-6 py-3 rounded-r-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Track
          </button>
        </form>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
      
      {currentOrderId && (
        <OrderStatusView orderId={currentOrderId} />
      )}
      
      {!currentOrderId && !error && (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-medium text-gray-700 mb-2">No Order Selected</h2>
          <p className="text-gray-500">Enter your order ID above to track your package</p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;