// evea-frontend/src/components/VendorRegistration/VendorRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VendorRegistrationStep1 from './VendorRegistrationStep1';
import VendorRegistrationStep2 from './VendorRegistrationStep2';
import VendorRegistrationStep3 from './VendorRegistrationStep3';
import RegistrationComplete from './RegistrationComplete';
import { CheckCircle, Clock, FileText, Sparkles } from 'lucide-react';
import './VendorRegistration.css';

const VendorRegistration = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Check if user is already logged in and has completed some steps
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔍 Checking existing registration status:', user);
      
      setVendorId(user.id);
      
      // Set current step based on user's registration status
      if (user.registrationStep === 1) {
        setCurrentStep(2);
        setCompletedSteps([1]);
      } else if (user.registrationStep === 2) {
        setCurrentStep(3);
        setCompletedSteps([1, 2]);
      } else if (user.registrationStep === 3 || user.registrationStatus === 'pending_approval') {
        setCurrentStep(4); // Show completion screen
        setCompletedSteps([1, 2, 3]);
      }
    }
  }, [isAuthenticated, user]);

  const handleStep1Complete = (newVendorId) => {
    console.log('✅ Step 1 completed with vendor ID:', newVendorId);
    setVendorId(newVendorId);
    setCompletedSteps([1]);
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    console.log('✅ Step 2 completed');
    setCompletedSteps([1, 2]);
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    console.log('✅ Step 3 completed - Registration finished');
    setCompletedSteps([1, 2, 3]);
    setCurrentStep(4);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleRegistrationComplete = () => {
    console.log('🎉 Registration process fully completed');
    navigate('/vendor/dashboard');
  };

  const getStepStatus = (step) => {
    if (completedSteps.includes(step)) return 'completed';
    if (currentStep === step) return 'active';
    return 'pending';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VendorRegistrationStep1 
            onNext={handleStep1Complete}
          />
        );
      case 2:
        return (
          <VendorRegistrationStep2 
            vendorId={vendorId}
            onNext={handleStep2Complete}
            onBack={handleBackToStep1}
          />
        );
      case 3:
        return (
          <VendorRegistrationStep3 
            vendorId={vendorId}
            onComplete={handleStep3Complete}
            onBack={handleBackToStep2}
          />
        );
      case 4:
        return (
          <RegistrationComplete 
            onComplete={handleRegistrationComplete}
          />
        );
      default:
        return (
          <VendorRegistrationStep1 
            onNext={handleStep1Complete}
          />
        );
    }
  };

  return (
    <div className="vendor-registration">
      {/* Progress Indicator */}
      <div className="registration-progress">
        <div className="progress-container">
          <div className="step-indicator">
            <div className={`step ${getStepStatus(1)}`}>
              <div className="step-circle">
                {getStepStatus(1) === 'completed' ? (
                  <CheckCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div className="step-content">
                <span className="step-title">Business Info</span>
                <span className="step-description">Basic details & contact</span>
              </div>
            </div>

            <div className="step-connector">
              <div className={`connector-line ${completedSteps.includes(1) ? 'completed' : ''}`}></div>
            </div>

            <div className={`step ${getStepStatus(2)}`}>
              <div className="step-circle">
                {getStepStatus(2) === 'completed' ? (
                  <CheckCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div className="step-content">
                <span className="step-title">Documents</span>
                <span className="step-description">Upload & verify</span>
              </div>
            </div>

            <div className="step-connector">
              <div className={`connector-line ${completedSteps.includes(2) ? 'completed' : ''}`}></div>
            </div>

            <div className={`step ${getStepStatus(3)}`}>
              <div className="step-circle">
                {getStepStatus(3) === 'completed' ? (
                  <CheckCircle size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>
              <div className="step-content">
                <span className="step-title">Services</span>
                <span className="step-description">Setup & banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="step-content-container">
        {renderCurrentStep()}
      </div>

      {/* Help & Support */}
      <div className="registration-support">
        <div className="support-container">
          <h3>Need Help?</h3>
          <p>
            Our support team is here to assist you with the registration process.
            Contact us at <a href="mailto:vendor-support@evea.com">vendor-support@evea.com</a> 
            or call <a href="tel:+911234567890">+91 12345 67890</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;