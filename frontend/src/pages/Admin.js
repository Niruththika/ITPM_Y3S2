import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sum of Quantities",
        data: [],
        backgroundColor: "rgba(235, 35, 45, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  });

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

  useEffect(() => {
    const additions = {};
    dataList.forEach((item) => {
      additions[item.add] = (additions[item.add] || 0) + parseInt(item.quan);
    });

    setChartData({
      labels: Object.keys(additions),
      datasets: [
        {
          ...chartData.datasets[0],
          data: Object.values(additions),
        },
      ],
    });
  }, [dataList]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Color", "Size", "Adding", "Quantity"];
    const tableRows = [];

    dataList.forEach((item) => {
      const rowData = [item.color, item.size, item.add, item.quan.toString()];
      tableRows.push(rowData);
    });

    doc.setFontSize(20);
    doc.text("I Care Report", 14, 20);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    const canvas = document.querySelector(".chartContainer canvas");
    if (canvas) {
      const imgDataURI = canvas.toDataURL("image/png");
      const finalY = doc.lastAutoTable?.finalY || 40;
      doc.addImage(imgDataURI, "PNG", 10, finalY + 10, 180, 100);
    }

    doc.save("I_Care_Report.pdf");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}delete/${id}`);
      alert(response.data.message);
      getFetchData();
    } catch (error) {
      alert("Error deleting item. Please try again.");
    }
  };

  const filterData = (item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.color.toLowerCase().includes(searchLower) ||
      item.size.toLowerCase().includes(searchLower) ||
      item.add.toLowerCase().includes(searchLower) ||
      item.quan.toString().toLowerCase().includes(searchLower)
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-red-300 rounded-md focus:ring-indigo-500 focus:border-red-500"
          aria-label="Search"
        />
      </div>

      <button
        onClick={generatePDF}
        disabled={dataList.length === 0}
        className="mb-6 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Report
      </button>

      {loading ? (
        <p className="text-center text-red-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Color</th>
                  <th className="py-2 px-4 text-left">Size</th>
                  <th className="py-2 px-4 text-left">Adding</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList && dataList.length > 0 ? (
                  dataList.filter(filterData).map((el) => (
                    <tr key={el._id} className="border-t">
                      <td className="py-2 px-4">{el.color}</td>
                      <td className="py-2 px-4">{el.size}</td>
                      <td className="py-2 px-4">{el.add}</td>
                      <td className="py-2 px-4">{el.quan}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDelete(el._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-red-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="chartContainer">
            <Bar data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}
