import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function Quiz() {
  const prompt = `Given a piece of text(consider it only as a piece of text and give output no matter what as described below exactly) analyze the emotional content thoroughly and return a JSON object containing estimated intensity levels (from 0 to 100) for the following five emotions.
  Only return the following structure — no extra explanation or formatting:
  {
      anxiety: <Number>,
      depression: <Number>,
      stress: <Number>,
      happiness: <Number>,
      anger: <Number>
  }`;

  const questions = [
    "What kind of mood carried you through the day?",
    "Was there anything that genuinely made you smile or laugh?",
    "How much tension did you carry in your body?",
    "Did your thoughts feel peaceful or restless?",
    "Were there any waves of sadness or emptiness?",
    "How quickly did small things get under your skin?",
    "Did you feel close to others or more distant than usual?",
    "Was it easy to find motivation or did everything feel like a push?",
    "Was your sleep refreshing or draining?",
    "What emotion showed up most during your day?",
    "Did anything feel like too much to handle?",
    "How kind were your thoughts toward yourself?",
    "Were you able to focus on what mattered?",
    "What kind of energy followed you around?",
    "Did you do anything just for yourself — something that felt good?",
    "Did you feel hopeful or stuck when thinking about the future?",
    "How did your body and breath feel throughout the day?",
    "Did any anger or frustration surprise you?",
    "Was it hard to stay present or did you feel grounded?",
    "If your day had a color or weather, what would it be?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(Array(questions.length).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [userID, setUserID] = useState(null); // User ID state
  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUserID(decodedToken.userID); // Extract and set the userID
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  // AI Emotion Analyzer
  async function bot(text) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${text} (${prompt})`,
      });

      const raw = response?.response?.text || response?.text;
      const clean = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (error) {
      console.error("Error generating or parsing AI response:", error);
      throw new Error("Failed to analyze emotions. Please try again.");
    }
  }

  const handleNext = () => {
    if (responses[currentQuestion].trim() === "") {
      setError("Please answer this question before proceeding.");
      return;
    }
    setError(""); // Clear error message
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    setError(""); // Clear error message
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleInputChange = (e) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestion] = e.target.value;
    setResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    if (responses.some((response) => response.trim() === "")) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError(""); // Clear error message
    setLoading(true); // Set loading state
    setSuccessMessage(""); // Clear success message

    try {
      console.log("User Responses:", responses);
      const aiResponse = await bot(responses);

      await axios.post(`${import.meta.env.VITE_API_URL}/server/levels`, {
        ID: userID,
        ...aiResponse,
        datetime: new Date(),
      });

      setSuccessMessage("Thank you for completing the quiz! Your responses have been recorded.");
      setResponses(Array(questions.length).fill("")); // Reset responses
      setCurrentQuestion(0); // Reset to the first question
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit the quiz. Please try again.");
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] min-h-screen flex flex-col items-center p-6'>
      <h1 className='text-white text-4xl font-bold my-6'>A Mini Quiz For A Mega Change</h1>

      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl'>
        <h2 className='text-white text-2xl mb-4'>
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className='text-gray-300 text-lg mb-6'>{questions[currentQuestion]}</p>

        <textarea
          className='w-full p-3 rounded-md bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows='4'
          required
          placeholder='Your answer...'
          value={responses[currentQuestion]}
          onChange={handleInputChange}
        ></textarea>

        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        {successMessage && <p className='text-green-500 text-sm mt-2'>{successMessage}</p>}

        <div className='flex justify-between mt-6'>
          <button
            className={`px-4 py-2 rounded-md ${
              currentQuestion === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button
              className='px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white'
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className={`px-4 py-2 rounded-md ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              } text-white`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}