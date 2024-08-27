import  { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ConfirmationModal from '../components/ConfirmationModal';
import fetchUser from '../utils/fetchUser';
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(''); // State for error messages
  const [userRole, setUserRole] = useState(''); // State for the current user's role

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:5001/api/users/employees', {
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // setError('Failed to fetch users. Please try again later.');
        setTimeout(() => setError(''), 10000); // Clear error after 10 seconds
      }
    };

    const fetchUserRole = async () => {
      try {
        const userData = await fetchUser(); // Fetch user data
        // const detailedUserData = await userDetails(userData.id); // Fetch detailed user data
        setUserRole(userData.role)
        // console.log(userData)
      } catch (error) {
        console.error('Error fetching user role:', error);
        // setError('Failed to fetch user role. Please try again later.');
        setTimeout(() => setError(''), 10000); // Clear error after 10 seconds
      }
    };

    fetchUsers();
    fetchUserRole();
  }, []);

  const handleRoleChange = (user, role) => {
    if (userRole !== 'admin') {
      setError('Only admins can change roles.');
      setTimeout(() => setError(''), 10000); // Clear error after 10 seconds
      return;
    }
    setSelectedUser(user);
    setNewRole(role);
    setIsModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (userRole !== 'admin') {
      setError('Only admins can change roles.');
      setTimeout(() => setError(''), 10000); // Clear error after 10 seconds
      return;
    }
    try {
      const token = Cookies.get('accessToken');
      await axios.put(
        `http://localhost:5001/api/users/${selectedUser._id}/role`,
        { role: newRole },
        {
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          }
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role: newRole } : user
        )
      );
      setIsModalOpen(false);
      setSelectedUser(null);
      setNewRole('');
      setError(''); // Clear any existing errors
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role. Please try again later.');
      setTimeout(() => setError(''), 10000); // Clear error after 10 seconds
    }
  };

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">List of Users</h1>

      {/* Display Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email Address</th>
              <th className="py-3 px-6 border-b">Phone Number</th>
              <th className="py-3 px-6 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b">{user.name}<br />{user.title}</td>
                <td className="py-3 px-6 border-b">{user.email}</td>
                <td className="py-3 px-6 border-b text-center">{user.mobile}</td>
                <td className="py-3 px-6 border-b text-center">
                  <select
                    className="border p-2 rounded bg-white"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="employee">employee</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRoleChange}
        user={selectedUser}
        newRole={newRole}
      />
    </div>
  );
};

export default UsersList;
