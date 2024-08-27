import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import { CgProfile } from 'react-icons/cg';
import BudgetLimit from './BudgetLimit';
import fetchUser from '../utils/fetchUser'; // Adjust the path if necessary
import ProfileModal from './ProfileModal'; // Adjust the path if necessary
import userDetails from '../utils/userDetails'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProfileClick = async () => {
    try {
      const userData = await fetchUser(); // Fetch user data
      const detailedUserData = await userDetails(userData.id); // Fetch detailed user data
      setUser(detailedUserData);
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleHomeClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 flex-wrap">
      <div className="flex items-center flex-grow md:flex-grow-0">
        <button className="p-2 mr-4 bg-gray-200 rounded">
          <FaBars />
        </button>
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <button className="mr-4 rounded">
          <BudgetLimit />
        </button>
        <button
          className="p-2 mr-4 bg-blue-200 rounded"
          onClick={handleHomeClick} // Add the onClick handler
        >
          <GoHomeFill size={30} />
        </button>
        <button
          className="p-2 mr-4 bg-blue-200 rounded flex gap-3 items-center"
          onClick={handleProfileClick}
        >
          <CgProfile size={30} />
        </button>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <ProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          user={user} 
        />
      )}
    </header>
  );
};

export default Header;
