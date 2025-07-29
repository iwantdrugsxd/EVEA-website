// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import global styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import './App.css';

// Initialize AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
  offset: 100,
  delay: 0,
  anchorPlacement: 'top-bottom'
});

// Refresh AOS on route changes (for SPAs)
AOS.refresh();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measuring
reportWebVitals();