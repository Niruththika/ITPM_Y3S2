import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productImage: productData?.productImage || [],
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;
  //   setData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;
  
  //   // Prevent negative values for price and selling price
  //   if ((name === "price" || name === "sellingPrice") && value < 0) {
  //     toast.error("Price and Selling Price cannot be negative");
  //     return;
  //   }
  
  //   setData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
  
    // Prevent negative values for price and selling price
    if ((name === "price" || name === "sellingPrice") && value < 0) {
      toast.error("Price and Selling Price cannot be negative");
      return;
    }
  
    // Restrict brand name to only letters and spaces
    if (name === "brandName" && /[^a-zA-Z\s]/.test(value)) {
      toast.error("Brand Name cannot contain numbers or special characters");
      return;
    }
  
    setData((prev) => ({ ...prev, [name]: value }));
  };
  
  

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: [...newProductImage],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        update_data: {
          productName: data.productName,
          brandName: data.brandName,
          category: data.category,
          productImage: data.productImage,
          description: data.description,
          price: data.price,
          sellingPrice: data.sellingPrice,
        },
        _id: productData._id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Edit Product</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        {/* Form */}
        <form
          className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter product name"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
            Brand Name:
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="Enter brand name"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-3">
            Category:
          </label>
          <select
            required
            value={data.category}
            name="category"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option key={el.value + index} value={el.value}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage" className="mt-3">
            Product Image:
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {data?.productImage.length > 0 ? (
              data.productImage.map((el, index) => (
                <div key={el + index} className="relative group">
                  <img
                    src={el}
                    alt={`product-${index}`}
                    width={80}
                    height={80}
                    className="bg-slate-100 border cursor-pointer"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(el);
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                    onClick={() => handleDeleteProductImage(index)}
                  >
                    <MdDelete />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-600 text-xs">
                *Please upload product image
              </p>
            )}
          </div>

          <label htmlFor="price" className="mt-3">
            Price:
          </label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={data.price}
            name="price"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice" className="mt-3">
            Selling Price:
          </label>
          <input
            type="number"
            id="sellingPrice"
            placeholder="Enter selling price"
            value={data.sellingPrice}
            name="sellingPrice"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description" className="mt-3">
            Description:
          </label>
          <textarea
            className="h-28 bg-slate-100 border resize-none p-1"
            placeholder="Enter product description"
            rows={3}
            onChange={handleOnChange}
            name="description"
            value={data.description}
            required
          />

          <button className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Update Product
          </button>
        </form>
      </div>

      {/* Fullscreen image preview */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
