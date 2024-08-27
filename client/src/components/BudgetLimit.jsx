import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoNotifications } from 'react-icons/io5';
import Cookies from 'js-cookie';
import axios from 'axios';
import { calculateTotalAmount } from "../utils/helper";

function BudgetLimit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState('6767');
  const [savedBudget, setSavedBudget] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState([]);
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fetchTotalExpenses = async () => {
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

      // Calculate total amount
      const total = calculateTotalAmount(data);
      setTotalAmount(total);

    } catch (error) {
      console.error('Error fetching total expenses:', error);
      alert('Failed to fetch total expenses. Please try again.');
    }
  };

  useEffect(() => {
    fetchTotalExpenses();
  }, [startDate, endDate]);

  const handleSaveBudget = async () => {
    const limit = parseFloat(budgetLimit);
    if (limit < totalAmount) {
      setNotificationMessage(`Limit ${limit} is less than total expenses (${totalAmount}).`);
      setNotificationVisible(true);
      setNotificationDetails((prev) => [...prev, { message: `Limit ${limit} is less than total expenses (${totalAmount})`, date: new Date() }]);
    } else {
      setSavedBudget(limit);
      setNotificationMessage('Budget limit has been updated.');
      setNotificationVisible(true);
      setNotificationDetails((prev) => [...prev, { message: 'Budget limit has been updated.', date: new Date() }]);
    }

    handleCloseModal();

    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    setNotificationTimeout(setTimeout(() => {
      setNotificationVisible(false);
    }, 3000));

    try {
      const token = Cookies.get('accessToken');
      await axios.post('http://localhost:5001/api/expenses/setBudgetLimit', { limit }, {
        headers: {
          'authToken': token,
        },
      });
    } catch (error) {
      console.error('Error saving budget limit:', error);
    }
  };

  return (
    <div className='flex  items-center justify-center border-fuchsia-950  mt-1'>
      <div className="relative flex items-center justify-center mb-4 mr-4">
        <IoNotifications
          size={30}
          className={`text-2xl ${notificationVisible ? 'text-red-500' : 'text-gray-900'}`}
          onClick={() => setNotificationVisible(true)}
        />
        {notificationVisible && (
          <div className="absolute top-0 right-0 bg-red-500 text-white w-3 h-3 rounded-full flex items-center justify-center text-xs">
            •
          </div>
        )}
      </div>

     

      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Set Budget Limit
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Set Budget Limit</h2>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter budget limit"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {notificationVisible && (
        <div className={`fixed top-4 right-4 bg-green-100 text-black p-4 rounded-md shadow-lg flex flex-col items-start space-y-2 z-50 transition-transform transform ${notificationVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <span className="font-semibold">Notification:</span>
          <p>{notificationMessage}</p>
          <ul className="list-disc pl-5 mt-2">
          {notificationDetails.length > 0 && (
  <ul className="list-disc pl-5 mt-2">
    <li>{`${notificationDetails[0].message} - ${notificationDetails[0].date.toLocaleString()}`}</li>
  </ul>
)}

          </ul>
        </div>
      )}

      
    </div>
  );
}

export default BudgetLimit;
