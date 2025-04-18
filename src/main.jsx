import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Entries from './pages/Entries';
import DailyChallenges from './pages/DailyChallenges.jsx';
import Help from './pages/Help';
import Quiz from './pages/Quiz';
import About from './pages/About';
import Graphs from './pages/Graphs/Graphs';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';

import { Auth0Provider } from '@auth0/auth0-react';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/entries',
        element: <Entries />,
      },
      {
        path: '/daily',
        element: <DailyChallenges />,
      },
      {
        path: '/help',
        element: <Help />,
      },
      {
        path: '/quiz',
        element: <Quiz />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/graphs',
        element: <Graphs />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path:'signup',
        element:<SignUp/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
     domain="dev-k7ea40aypiwrp57w.us.auth0.com"
     clientId="41Fw6NZHAlp1ksP1g4X2Pu4J0iuSQOnN"
     authorizationParams={{
       redirect_uri: window.location.origin
     }}>

      <RouterProvider router={router} />
  </Auth0Provider>
  </React.StrictMode>

);
