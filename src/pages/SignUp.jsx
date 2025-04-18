import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/server/signup`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token and userID in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userID', user._id);

      setError('');
      navigate('/'); // redirect to home
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error('Sign Up Error:', err);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181923] to-[#343656] flex items-center justify-center px-4'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-3xl font-bold text-white text-center mb-6'>Sign Up</h2>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-300 mb-1'>Full Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your full name'
            />
          </div>
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
          <div>
            <label className='block text-gray-300 mb-1'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Confirm your password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Sign Up
          </button>
        </form>
        <p className='text-gray-400 text-center mt-4'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-400 hover:underline'>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
