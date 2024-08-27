import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { handleExport } from '../utils/exportUtils';
import { calculateTotalAmount, avgExpensePerCategory, generatePieData, generateLineData, generateBarData } from "../utils/helper";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('excel');
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [avgExpenses, setAvgExpenses] = useState(0);

  const navigate = useNavigate(); // Initialize navigate

  const onExportClick = () => {
    handleExport(startDate, endDate, format);
  };

  const handleExportData = async () => {
    const token = Cookies.get('accessToken');
    const query = new URLSearchParams({ startDate, endDate }).toString();

    try {
      const response = await axios.get(`http://localhost:5001/api/expenses/userExpenses?${query}`, {
        headers: {
          'authToken': token,
        },
      });

      const data = response.data.data;
      setExpenses(data);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  useEffect(() => {
    handleExportData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleExportData();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setTotalExpenses(calculateTotalAmount(expenses));
    setAvgExpenses(avgExpensePerCategory(expenses));
  }, [expenses]);

  const lineData = generateLineData(expenses);
  const barData = generateBarData(expenses);
  const pieData = generatePieData(expenses);

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="text-lg font-bold">Select Dates</div>
        <div className="flex gap-4">
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="self-center">TO</span>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-center font-bold mb-4">Total Expense</div>
          <div className="h-32">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-center font-bold mb-4">Expenses of Time Periods</div>
          <div className="h-32">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-center font-bold mb-4">Expenses by Categories</div>
          <div className="h-32">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-100 rounded text-center">
          <div className="font-bold">Total Expenses</div>
          <div>$ {totalExpenses}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <div className="font-bold">Average expense per category</div>
          <div>$ {avgExpenses}</div>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="p-2 bg-blue-500 text-white rounded" onClick={onExportClick}>Export</button>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={() => navigate('/export-import')} // Navigate to /export-import on click
        >
          Import
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
