import React, { useState, useEffect } from 'react';
import { Pen, Trash2, Eye } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false); // State for Add Entry button loader

  const prompt = `Given a piece of text (consider it only as a piece of text and give output no matter what as described below exactly) analyze the emotional content thoroughly and return a JSON object containing estimated intensity levels (from 0 to 100) for the following five emotions.
Only return the following structure — no extra explanation or formatting:
{
  anxiety: <Number>,
  depression: <Number>,
  stress: <Number>,
  happiness: <Number>,
  anger: <Number>
}`;

  // AI Emotion Analyzer
  async function bot(text) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${text} (${prompt})`,
      });

      const raw = response?.text;
      const clean = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (error) {
      console.error("Error generating or parsing AI response:", error);
      return null;
    }
  }

  // Decode token and fetch entries
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const decodedToken = jwtDecode(token);
        const id = decodedToken.userID;
        setUserID(id);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/entries?ID=${id}`);
        setEntries(response.data);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to load entries.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const addEntry = async () => {
    if (newEntry.trim() === '') return;

    setIsAdding(true); // Start loader
    try {
      const datetime = new Date();
      const aiResponse = await bot(newEntry);

      if (aiResponse) {
        await axios.post(`${import.meta.env.VITE_API_URL}/server/levels`, {
          ID: userID,
          ...aiResponse,
          datetime,
        });
      }

      const entryRes = await axios.post(`${import.meta.env.VITE_API_URL}/server/entries`, {
        ID: userID,
        journalentry: newEntry,
        datetime,
      });

      setEntries([...entries, entryRes.data]);
      setNewEntry('');
    } catch (err) {
      console.error('Error adding entry:', err);
      alert('Failed to add entry. Please try again.');
    } finally {
      setIsAdding(false); // Stop loader
    }
  };

  const deleteEntry = async (id) => {
    window.confirm('Are you sure you want to delete this entry? This action cannot be undone.');
    if (!window.confirm) return; // If user cancels, do nothing
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/server/entries/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] min-h-screen flex flex-col items-center p-4'>
      <div className='flex items-center gap-2 mb-6'>
        <h1 className='text-white text-4xl'>Start Journaling</h1>
        <Pen size='24' color='white' className='animate-bounce' />
      </div>

      <div className='w-full max-w-md mb-6'>
        <textarea
          className='w-full h-[300px] p-2 rounded-md bg-gray-800 text-white resize-none'
          placeholder='Write your journal entry here (Write at least 100 words for proper analysis)...'
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        ></textarea>
        <button
          className={`mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center ${
            isAdding ? 'cursor-not-allowed opacity-75' : ''
          }`}
          onClick={addEntry}
          disabled={isAdding}
        >
          {isAdding ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            'Add Entry'
          )}
        </button>
      </div>

      <div className='w-full max-w-md'>
        {loading ? (
          <p className='text-gray-400 text-center'>Loading entries...</p>
        ) : error ? (
          <p className='text-red-400 text-center'>{error}</p>
        ) : entries.length === 0 ? (
          <p className='text-gray-400 text-center'>No entries yet. Start journaling!</p>
        ) : (
          <ul className='space-y-4'>
            {entries.slice().reverse().map((entry) => (
              <li key={entry._id} className='flex justify-between items-center bg-gray-800 p-4 rounded-md text-white'>
                <span className='truncate'>{new Date(entry.datetime).toLocaleString()}</span>
                <div className='flex gap-2'>
                  <button
                    className='text-blue-400 hover:text-blue-500'
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <Eye size='20' />
                  </button>
                  <button
                    className='text-red-400 hover:text-red-500'
                    onClick={() => deleteEntry(entry._id)}
                  >
                    <Trash2 size='20' />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedEntry && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-gray-900 p-6 rounded-md text-white w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Journal Entry</h2>
            <p className='mb-6 whitespace-pre-wrap'>{selectedEntry.journalentry}</p>
            <button
              className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}