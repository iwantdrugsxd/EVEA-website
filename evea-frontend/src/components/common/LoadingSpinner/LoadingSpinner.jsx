// src/components/common/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  };

  const containerClass = fullScreen 
    ? 'loading-container fullscreen' 
    : 'loading-container inline';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="spinner-icon">
          <Heart className="heart-icon" />
        </div>
        <div className="spinner-ring"></div>
      </div>
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;