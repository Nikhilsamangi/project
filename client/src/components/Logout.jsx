
import { useNavigate } from 'react-router-dom';
export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage or session storage
    // localStorage.removeItem('isAdmin');
    // localStorage.removeItem('token'); // Assuming you have stored a token
    // Add any other necessary cleanup

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button 
          onClick={handleLogout} 
          className="p-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
  );
}
