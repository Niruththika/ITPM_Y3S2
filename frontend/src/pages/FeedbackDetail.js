import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackDetail = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const fetchFeedbacks = async () => {
    const res = await axios.get('http://localhost:5000/api/feedback');
    setFeedbacks(res.data);
    setFilteredFeedbacks(res.data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = feedbacks.filter(
      (fb) =>
        fb.name.toLowerCase().includes(lowercasedSearch) ||
        fb.email.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredFeedbacks(filtered);
  }, [search, feedbacks]);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/feedback/${id}`);
    fetchFeedbacks();
    setMessage('Feedback deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (feedback) => {
    setEditing(feedback);
  };

  const handleUpdate = async () => {
    try {
      const { _id, ...updateData } = editing;
      await axios.put(`http://localhost:5000/api/feedback/${_id}`, updateData);
      setEditing(null);
      fetchFeedbacks();
      setMessage('Feedback updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update feedback');
    }
  };

  const handleChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200 p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Feedback Details</h2>

      {message && (
        <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded mb-6 text-center max-w-md mx-auto">
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Search by name or email..."
        className="border rounded p-2 w-full max-w-md mb-6 mx-auto block"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-center mb-4">Edit Feedback</h3>

            <input
              className="border rounded p-2 w-full mb-3"
              name="name"
              value={editing.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              className="border rounded p-2 w-full mb-3"
              name="email"
              value={editing.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <textarea
              className="border rounded p-2 w-full mb-3"
              name="review"
              value={editing.review}
              onChange={handleChange}
              placeholder="Review"
            />

            {['experience', 'response', 'support', 'satisfaction'].map((item) => (
              <select
                key={item}
                className="border rounded p-2 w-full mb-3"
                name={item}
                value={editing[item]}
                onChange={handleChange}
              >
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-white shadow-md rounded-lg p-4">
            <h4 className="text-lg font-bold mb-2">{feedback.name}</h4>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Review:</strong> {feedback.review}</p>
            <p><strong>Experience:</strong> {feedback.experience}</p>
            <p><strong>Response:</strong> {feedback.response}</p>
            <p><strong>Support:</strong> {feedback.support}</p>
            <p><strong>Satisfaction:</strong> {feedback.satisfaction}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                onClick={() => handleEdit(feedback)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                onClick={() => handleDelete(feedback._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDetail;
