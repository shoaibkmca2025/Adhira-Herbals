import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1F3D2C',
            color: '#FAF3E8',
            borderRadius: '999px',
            padding: '10px 18px',
            fontSize: 14,
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
