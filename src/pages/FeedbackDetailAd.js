import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const FeedbackDetailAd = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const reportRef = useRef();

  const fetchFeedbacks = async () => {
    const res = await axios.get('http://localhost:5000/api/feedback');
    setFeedbacks(res.data);
  };

  const fetchSentimentData = async () => {
    const res = await axios.get('http://localhost:5000/api/feedback/review-sentiments');
    const sentimentCounts = res.data;
    const formattedData = Object.entries(sentimentCounts).map(([label, count]) => ({
      sentiment: label,
      count,
    }));
    setSentimentData(formattedData);
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchSentimentData();
  }, []);

  const filteredFeedbacks = feedbacks.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('feedback_report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200 p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Feedback Details & Sentiment Analysis</h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          className="border p-2 rounded w-full md:w-1/2"
          placeholder="Search by name, email or review..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          onClick={generatePDF}
        >
          Generate PDF Report
        </button>
      </div>

      <div ref={reportRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredFeedbacks.map(feedback => (
            <div key={feedback._id} className="bg-white shadow-md rounded-lg p-4">
              <h4 className="text-lg font-bold mb-2">{feedback.name}</h4>
              <p><strong>Email:</strong> {feedback.email}</p>
              <p><strong>Review:</strong> {feedback.review}</p>
              <p><strong>Experience:</strong> {feedback.experience}</p>
              <p><strong>Response:</strong> {feedback.response}</p>
              <p><strong>Support:</strong> {feedback.support}</p>
              <p><strong>Satisfaction:</strong> {feedback.satisfaction}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-center mb-4">Review Sentiment Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sentiment" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Number of Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackDetailAd;
