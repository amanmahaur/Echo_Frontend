import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/server/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store JWT token and user ID
      localStorage.setItem('token', token);
      localStorage.setItem('userID', user._id);

      setError('');
      navigate('/'); // Redirect after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181923] to-[#343656] flex items-center justify-center px-4'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-3xl font-bold text-white text-center mb-6'>Login</h2>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-300 mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your email'
            />
          </div>
          <div>
            <label className='block text-gray-300 mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Login
          </button>
        </form>
          <button
            className='my-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Login with Google 
          </button>
        <p className='text-gray-400 text-center mt-4'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-blue-400 hover:underline'>
            Sign Up
          </Link>
          
        </p>
      </div>
    </div>
  );
}
