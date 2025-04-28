import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = localStorage.getItem('jwtToken');

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      console.log('responseData', responseData);

      if (responseData.success && Array.isArray(responseData.data)) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setData([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const modifyQty = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id, quantity: newQty }),
      });
      const responseData = await response.json();
      if (responseData.success) fetchData();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const totalQty = data.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
  const totalPrice = data.reduce((prev, curr) => {
    // Now we can safely read from curr.productId
    console.log('curr:', curr);
    
    const sellingPrice = curr.productId?.sellingPrice || 0;
    return prev + (curr.quantity || 0) * sellingPrice;
  }, 0);

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        <div className="w-full max-w-3xl">
          {loading ? (
            [1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
              />
            ))
          ) : (
            data.map((cartItem) => (
                
              <div
                key={cartItem._id}
                className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-slate-200">
                  {cartItem.productId?.productImage?.length > 0 && (
                    <img
                      src={cartItem.productId.productImage[0]}
                      className="w-full h-full object-scale-down mix-blend-multiply"
                      alt="Product"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="px-4 py-2 relative">
                  <div
                    className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                    onClick={() => deleteCartProduct(cartItem._id)}
                  >
                    <MdDelete />
                  </div>
                  <h2 className="text-lg lg:text-xl">
                    {cartItem.productId?.productName || 'Unknown Product'}
                  </h2>
                  <p className="capitalize text-slate-500">
                    {cartItem.productId?.category || 'No Category'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-red-600 font-medium text-lg">
                      {displayINRCurrency(cartItem.productId?.sellingPrice || 0)}
                    </p>
                    <p className="text-slate-600 font-semibold text-lg">
                      {displayINRCurrency(
                        (cartItem.productId?.sellingPrice || 0) *
                          (cartItem.quantity || 0)
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                      onClick={() =>
                        modifyQty(cartItem._id, (cartItem.quantity || 1) - 1)
                      }
                    >
                      -
                    </button>
                    <span>{cartItem.quantity || 1}</span>
                    <button
                      className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                      onClick={() =>
                        modifyQty(cartItem._id, (cartItem.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Section */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse" />
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>
              <button className="bg-blue-600 p-2 text-white w-full mt-2">
                Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
