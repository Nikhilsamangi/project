// utils/getToken.js
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

// Define a function to get and decode the access token
export const getUserDetailsFromToken = () => {
  const token = Cookies.get('accessToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return {
      id: decodedToken.sub, // Adjust based on your token structure
      role: decodedToken.role, // Adjust based on your token structure
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
