import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
    experience: '',
    response: '',
    support: '',
    satisfaction: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(formData.name)) {
      alert('Please enter a valid name (letters and spaces only).');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      alert('Feedback submitted successfully!');
      setFormData({
        name: '',
        email: '',
        review: '',
        experience: '',
        response: '',
        support: '',
        satisfaction: '',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 p-4">
      <div className="w-full max-w-lg">
        {/* Enhanced Header */}
        <div className="bg-white rounded-t-lg shadow-lg p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
              FB
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Feedback Portal</h1>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
              onClick={() => navigate('/feedbackdetailAd')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Admin</span>
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
              onClick={() => navigate('/feedbackdetail')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="bg-white rounded-b-lg shadow-lg p-8 pt-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">User Feedback Form</h2>

          <input
            className="w-full border-b-2 border-gray-300 p-2 mb-4 rounded focus:outline-none focus:border-blue-500 transition duration-300"
            name="name"
            placeholder="Your Name"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <input
            className="w-full border-b-2 border-gray-300 p-2 mb-4 rounded focus:outline-none focus:border-blue-500 transition duration-300"
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={formData.email}
          />

          <textarea
            className="w-full border-b-2 border-gray-300 p-2 mb-4 rounded focus:outline-none focus:border-blue-500 transition duration-300"
            name="review"
            placeholder="Your Review"
            required
            onChange={handleChange}
            value={formData.review}
          />

          {['experience', 'response', 'support', 'satisfaction'].map((item) => (
            <div key={item} className="mb-4">
              <label className="capitalize font-medium text-gray-700">{item.replace(/^\w/, c => c.toUpperCase())}</label>
              <select
                name={item}
                required
                className="w-full border-b-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 transition duration-300"
                onChange={handleChange}
                value={formData[item]}
              >
                <option value="">Select</option>
                <option>Very Good</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          ))}

          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full w-full transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
