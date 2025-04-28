import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import OrderChange from '../components/orderchange';
import displayINRCurrency from '../helpers/displayCurrency';

const OrderChangePage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderChange, setShowOrderChange] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  // Fetch product details
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          productId: params?.id
        })
      });
      
      const dataResponse = await response.json();
      
      if (dataResponse.success) {
        setProduct(dataResponse.data);
      } else {
        toast.error('Failed to load product details');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Something went wrong. Please try again.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's orders for this product
  const fetchUserOrders = async () => {
    if (!user || !params?.id) return;
    
    setOrderLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${SummaryApi.getUserOrders.url}/${params.id}`, {
        method: SummaryApi.getUserOrders.method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params?.id]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, params?.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-slate-200 rounded mb-4"></div>
          <div className="h-12 bg-slate-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product Order Options</h2>
      
      {product && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <img 
                src={product.productImage?.[0]} 
                alt={product.productName} 
                className="w-full h-auto object-contain bg-slate-200 p-2 rounded"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold">{product.productName}</h3>
              <p className="text-sm text-gray-500">{product.brandName}</p>
              <p className="mt-2">{product.description}</p>
              
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xl font-semibold text-red-600">{displayINRCurrency(product.sellingPrice)}</span>
                <span className="text-gray-500 line-through">{displayINRCurrency(product.price)}</span>
              </div>
              
              <button 
                onClick={() => setShowOrderChange(true)}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Add More Details & Order
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Order History Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Your Previous Orders</h3>
        
        {orderLoading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-slate-200 rounded mb-2"></div>
            <div className="h-12 bg-slate-200 rounded mb-2"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Order Date</th>
                  <th className="border p-2 text-left">Color</th>
                  <th className="border p-2 text-left">Quantity</th>
                  <th className="border p-2 text-left">Payment Method</th>
                  <th className="border p-2 text-left">Total Price</th>
                  <th className="border p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="border p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{order.color}</td>
                    <td className="border p-2">{order.quantity}</td>
                    <td className="border p-2">
                      {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}
                    </td>
                    <td className="border p-2">{displayINRCurrency(order.totalPrice)}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">You haven't ordered this product yet.</p>
        )}
      </div>
      
      {showOrderChange && product && (
        <OrderChange 
          product={product}
          onClose={() => setShowOrderChange(false)}
          customerId={user?._id}
          customerEmail={user?.email}
          refreshOrders={fetchUserOrders}
        />
      )}
    </div>
  );
};

export default OrderChangePage;