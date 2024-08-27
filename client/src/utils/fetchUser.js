// utils/fetchUserData.js
import axios from 'axios';
import Cookies from 'js-cookie'

export const fetchUser = async () => {
  
    
  
    try {
      const token =  Cookies.get('accessToken') // Use the helper function to get the token
      const response = await axios.get('http://localhost:5001/api/users/current/', {
        headers: {
          AuthToken: token,
        },
      });
      return response.data; // Return the user data
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message); // Throw error for handling in component
    }
};

export default fetchUser;