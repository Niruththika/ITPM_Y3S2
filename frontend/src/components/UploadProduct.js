// import React, { useState } from 'react'
// import { CgClose } from "react-icons/cg";
// import productCategory from '../helpers/productCategory';
// import { FaCloudUploadAlt } from "react-icons/fa";
// import uploadImage from '../helpers/uploadImage';
// import DisplayImage from './DisplayImage';
// import { MdDelete } from "react-icons/md";
// import SummaryApi from '../common';
// import {toast} from 'react-toastify'

// const UploadProduct = ({
//     onClose,
//     fetchData
// }) => {
//   const [data,setData] = useState({
//     productName : "",
//     brandName : "",
//     category : "",
//     productImage : [],
//     description : "",
//     price : "",
//     sellingPrice : ""
//   })
//   const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
//   const [fullScreenImage,setFullScreenImage] = useState("")
  

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
  
//     // Prevent negative values for price and selling price
//     if ((name === "price" || name === "sellingPrice") && value < 0) {
//       alert("Price cannot be negative!");
//       return; // Stop the update
//     }
  
//     // Prevent numbers and special characters in brand name
//     if (name === "brandName" && /[^a-zA-Z\s]/.test(value)) {
//       alert("Brand Name cannot contain numbers or special characters!");
//       return; // Stop the update
//     }
  
//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
  
  
  

//   const handleUploadProduct = (event) => {
//     const file = event.target.files[0];
  
//     if (!file) return;
  
//     // 1MB size limit
//     if (file.size > 1 * 1024 * 1024) { 
//       alert("File size must be less than 1MB.");
//       return;
//     }
  
//     // Check file type (Only images allowed)
//     if (!file.type.startsWith("image/")) {
//       alert("Only image files are allowed. Videos are not supported.");
//       return;
//     }
  
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setData((prevData) => ({
//         ...prevData,
//         productImage: [...(prevData.productImage || []), reader.result],
//       }));
//     };
  
//     reader.readAsDataURL(file);
//   };
  

//   const handleDeleteProductImage = async(index)=>{
//     console.log("image index",index)
    
//     const newProductImage = [...data.productImage]
//     newProductImage.splice(index,1)

//     setData((preve)=>{
//       return{
//         ...preve,
//         productImage : [...newProductImage]
//       }
//     })
    
//   }


//   {/**upload product */}
//   const handleSubmit = async(e) =>{
//     e.preventDefault()
    
//     const response = await fetch(SummaryApi.uploadProduct.url,{
//       method : SummaryApi.uploadProduct.method,
//       credentials : 'include',
//       headers : {
//         "content-type" : "application/json"
//       },
//       body : JSON.stringify(data)
//     })

//     const responseData = await response.json()

//     if(responseData.success){
//         toast.success(responseData?.message)
//         onClose()
//         fetchData()
//     }


//     if(responseData.error){
//       toast.error(responseData?.message)
//     }
  

//   }

//   return (
//     <div className='fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
//        <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

//             <div className='flex justify-between items-center pb-3'>
//                 <h2 className='font-bold text-lg'>Upload Product</h2>
//                 <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
//                     <CgClose/>
//                 </div>
//             </div>

//           <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
//             <label htmlFor='productName'>Product Name :</label>
//             <input 
//               type='text' 
//               id='productName' 
//               placeholder='enter product name' 
//               name='productName'
//               value={data.productName} 
//               onChange={handleOnChange}
//               className='p-2 bg-slate-100 border rounded'
//               required
//             />


// <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
// <input 
//   type='text' 
//   id='brandName' 
//   placeholder='Enter brand name' 
//   value={data.brandName} 
//   name='brandName'
//   onChange={handleOnChange}
//   className='p-2 bg-slate-100 border rounded'
//   required
//   pattern="^[A-Za-z\s]+$"  // Prevents numbers and special characters
//   title="Brand Name cannot contain numbers or special characters"
// />


//               <label htmlFor='category' className='mt-3'>Category :</label>
//               <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
//                   <option value={""}>Select Category</option>
//                   {
//                     productCategory.map((el,index)=>{
//                       return(
//                         <option value={el.value} key={el.value+index}>{el.label}</option>
//                       )
//                     })
//                   }
//               </select>

//               <label htmlFor='productImage' className='mt-3'>Product Image :</label>
//               <label htmlFor='uploadImageInput'>
//               <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
//                         <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
//                           <span className='text-4xl'><FaCloudUploadAlt/></span>
//                           <p className='text-sm'>Upload Product Image</p>
//                           <input type='file' id='uploadImageInput'  className='hidden' onChange={handleUploadProduct}/>
//                         </div>
//               </div>
//               </label> 
//               <div>
//                   {
//                     data?.productImage[0] ? (
//                         <div className='flex items-center gap-2'>
//                             {
//                               data.productImage.map((el,index)=>{
//                                 return(
//                                   <div className='relative group'>
//                                       <img 
//                                         src={el} 
//                                         alt={el} 
//                                         width={80} 
//                                         height={80}  
//                                         className='bg-slate-100 border cursor-pointer'  
//                                         onClick={()=>{
//                                           setOpenFullScreenImage(true)
//                                           setFullScreenImage(el)
//                                         }}/>

//                                         <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={()=>handleDeleteProductImage(index)}>
//                                           <MdDelete/>  
//                                         </div>
//                                   </div>
                                  
//                                 )
//                               })
//                             }
//                         </div>
//                     ) : (
//                       <p className='text-red-600 text-xs'>*Please upload product image</p>
//                     )
//                   }
                  
//               </div>


// {/* //prevent from minus input */}
//               <input 
//   type='number' 
//   id='price' 
//   placeholder='Enter price' 
//   value={data.price} 
//   name='price'
//   onChange={handleOnChange}
//   className='p-2 bg-slate-100 border rounded'
//   required
//   min="0"  // Prevents negative input
// />



// <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
// <input 
//   type='number' 
//   id='sellingPrice' 
//   placeholder='Enter selling price' 
//   value={data.sellingPrice} 
//   name='sellingPrice'
//   onChange={handleOnChange}
//   className='p-2 bg-slate-100 border rounded'
//   required
//   min="0"  // Prevents negative input
// />


//               <label htmlFor='description' className='mt-3'>Description :</label>
//               <textarea 
//                 className='h-28 bg-slate-100 border resize-none p-1' 
//                 placeholder='enter product description' 
//                 rows={3} 
//                 onChange={handleOnChange} 
//                 name='description'
//                 value={data.description}
//                 required
//               >
//               </textarea>





//               <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
//           </form> 



      
//        </div>



//        {/***display image full screen */}
//        {
//         openFullScreenImage && (
//           <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
//         )
//        }
        

//     </div>
//   )
// }

// export default UploadProduct

import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import DisplayImage from './DisplayImage';

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;

  //   // Prevent negative values for price and selling price
  //   if ((name === "price" || name === "sellingPrice") && value < 0) {
  //     toast.error("Price cannot be negative!");
  //     return;
  //   }

  //   // Prevent numbers and special characters in brand name
  //   if (name === "brandName" && /[^a-zA-Z\s]/.test(value)) {
  //     toast.error("Brand Name cannot contain numbers or special characters!");
  //     return;
  //   }

  //   setData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "sellingPrice") && value < 0) {
      toast.error("Price cannot be negative!");
      return;
    }

    if (name === "brandName" && /[^a-zA-Z\s]/.test(value)) {
      toast.error("Brand Name cannot contain numbers or special characters!");
      return;
    }

    setData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      if (name === "sellingPrice" && parseFloat(updatedData.sellingPrice) > parseFloat(updatedData.price)) {
        toast.error("Selling price cannot be greater than the original price!");
        return prev;
      }
      
      return updatedData;
    });
  };

  const handleUploadProduct = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // 1MB size limit
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB.");
      return;
    }

    // Check file type (Only images allowed)
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed. Videos are not supported.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prevData) => ({
        ...prevData,
        productImage: [...(prevData.productImage || []), reader.result],
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure at least one image is uploaded
    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            id='productName'
            placeholder='Enter product name'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
          <input
            type='text'
            id='brandName'
            placeholder='Enter brand name'
            value={data.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
            pattern="^[A-Za-z\s]+$"
            title="Brand Name cannot contain numbers or special characters"
          />

          <label htmlFor='category' className='mt-3'>Category :</label>
          <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
            <option value={""}>Select Category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={el.value + index}>{el.label}</option>
            ))}
          </select>

          <label htmlFor='productImage' className='mt-3'>Product Image :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Upload Product Image</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          <div>
            {data.productImage.length > 0 ? (
              <div className='flex items-center gap-2'>
                {data.productImage.map((el, index) => (
                  <div className='relative group' key={index}>
                    <img
                      src={el}
                      alt="Product"
                      width={80}
                      height={80}
                      className='bg-slate-100 border cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-red-600 text-xs'>*Please upload a product image</p>
            )}
          </div>

          <label htmlFor='price' className='mt-3'>Price :</label>
          <input
            type='number'
            id='price'
            placeholder='Enter price'
            value={data.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
            min="0"
          />

          <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='Enter selling price'
            value={data.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
            min="0"
          />

          <label htmlFor='description' className='mt-3'>Description :</label>
          <textarea
            className='h-28 bg-slate-100 border resize-none p-1'
            placeholder='Enter product description'
            name='description'
            value={data.description}
            onChange={handleOnChange}
            required
          />

          <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
        </form>
      </div>

      {openFullScreenImage && <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />}
    </div>
  );
};

export default UploadProduct;
