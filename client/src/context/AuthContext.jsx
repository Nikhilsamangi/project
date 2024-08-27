import  { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5001/api/users/current/', {
            headers: { AuthToken: token }
          });
          setAuth(response.data);
        } catch (error) {
          setAuth(null);
        }
      } else {
        setAuth(null);
      }
    };

    fetchAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/login/', { username, password });
      const { accessToken } = response.data;
      Cookies.set('accessToken', accessToken, { expires: 30 });
      const userResponse = await axios.get('http://localhost:5001/api/users/current/', {
        headers: { AuthToken: accessToken }
      });
      setAuth(userResponse.data);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
