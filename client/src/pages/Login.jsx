import React, { useState } from 'react';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { CiLock } from 'react-icons/ci';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/login/', {
        username,
        password,
      });
      const { accessToken } = response.data;
      
      // Set the access token in a cookie with a longer expiration time (30 days)
      Cookies.set('accessToken', accessToken, { expires: 30 });

      // Verify the token and console log user data
      const userResponse = await axios.get('http://localhost:5001/api/users/current/', {
        headers: {
          authToken: accessToken
        }
      });
      // localStorage.setItem("isAdmin", role === "admin" ? "true" : "false");
// navigate('/sign-up')

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center mx-auto h-full gap-8 w-full">
        <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-2xl font-bold leading-tight tracking-tight text-center">
              Log in to your account
            </p>
            {errorMessage && (
              <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-4">
                {errorMessage}
              </div>
            )}
            <div className="relative">
              <input
                placeholder="Username"
                className="bg-white border border-black sm:text-sm block w-full pl-10 p-4 input-placeholder-black-bold text-black font-semibold"
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                autoComplete="username"
              />
            </div>
            <div className="relative text-black">
              <input
                className="bg-white border border-black sm:text-sm block w-full pl-10 p-4 input-placeholder-black-bold text-black font-semibold"
                placeholder="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
              <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-semibold size-6" />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 mt-6 px-4 py-2 bg-yellow-500 rounded-full hover:bg-yellow-600 font-semibold justify-center w-full"
            >
              <span className="ml-auto text-lg">Log In</span>
              <FaArrowRight className="border p-2 bg-white rounded-full w-12 h-12 text-right ml-auto border-black" />
            </button>
            {/* <p className="font-bold text-center">Or continue with</p>
            <div className="flex gap-12 justify-center">
              <button
                type="button"
                className="text-2xl border p-2 bg-white rounded-full w-12 h-12 shadow-lg shadow-indigo-500/40"
              >
                <FcGoogle />
              </button>
              <button
                type="button"
                className="text-2xl border p-2 bg-white rounded-full w-12 h-12 text-center shadow-lg shadow-indigo-500/40"
              >
                <FaGithub />
              </button>
            </div> */}
            <p className="font-bold mt-8 text-center">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="text-sm text-blue-800 hover:underline mt-4 font-bold"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;