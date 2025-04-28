import React from 'react';
import { CgClose } from "react-icons/cg";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminDeleteProduct = ({ onClose, productId, fetchdata }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ _id: productId })
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        fetchdata();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='fixed w-full h-full bg-black bg-opacity-30 top-0 left-0 flex justify-center items-center'>
      <div className='bg-white p-5 rounded max-w-sm w-full text-center'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Delete Product</h2>
          <button onClick={onClose} className='text-2xl text-red-600'><CgClose /></button>
        </div>
        <p className='mt-4'>Are you sure you want to delete this product?</p>
        <div className='flex justify-between mt-6'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-200 rounded'>Cancel</button>
          <button onClick={handleDelete} className='px-4 py-2 bg-red-600 text-white rounded'>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteProduct;
