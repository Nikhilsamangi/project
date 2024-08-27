// src/hooks/useExpenses.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { calculateTotalExpenses, avgExpensePerCategory } from '../utils/helper'; // Adjust the path if necessary

const useExpenses = (startDate, endDate) => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [avgExpenses, setAvgExpenses] = useState(0);

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
  }, [startDate, endDate]); // Trigger data fetch when startDate or endDate changes

  useEffect(() => {
    if (expenses.length > 0) {
      setTotalExpenses(calculateTotalExpenses(expenses)); // Use the new function
      setAvgExpenses(avgExpensePerCategory(expenses));
    }
  }, [expenses]);

  return {
    expenses,
    totalExpenses,
    avgExpenses,
  };
};

export default useExpenses;
