import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import AdminDeleteProduct from './AdminDeleteProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);

  return (
    <div className='bg-white p-4 rounded'>
      <div className='w-40'>
        <div className='w-32 h-32 flex justify-center items-center'>
          <img src={data?.productImage[0]} className='mx-auto object-fill h-full' alt={data?.productName} />
        </div>
        <h1 className='text-ellipsis line-clamp-2 mt-2'>{data.productName}</h1>

        <p className='font-semibold mt-1'>
          {displayINRCurrency(data.sellingPrice)}
        </p>

        <div className='flex gap-2 mt-2'>
          {/* Edit Button */}
          <button
            onClick={() => setEditProduct(true)}
            className='bg-green-100 p-2 rounded-full hover:bg-green-600 hover:text-white'
            title="Edit Product"
          >
            <MdModeEditOutline />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setDeleteProduct(true)}
            className='bg-red-100 p-2 rounded-full hover:bg-red-600 hover:text-white'
            title="Delete Product"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <AdminDeleteProduct
          productId={data._id}
          onClose={() => setDeleteProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
