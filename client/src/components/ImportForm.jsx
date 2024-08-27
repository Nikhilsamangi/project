import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const ImportForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('CSV'); // Default to CSV

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const token = Cookies.get('accessToken');
    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' should match the express-fileupload field name

    try {
      const response = await axios.post('http://localhost:5001/api/expenses/import', formData, {
        headers: {
          'authToken': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error importing expenses:', error);
      toast.error('Failed to import expenses');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-center">Import Expenses</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Select Format</label>
          <select
            className="border p-2 rounded bg-white"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <option value="CSV">CSV</option>
            <option value="Excel">Excel</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Browse</label>
          <div className="flex items-center border p-2 rounded bg-white">
            <input
              type="file"
              name="file" // Ensure the name matches the express-fileupload field name
              className="flex-1"
              onChange={handleFileChange}
              accept=".csv, .xlsx, .xls" // Accept both CSV and Excel formats
            />
            <span className="ml-2">&#8681;</span>
          </div>
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded mt-4">
          Import
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ImportForm;
