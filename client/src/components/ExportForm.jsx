import { useState } from 'react';

import { handleExport } from '../utils/exportUtils'; 
function ExportForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('csv');

  const onExportClick = () => {
    handleExport(startDate, endDate, format);
  };


  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Export Data</h1>
      <label className="block mb-2">
        <span className="text-gray-700">Start Date:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">End Date:</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Format:</span>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
        </select>
      </label>
      <button
        onClick={onExportClick }
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Export
      </button>
    </div>
  );
}

export default ExportForm;
