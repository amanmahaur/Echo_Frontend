import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

export default function Graphs() {
  const [levels, setLevels] = useState([]);
  const [userID, setUserID] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Get user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserID(decodedToken.userID);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch emotion levels
  useEffect(() => {
    const fetchLevels = async () => {
      if (!userID) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/levels?ID=${userID}`);
        setLevels(response.data);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchLevels();
  }, [userID]);

  // Delete selected level
  const deleteLevel = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/server/levels/${id}`);
      setLevels(levels.filter((level) => level._id !== id));
      setSelectedLevel(null);
    } catch (error) {
      console.error('Error deleting level:', error);
      alert('Failed to delete the level. Please try again.');
    }
  };

  // Select a point from the chart
  const handlePointClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedLevel = data.activePayload[0].payload;
      setSelectedLevel(clickedLevel);
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] min-h-screen flex flex-col items-center px-4 py-8'>
      <h2 className='text-white text-4xl mb-8'>Emotion Levels Over Time</h2>

      <div className="w-full max-w-5xl min-w-[300px]">
        {levels.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={levels} onClick={handlePointClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="datetime"
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Date: ${new Date(label).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="anxiety" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="depression" stroke="#82ca9d" />
                <Line type="monotone" dataKey="stress" stroke="#ffc658" />
                <Line type="monotone" dataKey="happiness" stroke="#00c49f" />
                <Line type="monotone" dataKey="anger" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>

            {selectedLevel && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                <div className='bg-gray-800 p-6 rounded-md text-white w-full max-w-md'>
                  <h2 className='text-xl font-bold mb-4'>Selected Entry</h2>
                  <p>
                    <strong>Date:</strong> {new Date(selectedLevel.datetime).toLocaleString()}
                  </p>
                  <p className='mt-2 space-y-1'>
                    <strong>Anxiety:</strong> {selectedLevel.anxiety}<br />
                    <strong>Depression:</strong> {selectedLevel.depression}<br />
                    <strong>Stress:</strong> {selectedLevel.stress}<br />
                    <strong>Happiness:</strong> {selectedLevel.happiness}<br />
                    <strong>Anger:</strong> {selectedLevel.anger}
                  </p>
                  <div className='flex justify-end mt-6'>
                    <button
                      className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mr-2'
                      onClick={() => deleteLevel(selectedLevel._id)}
                    >
                      Delete
                    </button>
                    <button
                      className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'
                      onClick={() => setSelectedLevel(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className='text-gray-400 text-center'>No data available to display.</p>
        )}
      </div>
    </div>
  );
}
