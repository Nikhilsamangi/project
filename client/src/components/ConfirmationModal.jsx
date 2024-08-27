import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, user, newRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Role Change</h2>
        <p>
          Are you sure you want to change the role of <strong>{user.name}</strong> to{' '}
          <strong>{newRole}</strong>?
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
