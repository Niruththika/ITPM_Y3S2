import React, { useState, useEffect } from 'react';

// Status badge component
const Status = ({ statusText }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'inprogress':
        return 'text-red-500';
      case 'cancled':
      case 'canceled':
        return 'text-red-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <span className={`font-medium ${getStatusColor(statusText)}`}>
      {statusText}
    </span>
  );
};

// Modal component for Order Details
export const OrderDetailsModal = ({
  isOpen,
  onClose,
  onUpdate,
  onEdit,
  isAddMode = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    currentLocation: '',
    arrivalLocation: '',
    saveAndUpdate: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        status: initialData.status || '',
        currentLocation: initialData.currentLocation || '',
        arrivalLocation: initialData.arrival || '',
        saveAndUpdate: false,
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Additional JS validation for name
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(formData.name)) {
      alert('Name should not contain numbers or special characters.');
      return;
    }

    onUpdate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-xl text-red-500 mb-4">
          {isAddMode ? 'Create New Order' : 'Order Details'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name*"
                className="w-full border rounded p-2"
                value={formData.name}
                onChange={handleChange}
                pattern="^[A-Za-z\s]+$"
                title="Name should not contain numbers or special characters."
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <select
                name="status"
                className="w-full border rounded p-2 appearance-none pr-8"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Inprogress">InProgress</option>
                <option value="Cancled">Canceled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="currentLocation"
              placeholder="Current Location"
              className="w-full border rounded p-2"
              value={formData.currentLocation}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="arrivalLocation"
              placeholder="Arrival Location"
              className="w-full border rounded p-2"
              value={formData.arrivalLocation}
              onChange={handleChange}
            />
          </div>

          {!isAddMode && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="saveAndUpdate"
                  checked={formData.saveAndUpdate}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Save And Update</span>
              </label>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-8 rounded"
            >
              {isAddMode ? 'Submit' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-8 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Status;