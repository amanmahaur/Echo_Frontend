import React from 'react'
import logo from './assets/logo.png'
import Header from './header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './footer/Footer'

export default function App() {
  return (
    <>
      {/* Transparent Scrollbar Styling */}
       <style>
        {`
          ::-webkit-scrollbar {
            display: none; /* Hide the scrollbar */
          }

          /* For Firefox */
          html {
            scrollbar-width: none; /* Hide the scrollbar */
          }

          /* For IE and Edge */
          -ms-overflow-style: none; /* Hide the scrollbar */
        `}
      </style>
      <div className='bg-zinc-800 w-screen h-screen'>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}
