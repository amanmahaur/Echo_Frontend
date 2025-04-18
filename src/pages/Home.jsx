import React from 'react'
import {jwtDecode} from 'jwt-decode'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import home from '../assets/home.png'
export default function Home() {
  const [userID, setUserID] = React.useState(null)
  const [name, setName] = React.useState('')
  useEffect(() => {
    const token = localStorage.getItem('token') // Assuming the JWT is stored in localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token) // Decode the token
        setName(decodedToken.name) // Extract and set the name
        setUserID(decodedToken.userID) // Extract and set the userID
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])
  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181923] to-[#343656] flex flex-col justify-center items-center'>
      <div className='flex flex-col justify-center items-center text-center px-4'>
        <h1 className='mt-40 my-10 animate-pulse hover:animate-none cursor-pointer text-white text-6xl md:text-8xl py-10'>Hello {name} !</h1>
        <h1 className='my-4 text-white text-3xl md:text-4xl lg:text-5xl'>
          Your Mental Peace In Your Hands
        </h1>
        <h1 className='my-4 text-gray-300/80 text-2xl md:text-4xl lg:text-6xl'>
          Start Journaling And See Changes
        </h1>

      </div>
      <div className='flex mx-auto my-50 justify-center items-center'>
        <Link to='/entries'>
        <img className=' w-[800px] h-[400px] rounded-2xl' src={home} alt="image" />
        </Link>
      </div>
    </div>
  )
}
