import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useAuth0 } from '@auth0/auth0-react'; // Auth0 for authentication
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icon library

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };
  const LogoutButton = () => {
    const { logout } = useAuth0();
  
    return (
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
    );
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/entries', label: 'Entries' },
    { path: '/daily', label: 'Daily Challenges' },
    { path: '/help', label: 'Help' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/graphs', label: 'Graphs' },
    { path: '/about', label: 'About' },
  ];

  return (
    <div className='header bg-zinc-900 bg-opacity-50 backdrop-blur-md py-4 px-5 w-full flex justify-between items-center relative'>
      {/* Logo */}
      <div className='flex gap-2 items-center'>
        <Link to="/">
          <img className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-2xl' src={logo} alt="The Echo Journal Logo" />
        </Link>
        <h1 className='text-white text-xl sm:text-2xl md:text-3xl font-semibold'>
          The Echo Journal
        </h1>
      </div>

      {/* Desktop Nav */}
      <nav className='hidden md:flex gap-4 text-sm sm:text-lg items-center text-white'>
        {isLoggedIn &&
          navLinks.map((link) => (
            <Link key={link.path} to={link.path} className='hover:text-gray-400'>
              {link.label}
            </Link>
          ))}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className='bg-red-500/20 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-600 transition duration-300'
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className='bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'>
              Login
            </button>
          </Link>
        )}
      </nav>

      {/* Mobile Menu Icon */}
      <div className='md:hidden text-white cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className='absolute top-full left-0 w-full bg-zinc-900 bg-opacity-90 backdrop-blur-md flex flex-col items-center py-4 space-y-4 text-white z-50'>
          {isLoggedIn &&
            navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className='hover:text-gray-400'
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className='bg-red-500/20 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300'
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'>
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}