// utils/fetchUser.js
import axios from 'axios';
import Cookies from 'js-cookie';

const userDetails = async (userId) => {
  try {
    const token = Cookies.get('accessToken');
    const response = await axios.get(`http://localhost:5001/api/users/${userId}/user`, {
      headers: {
        AuthToken: token,
      },
    });
    
    return response.data; // Return user data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// /role
export default userDetails;

