// pages/VendorRegistrationPage/VendorRegistrationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CheckCircle, Clock, ArrowLeft, Heart } from 'lucide-react';

// Import registration steps
import VendorRegistrationStep1 from '../../components/VendorRegistration/VendorRegistrationStep1';
import VendorRegistrationStep2 from '../../components/VendorRegistration/VendorRegistrationStep2';
import VendorRegistrationStep3 from '../../components/VendorRegistration/VendorRegistrationStep3';

// Import hooks and services
import { useVendorRegistration } from '../../hooks/useVendorRegistration';
import { toast } from 'react-toastify';

import './VendorRegistrationPage.css';

const VendorRegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const {
    isLoading,
    error,
    vendorId,
    handleStep1,
    handleStep2,
    handleStep3,
    clearError
  } = useVendorRegistration();

  const totalSteps = 3;

  // Auto-redirect countdown after successful registration
  useEffect(() => {
    if (registrationComplete && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (registrationComplete && redirectCountdown === 0) {
      navigate('/vendor-login');
    }
  }, [registrationComplete, redirectCountdown, navigate]);

  // Clear errors when step changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [currentStep, clearError]);

  // Handle step navigation
  const handleNext = async (formData) => {
    try {
      if (currentStep === 1) {
        await handleStep1(formData);
        setCurrentStep(2);
        toast.success('Step 1 completed successfully!');
      } else if (currentStep === 2) {
        await handleStep2(formData);
        setCurrentStep(3);
        toast.success('Documents uploaded successfully!');
      } else if (currentStep === 3) {
        await handleStep3(formData);
        setRegistrationComplete(true);
        toast.success('Registration completed successfully!');
      }
    } catch (err) {
      console.error('Registration step error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToLogin = () => {
    navigate('/vendor-login');
  };

  // Progress bar component
  const renderProgressBar = () => (
    <div className="progress-section">
      <div className="progress-header">
        <h1 className="progress-title">Become a Vendor Partner</h1>
        <p className="progress-subtitle">Join our premium network and grow your business</p>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-line">
            <div 
              className="progress-line-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep > step ? 'completed' : currentStep === step ? 'active' : ''}`}>
                {currentStep > step ? <Check size={20} /> : step}
              </div>
              <div className="step-label">
                {step === 1 && 'Business Information'}
                {step === 2 && 'Verification & Documents'}
                {step === 3 && 'Services & Pricing'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Success step component
  const renderSuccessStep = () => (
    <div className="success-animation">
      <CheckCircle size={80} className="success-icon" />
      <h2 className="success-title">Registration Submitted Successfully!</h2>
      <p className="success-message">
        Thank you for joining EVEA! Your vendor registration has been submitted and is now under review.
      </p>
      
      <div className="success-next-steps">
        <h3 className="next-steps-title">What Happens Next?</h3>
        <ul className="next-steps-list">
          <li>Our team will review your application within 2-3 business days</li>
          <li>We'll verify your documents and business information</li>
          <li>You'll receive an email notification once your account is approved</li>
          <li>After approval, you can access your vendor dashboard</li>
          <li>Start receiving bookings and grow your business with EVEA</li>
        </ul>
      </div>

      {/* Auto-redirect notification */}
      <div className="redirect-notification">
        <div className="redirect-info">
          <Clock size={20} />
          <span>Redirecting to login page in {redirectCountdown} seconds...</span>
        </div>
        <div className="redirect-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${((5 - redirectCountdown) / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="success-buttons">
        <button 
          className="success-btn primary"
          onClick={handleGoToLogin}
        >
          Go to Login Now
        </button>
        <Link to="/" className="success-btn secondary">
          Return to Homepage
        </Link>
      </div>
    </div>
  );

  // Error display component
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="error-banner">
        <div className="error-content">
          <h4>Registration Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-sm btn-secondary"
            onClick={clearError}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  // Current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VendorRegistrationStep1
            onNext={handleNext}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <VendorRegistrationStep2
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <VendorRegistrationStep3
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  // Show success page if registration is complete
  if (registrationComplete) {
    return (
      <div className="vendor-registration-page">
        <div className="registration-background">
          <div className="registration-gradient"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="registration-container">
          <div className="registration-wrapper">
            {renderSuccessStep()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-registration-page">
      {/* Background Elements */}
      <div className="registration-background">
        <div className="registration-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <div className="registration-header">
        <div className="header-container">
          <Link to="/" className="registration-logo">
            <Heart className="heart-icon" size={24} />
            <span>EVEA</span>
          </Link>
          <Link to="/" className="header-back">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="registration-container">
        <div className="registration-wrapper">
          {/* Progress Section */}
          {renderProgressBar()}

          {/* Error Display */}
          {renderError()}

          {/* Step Content */}
          <div className="step-content-wrapper">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationPage;



// hooks/useVendorRegistration.js (Updated version)
