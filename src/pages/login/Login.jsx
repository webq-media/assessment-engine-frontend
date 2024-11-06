import React, { useState, useEffect } from 'react';
import './login.css';
import { images } from '../../assets/images';
import Header from '../../components/header/Header';
import axios from '../../constants/axiosConfig';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Navigate to the home page if logged in
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error state
    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post('/user/login_check/', { email: username, password });
      
      if (response.data.status === 1) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('str_session_key', response.data.str_session_key);
        console.log("user", response.data);
        message.success("Login successful!"); 
        setUsername(''); 
        setPassword(''); // Clear password field
        navigate('/'); // Navigate to the assessment page
      } else {
        setUsername(''); // Clear username field
        setPassword(''); // Clear password field
        setError("Username or password is invalid"); // Set validation error message
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during login';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className='login-page'>
      <Header className="absolute w-full top-[30px]" />
      <div className="flex login-container">
        {/* Left Section */}
        <div className="w-[45%] login-left flex items-center justify-center lg:pt-[70px]">
          <div className='max-w-[55%]'> 
            <img className='w-full max-w-[469px] h-auto' src={images.Loginbg} alt="Login Background" />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-[55%] bg-white flex items-center justify-center lg:pt-[70px]">
          <div className="">
            <div className='login-head'>
              <h4>Login</h4>
              <h2>Welcome Back!</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 login-form">
              {/* Username Field */}
              <div className='relative'>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <img className='input-svg' src={images.EmailIcon} alt="Email Icon" />
              </div>

              {/* Password Field */}
              <div className='relative'>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img className='input-svg' src={images.PassIcon} alt="Password Icon" />
              </div>
              
              {/* Error Message Display */}
              {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  className={`w-full bg-indigo-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 mt-[10px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
