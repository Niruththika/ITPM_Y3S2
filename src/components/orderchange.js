import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const OrderChange = ({ 
  product, 
  onClose, 
  customerId, 
  customerEmail,
  refreshOrders = () => {}
}) => {
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);

  const colorOptions = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!color) {
      toast.error('Please select a color');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(SummaryApi.addOrder.url, {
        method: SummaryApi.addOrder.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId,
          customerEmail,
          productId: product._id,
          productName: product.productName,
          totalPrice: product.sellingPrice * quantity,
          color,
          quantity,
          paymentMethod
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order placed successfully!');
        refreshOrders();
        onClose();
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Additional Product Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Product</label>
            <div className="p-3 border rounded bg-gray-50">
              {product?.productName}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price</label>
            <div className="p-3 border rounded bg-gray-50">
              ₹{(product?.sellingPrice * quantity).toFixed(2)}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <div 
                  key={option}
                  onClick={() => setColor(option)}
                  className={`p-2 border rounded cursor-pointer text-center
                    ${color === option ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-3 py-1 rounded-l"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="border-t border-b p-1 text-center w-16"
                min="1"
              />
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-3 py-1 rounded-r"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mr-2"
                />
                Online Payment
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="mr-2"
                />
                Cash Payment
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderChange;