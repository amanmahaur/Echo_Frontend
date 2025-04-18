import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown'; // For rendering Markdown

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function bot(ev) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${ev} (keep the response medium length and empathetic add emojies when needed)`,
    });
    return response.text; // Return the response text
  } catch (error) {
    console.error("Error generating content:", error);
    return "Sorry, I couldn't process that. Please try again."; // Fallback message
  }
}

export default function Help() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') {
      setError('Please enter a message.');
      return;
    }
    setInput('');
    setError(''); // Clear error message

    // Add user message to the chat
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Wait for the bot's response
    const botanswer = await bot(input);
    const botMessage = { sender: 'bot', text: botanswer };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] min-h-screen flex flex-col items-center p-4 sm:p-6'>
      <h1 className='text-white text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center'>
        Your Personal Help Bot
      </h1>

      {/* Chat Window */}
      <div className='bg-gray-800 w-full max-w-md sm:max-w-3xl h-[60vh] sm:h-[70vh] rounded-lg shadow-lg flex flex-col p-4 overflow-y-auto'>
        {messages.length === 0 ? (
          <p className='text-gray-400 text-center mt-10'>
            Start a conversation with your help bot!
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Bot className='text-blue-500 w-5 h-5 sm:w-6 sm:h-6 mr-2' />
              )}
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 border border-blue-500'
                } max-w-[75%]`}
              >
                {message.sender === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown> // Render Markdown for bot messages
                ) : (
                  message.text
                )}
              </div>
              {message.sender === 'user' && (
                <User className='text-blue-500 w-5 h-5 sm:w-6 sm:h-6 ml-2' />
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className='w-full max-w-md sm:max-w-3xl flex items-center mt-4'>
        <input
          type='text'
          className='flex-grow p-2 sm:p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-r-lg flex items-center justify-center'
          onClick={handleSend}
        >
          <Send className='w-5 h-5' />
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}