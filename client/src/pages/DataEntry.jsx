import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import fetchUser from "../utils/fetchUser"
import { companyExpenses } from '../data/companyExpenses';

const DataEntry = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [payee, setPayee] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUser()
        setUserId(userData.id);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message || error.message);
        setErrorMessage('Failed to fetch user data. Please log in again.');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    try {
      const token = Cookies.get('accessToken');
      let receiptData = null;
      
      if (receipt) {
        const reader = new FileReader();
        reader.readAsDataURL(receipt);
        reader.onloadend = async () => {
          receiptData = reader.result;

          const data = {
            userId,
            date,
            amount,
            payee,
            description,
            category,
            receipt: receiptData,
          };

          const response = await axios.post('http://localhost:5001/api/users/expense/', data, {
            headers: {
              AuthToken: token,
              'Content-Type': 'application/json',
            },
          });

          setSuccessMessage('Expense added successfully');
          setErrorMessage('');
          setDate('');
          setDescription('');
          setAmount('');
          setCategory('');
          setPayee('');
          setReceipt(null);
        };
      } else {
        const data = {
          userId,
          date,
          amount,
          payee,
          description,
          category,
          receipt: receiptData,
        };

        const response = await axios.post('http://localhost:5001/api/users/expense/', data, {
          headers: {
            AuthToken: token,
            'Content-Type': 'application/json',
          },
        });

        setSuccessMessage('Expense added successfully');
        setErrorMessage('');
        setDate('');
        setDescription('');
        setAmount('');
        setCategory('');
        setPayee('');
        setReceipt(null);
      }
    } catch (error) {
      console.error('Error adding expense:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Data Entry</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4 rounded-lg shadow-md bg-gray-200">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-700 border border-green-400 p-4 rounded mb-4">
            {successMessage}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Date</label>
            <div className="flex items-center border rounded p-2 bg-white">
              <input
                type="date"
                className="flex-1 border-none outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <span className="ml-2">&#128197;</span>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Description</label>
            <textarea
              className="border p-2 rounded h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Amount</label>
            <input
              type="number"
              placeholder="Enter Amount"
              className="border p-2 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Category</label>
            <select
              className="border p-2 rounded bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {companyExpenses.map((expense, index) => (
                     <option value={expense} key={index}>{expense}</option>
          // <li key={index}>{expense}</li>
        ))}
              {/* <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option> */}
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Payee</label>
            <input
              type="text"
              placeholder="Payee"
              className="border p-2 rounded"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Receipt (Optional)</label>
            <input
              type="file"
              className="border p-2 rounded"
              onChange={(e) => setReceipt(e.target.files[0])}
            />
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Expense
          </button>
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded"
          >
            &#8681; {/* Download icon */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntry;
