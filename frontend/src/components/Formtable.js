import React, { useState } from "react";
import img1 from "./image/stu.jpg";
import yellow from "./image/yellow.jpg";
import red from "./image/red.jpg";
import blue from "./image/blue.jpg";
import black from "./image/black.jpg";

const Formtable = ({
  handleSubmit,
  handleOnChange: parentHandleOnChange,
  handleclose,
  loading,
  rest,
}) => {
  const [showOptions, setShowOptions] = useState({
    color: false,
    size: false,
    quan: false,
  });
  const [url, setURL] = useState(img1);

  const toggleOptions = (column) => {
    setShowOptions({
      ...showOptions,
      [column]: !showOptions[column],
    });
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    switch (value) {
      case "red":
        setURL(red);
        break;
      case "yellow":
        setURL(yellow);
        break;
      case "blue":
        setURL(blue);
        break;
      case "black":
        setURL(black);
        break;
      case "White":
        setURL(img1);
        break;
      default:
        break;
    }

    if (name === "quan") {
      const newValue = parseInt(value);
      if (!isNaN(newValue) && newValue >= 1) {
        parentHandleOnChange({ target: { name, value: newValue } });
      }
    } else {
      parentHandleOnChange(event);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-red-50 shadow-2xl rounded-xl mt-8 transition-all duration-300 hover:shadow-2xl border border-red-100">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="md:w-1/2">
          <div className="relative overflow-hidden rounded-xl group">
            <img
              src={url}
              alt="Selected color"
              className="w-full h-80 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-red-800 font-medium text-lg">Premium Eyewear</p>
              <p className="text-red-600 text-sm">Choose your perfect style and fit</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-5 gap-2">
            {[
              { color: "White", img: img1 },
              { color: "black", img: black },
              { color: "blue", img: blue },
              { color: "red", img: red },
              { color: "yellow", img: yellow },
            ].map((item) => (
              <div 
                key={item.color}
                onClick={() => {
                  setURL(item.img);
                  parentHandleOnChange({ target: { name: "color", value: item.color } });
                }}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                  rest.color === item.color ? "border-red-600 ring-2 ring-red-300" : "border-red-200"
                } hover:shadow-md transition-all duration-200`}
              >
                <img src={item.img} alt={item.color} className="w-full h-12 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-red-800 mb-6">Enter Your Addings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="color" className="block text-sm font-medium text-red-700 mb-2">
                Color Selection:
              </label>
              <select
                id="color"
                name="color"
                onChange={handleOnChange}
                value={rest.color}
                className="block w-full py-3 px-4 border border-red-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all duration-200"
              >
                <option value="" className="text-gray-500">Select Color</option>
                <option value="black" className="text-gray-900">Black</option>
                <option value="blue" className="text-blue-700">Blue</option>
                <option value="red" className="text-red-600">Red</option>
                <option value="yellow" className="text-yellow-500">Yellow</option>
                <option value="White" className="text-gray-700">Brown</option>
              </select>
            </div>

            <div className="relative">
              <label htmlFor="size" className="block text-sm font-medium text-red-700 mb-2">
                Size Selection:
              </label>
              {showOptions.size ? (
                <select
                  id="size"
                  name="size"
                  onChange={handleOnChange}
                  value={rest.size}
                  className="block w-full py-3 px-4 border border-red-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all duration-200"
                >
                  {Array.from({ length: 31 }, (_, i) => 35 + i).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              ) : (
                <div onClick={() => toggleOptions("size")} className="relative cursor-pointer">
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={rest.size || "Select Size"}
                    readOnly
                    className="block w-full py-3 px-4 border border-red-200 bg-gray-50 rounded-lg shadow-sm cursor-pointer text-base"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <label htmlFor="add" className="block text-sm font-medium text-red-700 mb-2">
                Lens Features:
              </label>
              <select
                id="add"
                name="add"
                onChange={handleOnChange}
                value={rest.add}
                className="block w-full py-3 px-4 border border-red-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-all duration-200"
              >
                <option value="" className="text-gray-500">Select Features</option>
                <option value="UV protection">UV Protection</option>
                <option value="Cooling">Cooling Comfort</option>
                <option value="Blue light blocking">Blue Light Blocking</option>
                <option value="Anti-Reflective Coating">Anti-Reflective Coating</option>
              </select>
            </div>

            <div className="relative">
              <label htmlFor="quan" className="block text-sm font-medium text-red-700 mb-2">
                Quantity:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="flex">
                  <button 
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(1, (rest.quan || 1) - 1);
                      parentHandleOnChange({ target: { name: "quan", value: newValue } });
                    }}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-l-lg border border-red-200 hover:bg-red-200 transition-colors duration-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quan"
                    name="quan"
                    onChange={handleOnChange}
                    value={rest.quan}
                    min="1"
                    className="block w-full py-3 px-4 border-y border-red-200 focus:outline-none focus:ring-0 focus:border-red-500 text-base text-center"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newValue = (parseInt(rest.quan) || 0) + 1;
                      parentHandleOnChange({ target: { name: "quan", value: newValue } });
                    }}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-r-lg border border-red-200 hover:bg-red-200 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-base font-medium rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-300 hover:-translate-y-1 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Order...
                </div>
              ) : (
                "Add to Cart"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Formtable;