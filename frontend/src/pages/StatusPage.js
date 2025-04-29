import React, { useState, useEffect } from 'react';
import Status, { OrderDetailsModal } from '../components/Status';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StatusPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/orders`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderSelect = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleRowClick = (order) => {
    setCurrentOrder(order);
    setIsAddMode(false);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async (formData) => {
    try {
      if (isAddMode) {
        const newOrder = {
          id: generateOrderId(),
          name: formData.name,
          email: formData.email,
          status: formData.status || 'Pending',
          currentLocation: formData.currentLocation,
          arrival: formData.arrivalLocation
        };

        const response = await axios.post(`${apiUrl}/api/orders`, newOrder);
        setOrders([...orders, response.data]);
      } else {
        if (!currentOrder) return;

        const updatedOrder = {
          ...currentOrder,
          name: formData.name,
          email: formData.email,
          status: formData.status,
          currentLocation: formData.currentLocation,
          arrival: formData.arrivalLocation
        };

        await axios.put(`${apiUrl}/api/orders/${currentOrder._id}`, updatedOrder);
        setOrders(orders.map(order =>
          order._id === currentOrder._id ? updatedOrder : order
        ));
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error handling order:', err);
      alert('Failed to process order. Please try again.');
    }
  };

  const generateOrderId = () => {
    return 'ORD-' + Date.now().toString().slice(-6);
  };

  const handleEditOrder = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedOrders.map(id => axios.delete(`${apiUrl}/api/orders/${id}`))
      );

      setOrders(orders.filter(order => !selectedOrders.includes(order._id)));
      setSelectedOrders([]);
    } catch (err) {
      console.error('Error deleting orders:', err);
      alert('Failed to delete orders. Please try again.');
    }
  };

  const handleAdd = () => {
    setCurrentOrder(null);
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const handleGenerateReport = () => {
    const headers = ['Order ID', 'Gmail', 'Status', 'Current Location', 'Arrival'];
    const csvRows = [headers.join(',')];

    filteredOrders.forEach(order => {
      const row = [
        order.id,
        order.email,
        order.status,
        order.currentLocation,
        order.arrival
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text('Orders Report', 14, 16);

    const tableColumn = ['Order ID', 'Gmail', 'Status', 'Current Location', 'Arrival'];
    const tableRows = [];

    filteredOrders.forEach(order => {
      const row = [
        order.id,
        order.email,
        order.status,
        order.currentLocation,
        order.arrival
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
    });

    doc.save('orders_report.pdf');
  };

  if (loading) return <div className="text-center p-8">Loading orders...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-red-500 text-white rounded-r-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePDF}
            className="bg-purple-600 text-white py-2 px-4 rounded-md"
          >
            Export PDF
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Export CSV
          </button>
          <button
            onClick={handleAdd}
            className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center"
          >
            Add +
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-100">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-4 text-left text-black">Order ID</th>
                <th className="p-4 text-left text-black">Gmail</th>
                <th className="p-4 text-left text-black">Status</th>
                <th className="p-4 text-left text-black">Current Location</th>
                <th className="p-4 text-left text-black">Arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  onClick={() => handleRowClick(order)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleOrderSelect(order._id);
                      }}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4"><Status statusText={order.status} /></td>
                  <td className="p-4">{order.currentLocation}</td>
                  <td className="p-4">{order.arrival}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrders.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-6 rounded-md"
          >
            Delete
          </button>
        </div>
      )}

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateOrder}
        onEdit={handleEditOrder}
        isAddMode={isAddMode}
        initialData={currentOrder || {}}
      />
    </div>
  );
};

export default StatusPage;