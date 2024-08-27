import React from 'react';
import ImportForm from '../components/ImportForm';
import ExportForm from '../components/ExportForm';

const ExportImport = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Export & Import</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Export Section */}
        <ExportForm/>

        {/* Import Section */}
       <ImportForm/>
      </div>
    </div>
  );
};

export default ExportImport;
