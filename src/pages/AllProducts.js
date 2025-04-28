// // import React, { useEffect, useState } from 'react'
// // import UploadProduct from '../components/UploadProduct'
// // import SummaryApi from '../common'
// // import AdminProductCard from '../components/AdminProductCard'

// // const AllProducts = () => {
// //   const [openUploadProduct,setOpenUploadProduct] = useState(false)
// //   const [allProduct,setAllProduct] = useState([])

// //   const fetchAllProduct = async() =>{
// //     const response = await fetch(SummaryApi.allProduct.url)
// //     const dataResponse = await response.json()

// //     console.log("product data",dataResponse)

// //     setAllProduct(dataResponse?.data || [])
// //   }

// //   useEffect(()=>{
// //     fetchAllProduct()
// //   },[])
  
// //   return (
// //     <div>
// //         <div className='bg-white py-2 px-4 flex justify-between items-center'>
// //             <h2 className='font-bold text-lg'>All Product</h2>
// //             <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
// //         </div>

// //         {/**all product */}
// //         <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
// //           {
// //             allProduct.map((product,index)=>{
// //               return(
// //                 <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
                
// //               )
// //             })
// //           }
// //         </div>





// //         {/**upload prouct component */}
// //         {
// //           openUploadProduct && (
// //             <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
// //           )
// //         }
      

// //     </div>
// //   )
// // }

// // export default AllProducts


// // import React, { useEffect, useState } from 'react';
// // import UploadProduct from '../components/UploadProduct';
// // import SummaryApi from '../common';
// // import AdminProductCard from '../components/AdminProductCard';
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // const AllProducts = () => {
// //   const [openUploadProduct, setOpenUploadProduct] = useState(false);
// //   const [allProduct, setAllProduct] = useState([]);

// //   const fetchAllProduct = async () => {
// //     const response = await fetch(SummaryApi.allProduct.url);
// //     const dataResponse = await response.json();
// //     console.log('product data', dataResponse);
// //     setAllProduct(dataResponse?.data || []);
// //   };

// //   useEffect(() => {
// //     fetchAllProduct();
// //   }, []);

// //   const generatePDF = () => {
// //     const doc = new jsPDF();
// //     doc.text('All Products', 14, 10);

// //     const tableColumn = ['Name', 'Price', 'Category', 'Brand Name'];
// //     const tableRows = [];

// //     allProduct.forEach(product => {
// //       const rowData = [product. productName, product.price, product.category, product.brandName];
// //       tableRows.push(rowData);
// //     });

// //     autoTable(doc, {
// //       head: [tableColumn],
// //       body: tableRows,
// //       startY: 20
// //     });

// //     doc.save('All_Products.pdf');
// //   };

// //   return (
// //     <div>
// //       <div className="bg-white py-2 px-4 flex justify-between items-center">
// //         <h2 className="font-bold text-lg">All Products</h2>
// //         <div>
// //           <button
// //             className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
// //             onClick={() => setOpenUploadProduct(true)}
// //           >
// //             Upload Product
// //           </button>
// //           <button
// //             className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full ml-2"
// //             onClick={generatePDF}
// //           >
// //             Download PDF
// //           </button>
// //         </div>
// //       </div>

// //       {/** All products */}
// //       <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
// //         {allProduct.map((product, index) => (
// //           <AdminProductCard data={product} key={index + 'allProduct'} fetchdata={fetchAllProduct} />
// //         ))}
// //       </div>

// //       {/** Upload product component */}
// //       {openUploadProduct && <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />}
// //     </div>
// //   );
// // };

// // export default AllProducts;


// import React, { useEffect, useState } from 'react';
// import UploadProduct from '../components/UploadProduct';
// import SummaryApi from '../common';
// import AdminProductCard from '../components/AdminProductCard';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const AllProducts = () => {
//   const [openUploadProduct, setOpenUploadProduct] = useState(false);
//   const [allProduct, setAllProduct] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchAllProduct = async () => {
//     try {
//       const response = await fetch(SummaryApi.allProduct.url);
//       const dataResponse = await response.json();
//       console.log('product data', dataResponse);
      
//       const productsData = dataResponse?.data || [];
//       setAllProduct(productsData);
//       setFilteredProducts(productsData);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       alert('Failed to fetch products. Please try again.');
//     }
//   };

//   useEffect(() => {
//     fetchAllProduct();
//   }, []);

//   // Search function
//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     const filtered = allProduct.filter(product => 
//       product.productName.toLowerCase().includes(term) ||
//       product.category.toLowerCase().includes(term) ||
//       product.brandName.toLowerCase().includes(term) ||
//       product.price.toString().includes(term)
//     );

//     setFilteredProducts(filtered);
//   };

//   // PDF Generation function
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text('All Products', 14, 10);

//     const tableColumn = ['Name', 'Price', 'Category', 'Brand Name'];
//     const tableRows = [];

//     filteredProducts.forEach(product => {
//       const rowData = [
//         product.productName, 
//         `$${product.price.toFixed(2)}`, 
//         product.category, 
//         product.brandName
//       ];
//       tableRows.push(rowData);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20
//     });

//     doc.save('Filtered_Products.pdf');
//   };

//   return (
//     <div className="p-4">
//       <div className="bg-white py-2 px-4 flex flex-col md:flex-row justify-between items-center mb-4">
//         <h2 className="font-bold text-lg mb-2 md:mb-0">All Products</h2>
        
//         <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
//           {/* Search Input */}
//           <input 
//             type="text" 
//             placeholder="Search products..." 
//             value={searchTerm}
//             onChange={handleSearch}
//             className="w-full md:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           {/* Buttons */}
//           <div className="flex space-x-2">
//             <button
//               className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
//               onClick={() => setOpenUploadProduct(true)}
//             >
//               Upload Product
//             </button>
//             <button
//               className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full"
//               onClick={generatePDF}
//             >
//               Download PDF
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-250px)] overflow-y-scroll">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product, index) => (
//             <AdminProductCard 
//               data={product} 
//               key={index + 'allProduct'} 
//               fetchdata={fetchAllProduct} 
//             />
//           ))
//         ) : (
//           <div className="w-full text-center text-gray-500 py-4">
//             No products found
//           </div>
//         )}
//       </div>

//       {/* Upload Product Modal */}
//       {openUploadProduct && (
//         <UploadProduct 
//           onClose={() => setOpenUploadProduct(false)} 
//           fetchData={fetchAllProduct} 
//         />
//       )}
//     </div>
//   );
// };

// export default AllProducts;

import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    console.log('product data', dataResponse);
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('All Products', 14, 10);

    const tableColumn = ['Name', 'Price', 'Category', 'Brand Name'];
    const tableRows = [];

    allProduct.forEach(product => {
      const rowData = [product. productName, product.price, product.category, product.brandName];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save('All_Products.pdf');
  };

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <div>
          <button
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
            onClick={() => setOpenUploadProduct(true)}
          >
            Upload Product
          </button>
          <button
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full ml-2"
            onClick={generatePDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/** All products */}
      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product, index) => (
          <AdminProductCard data={product} key={index + 'allProduct'} fetchdata={fetchAllProduct} />
        ))}
      </div>

      {/** Upload product component */}
      {openUploadProduct && <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />}
    </div>
  );
};

export default AllProducts;