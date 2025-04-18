import React from 'react';

export default function About() {
  return (
    <div className='bg-gradient-to-r from-[#181923] to-[#343656] min-h-screen flex flex-col items-center p-6'>
      <h1 className='text-white text-4xl font-bold my-6'>About The Echo Journal</h1>
      <p className='text-gray-300 text-lg text-center max-w-3xl leading-relaxed'>
        The Echo Journal is a personal mental health companion designed to help users reflect, monitor, and take control of their emotional well-being through self-expression and smart insights.
      </p>
      <p className='text-gray-300 text-lg text-center max-w-3xl leading-relaxed mt-4'>
        By combining journal entries, mood check-ins, and daily challenges, the app creates a dynamic view of the user’s mental state — including levels of anxiety, stress, and depression. These insights are visualized through clear, interactive graphs that allow users to track their progress over time.
      </p>

      <h2 className='text-white text-2xl font-semibold mt-8'>Key Features</h2>
      <ul className='text-gray-300 text-lg mt-4 space-y-4 max-w-3xl'>
        <li>📝 <strong>Journal:</strong> Write daily thoughts and emotions through free-form journal entries.</li>
        
        <li>📈 <strong>Emotions Graphs:</strong> Check your mental health levels for a better understanding of  yourself.</li>
        <li>❓ <strong>Quiz Section:</strong> Quick MCQs to assess mental health daily.</li>
        <li>🌟 <strong>Daily Challenges:</strong> Personalized tasks to boost mood and encourage healthy habits.</li>
        <li>🤖 <strong>Chatbot Help:</strong> Instant, empathetic support and suggestions.</li>
{/*         <li>⚠️ <strong>Friend Alerts:</strong> When mental health levels are critical, the app can notify trusted contacts.</li> */}
      </ul>

      <p className='text-gray-300 text-lg text-center max-w-3xl leading-relaxed mt-8'>
        Whether you’re reflecting on your day or seeking support during tough times, The Echo Journal listens, analyzes, and echoes back what matters — helping you make mental wellness a daily habit.
      </p>
    </div>
  );
}
