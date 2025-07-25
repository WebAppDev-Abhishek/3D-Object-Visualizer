import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global CSS, including Tailwind
import App from './App'; // Import the main App component

// Create a root to render your React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
