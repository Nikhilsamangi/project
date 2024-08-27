import PropTypes from 'prop-types';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full m-4 sm:w-3/4 md:w-1/3 lg:w-1/3 xl:w-1/4 mt-16 mr-8">
        <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
        <ul className="list-none mb-4">
          <li><strong>{user?.name}</strong></li>
          <li><strong>{user?.email}</strong></li>
          <li><strong>{user?.mobile}</strong></li>
          <li><strong>Role:</strong> {user?.role}</li>
          <li>
            <Link to="/login" className='flex items-center gap-2 mt-6 font-bold text-red-400 border border-zinc-50 bg-black p-3 cursor-pointer w-28 hover:bg-white hover:text-red-700'>
              <RiLogoutCircleRLine />Logout
            </Link>
          </li>
        </ul>
        <button onClick={onClose} className="bg-blue-500 text-white py-2 px-4 rounded mt-3">
          Close
        </button>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default ProfileModal;
