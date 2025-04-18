import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userID, setUserID] = useState(null);

  // Decode the JWT to get the userID
  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUserID(decodedToken.userID); // Extract and set the userID
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Failed to decode user information. Please log in again.');
      }
    }
  }, []);

  // Fetch emotional levels and generate challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!userID) return; // Wait until userID is set
      setLoading(true);
      setError('');

      try {
        // Check if challenges are already saved locally and are still valid
        const savedChallenges = JSON.parse(localStorage.getItem('dailyChallenges'));
        const lastGenerated = localStorage.getItem('lastGenerated');
        const now = new Date();

        if (savedChallenges && lastGenerated && new Date(lastGenerated).toDateString() === now.toDateString()) {
          setChallenges(savedChallenges);
          setCompletedChallenges(JSON.parse(localStorage.getItem('completedChallenges')) || []);
          setLoading(false);
          return;
        }

        // Fetch emotional levels from the backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/levels?ID=${userID}`);
        const levels = response.data;

        if (levels.length === 0) {
          setError('No emotional levels found. Please complete a quiz or journal entry.');
          setLoading(false);
          return;
        }

        // Use the latest emotional levels to generate challenges
        const latestLevels = levels[levels.length - 1]; // Get the most recent emotional levels
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Based on the following emotional levels, generate 5 daily challenges to help improve the user's well-being. 
          Emotional levels: ${JSON.stringify(latestLevels)}. 
          Only return the challenges in a JSON array format like this:
          [
            "Challenge 1",
            "Challenge 2",
            "Challenge 3",
            "Challenge 4",
            "Challenge 5"
          ]`,
        });

        const raw = aiResponse?.response?.text || aiResponse?.text;
        const clean = raw.replace(/```json|```/g, '').trim();
        const generatedChallenges = JSON.parse(clean);

        // Save challenges and timestamp locally
        localStorage.setItem('dailyChallenges', JSON.stringify(generatedChallenges));
        localStorage.setItem('lastGenerated', now.toISOString());
        localStorage.setItem('completedChallenges', JSON.stringify([])); // Reset completed challenges

        setChallenges(generatedChallenges);
        setCompletedChallenges([]);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to generate daily challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userID]);

  // Mark a challenge as completed
  const markAsCompleted = (index) => {
    const updatedCompletedChallenges = [...completedChallenges, index];
    setCompletedChallenges(updatedCompletedChallenges);
    localStorage.setItem('completedChallenges', JSON.stringify(updatedCompletedChallenges));
  };

  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] h-screen flex flex-col justify-baseline items-center p-6'>
      <h1 className='my-5 text-white text-4xl'>Daily Challenges</h1>

      {loading ? (
        <p className='text-gray-400'>Loading challenges...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-white text-2xl mb-4'>Your Challenges for Today</h2>
          <ul className='space-y-4'>
            {challenges.map((challenge, index) => (
              <li
                key={index}
                className={`bg-gray-700 p-4 rounded-md text-white flex justify-between items-center ${
                  completedChallenges.includes(index) ? 'opacity-50 line-through' : ''
                }`}
              >
                <span>{challenge}</span>
                {!completedChallenges.includes(index) && (
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300'
                    onClick={() => markAsCompleted(index)}
                  >
                    Complete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}