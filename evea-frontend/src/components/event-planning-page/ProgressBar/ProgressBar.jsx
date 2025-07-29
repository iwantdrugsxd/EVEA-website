// src/pages/EventPlanningPage/components/shared/ProgressBar/ProgressBar.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep, totalSteps, stepName, onBack }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-content">
        <div className="progress-bar-header">
          <div className="progress-info">
            <div className="step-counter">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="step-name">
              {stepName}
            </div>
          </div>
          
          {onBack && (
            <button 
              onClick={onBack}
              className="back-button"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
        
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="progress-shine"></div>
          </div>
        </div>
        
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`progress-step ${
                index < currentStep ? 'completed' : 
                index === currentStep ? 'current' : 'upcoming'
              }`}
            >
              <div className="step-circle">
                {index < currentStep ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;