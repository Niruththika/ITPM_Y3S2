// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Formtable from "../components/Formtable";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/";

// export default function Client() {
//   const [editSection, setEditSection] = useState(false);
//   const [formData, setFormData] = useState({
//     color: "",
//     size: "",
//     add: "",
//     quan: "",
//   });
//   const [formDataEdit, setFormDataEdit] = useState({
//     color: "",
//     size: "",
//     add: "",
//     quan: "",
//     _id: "",
//   });
//   const [dataList, setDataList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [tableVisible, setTableVisible] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { value, name } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
  
//     try {
//       const { data } = await axios.post(`${BASE_URL}create`, formData);
//       if (data.success) {
//         alert(`Order created successfully `);
//         getFetchData();
//         // Clear form
//         setFormData({ color: "", size: "", add: "", quan: "" });
//       } else {
//         alert(data.message || "Something went wrong.");
//       }
//     } catch (error) {
//       alert("Error submitting data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const getFetchData = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(BASE_URL);
//       setDataList(data.data);
//     } catch (error) {
//       alert("Error fetching data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getFetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`${BASE_URL}delete/${id}`);
//       alert(response.data.message);
//       getFetchData();
//     } catch (error) {
//       alert("Error deleting item. Please try again.");
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const { _id, ...updatedData } = formDataEdit;
//       const response = await axios.put(`${BASE_URL}update/${_id}`, updatedData);
//       if (response.data.success) {
//         getFetchData();
//         alert(response.data.message);
//         setEditSection(false);
//       } else {
//         alert(response.data.message || "Update failed.");
//       }
//     } catch (error) {
//       alert("Error updating item. Please try again.");
//     }
//   };
  

//   const handleEditOnChange = (e) => {
//     const { value, name } = e.target;
//     setFormDataEdit((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleEdit = (el) => {
//     setFormDataEdit(el);
//     setEditSection(true);
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col items-center justify-center py-6">
//         <div className="flex space-x-4 mb-6">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             onClick={() => setTableVisible(!tableVisible)}
//           >
//             Customer Details
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             onClick={() => navigate("/Admin")}
//           >
//             Admin
//           </button>
//         </div>

//         {tableVisible && (
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         )}

//         {tableVisible && (
//           <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4 text-left">Color</th>
//                   <th className="py-2 px-4 text-left">Size</th>
//                   <th className="py-2 px-4 text-left">Adding</th>
//                   <th className="py-2 px-4 text-left">Quantity</th>
//                   <th className="py-2 px-4 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dataList
//                   .filter(
//                     (el) =>
//                       el.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       el.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       el.add.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       el.quan.toLowerCase().includes(searchTerm.toLowerCase())
//                   )
//                   .map((el) => (
//                     <tr key={el._id} className="border-t">
//                       <td className="py-2 px-4">{el.color}</td>
//                       <td className="py-2 px-4">{el.size}</td>
//                       <td className="py-2 px-4">{el.add}</td>
//                       <td className="py-2 px-4">{el.quan}</td>
//                       <td className="py-2 px-4 space-x-2">
//                         <button
//                           className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                           onClick={() => handleEdit(el)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
//                           onClick={() => handleDelete(el._id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {editSection ? (
//           <Formtable
//             handleSubmit={handleUpdate}
//             handleOnChange={handleEditOnChange}
//             handleClose={() => setEditSection(false)}
//             rest={formDataEdit}
//             loading={loading}
//           />
//         ) : (
//           <Formtable
//             handleSubmit={handleSubmit}
//             handleOnChange={handleOnChange}
//             handleClose={() => setEditSection(false)}
//             rest={formData}
//             loading={loading}
//           />
//         )}
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import Formtable from "../components/Formtable";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/";

export default function Client() {
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    add: "",
    quan: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    color: "",
    size: "",
    add: "",
    quan: "",
    _id: "",
  });
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const { data } = await axios.post(`${BASE_URL}create`, formData);
      if (data.success) {
        alert(`Order created successfully `);
        getFetchData();
        // Clear form
        setFormData({ color: "", size: "", add: "", quan: "" });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      alert("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(BASE_URL);
      setDataList(data.data);
    } catch (error) {
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}delete/${id}`);
      alert(response.data.message);
      getFetchData();
    } catch (error) {
      alert("Error deleting item. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...updatedData } = formDataEdit;
      const response = await axios.put(`${BASE_URL}update/${_id}`, updatedData);
      if (response.data.success) {
        getFetchData();
        alert(response.data.message);
        setEditSection(false);
      } else {
        alert(response.data.message || "Update failed.");
      }
    } catch (error) {
      alert("Error updating item. Please try again.");
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  // Improved search function with null/undefined checks and type conversion
  const filteredData = dataList.filter((el) => {
    if (!el) return false;

    // Convert all values to lowercase strings for case-insensitive search
    const color = String(el.color || '').toLowerCase();
    const size = String(el.size || '').toLowerCase();
    const add = String(el.add || '').toLowerCase();
    const quan = String(el.quan || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase().trim();

    // Return true if any field includes the search term
    return (
      color.includes(searchTermLower) ||
      size.includes(searchTermLower) ||
      add.includes(searchTermLower) ||
      quan.includes(searchTermLower)
    );
  });

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-6">
        <div className="flex space-x-4 mb-6">
          <button
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700"
            onClick={() => setTableVisible(!tableVisible)}
          >
            Customer Details
          </button>
          <button
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700"
            onClick={() => navigate("/Admin")}
          >
            Admin
          </button>
        </div>

        {tableVisible && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 mb-4 border border-red-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          />
        )}

        {tableVisible && (
          <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead className="bg-red-100">
                <tr>
                  <th className="py-2 px-4 text-left">Color</th>
                  <th className="py-2 px-4 text-left">Size</th>
                  <th className="py-2 px-4 text-left">Adding</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((el) => (
                  <tr key={el._id} className="border-t">
                    <td className="py-2 px-4">{el.color}</td>
                    <td className="py-2 px-4">{el.size}</td>
                    <td className="py-2 px-4">{el.add}</td>
                    <td className="py-2 px-4">{el.quan}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => handleEdit(el)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => handleDelete(el._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editSection ? (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleClose={() => setEditSection(false)}
            rest={formDataEdit}
            loading={loading}
          />
        ) : (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleClose={() => setEditSection(false)}
            rest={formData}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}