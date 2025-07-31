// evea-frontend/src/pages/VendorRegistrationPage/VendorRegistrationPage.jsx
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
  
  // Add vendorId state to track it properly
  const [vendorId, setVendorId] = useState(() => {
    // Try to get vendor ID from localStorage on component mount
    const storedVendorId = localStorage.getItem('registrationVendorId') || 
                          sessionStorage.getItem('registrationVendorId');
    console.log('🔍 Initial vendor ID from storage:', storedVendorId);
    return storedVendorId;
  });

  const {
    isLoading,
    error,
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
      // Clear registration data before redirecting
      localStorage.removeItem('registrationVendorId');
      sessionStorage.removeItem('registrationVendorId');
      navigate('/vendor-login');
    }
  }, [registrationComplete, redirectCountdown, navigate]);

  // Clear errors when step changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [currentStep, clearError]);

  // Check URL parameters on mount to restore step state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    const vendorIdParam = urlParams.get('vendorId');
    
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 3) {
        console.log('🔄 Restoring step from URL:', step);
        setCurrentStep(step);
      }
    }
    
    if (vendorIdParam && !vendorId) {
      console.log('🔄 Restoring vendor ID from URL:', vendorIdParam);
      setVendorId(vendorIdParam);
      localStorage.setItem('registrationVendorId', vendorIdParam);
    }
  }, [vendorId]);

  // Handle step navigation
  const handleNext = async (formData) => {
    console.log('🎯 HandleNext called for step:', currentStep);
    console.log('📦 FormData received:', typeof formData, formData);
    
    try {
      if (currentStep === 1) {
        // For step 1, formData is the vendorId returned from Step1 component
        const receivedVendorId = formData;
        console.log('✅ Received vendor ID from Step 1:', receivedVendorId);
        
        if (!receivedVendorId) {
          throw new Error('Vendor ID not received from Step 1');
        }
        
        // Store vendor ID in both state and storage
        setVendorId(receivedVendorId);
        localStorage.setItem('registrationVendorId', receivedVendorId);
        sessionStorage.setItem('registrationVendorId', receivedVendorId);
        
        // Update URL to reflect current step
        const newUrl = `${window.location.pathname}?step=2&vendorId=${receivedVendorId}`;
        window.history.replaceState({}, '', newUrl);
        
        setCurrentStep(2);
        toast.success('Step 1 completed successfully!');
        
      } else if (currentStep === 2) {
        // For step 2, documents are already uploaded by the Step2 component
        // Just move to step 3 without calling handleStep2
        console.log('✅ Step 2 documents already uploaded, moving to Step 3');
        
        // Update URL
        const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
        const newUrl = `${window.location.pathname}?step=3&vendorId=${currentVendorId}`;
        window.history.replaceState({}, '', newUrl);
        
        setCurrentStep(3);
        toast.success('Documents uploaded successfully!');
        
      } else if (currentStep === 3) {
        // For step 3, services are already submitted by the Step3 component
        // Complete the registration process
        console.log('✅ Step 3 services already submitted, completing registration');
        
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
        
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
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Update URL
      const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
      if (currentVendorId) {
        const newUrl = `${window.location.pathname}?step=${newStep}&vendorId=${currentVendorId}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  };

  const handleGoToLogin = () => {
    // Clear registration data
    localStorage.removeItem('registrationVendorId');
    sessionStorage.removeItem('registrationVendorId');
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

  // Error banner component
  const renderErrorBanner = () => {
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

  // Current step content - FIXED TO PASS VENDOR ID PROPERLY
  const renderCurrentStep = () => {
    // Always use the most up-to-date vendor ID
    const currentVendorId = vendorId || 
                           localStorage.getItem('registrationVendorId') || 
                           sessionStorage.getItem('registrationVendorId');
    
    console.log('🔍 Rendering step:', currentStep, 'with vendor ID:', currentVendorId);
    
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
            vendorId={currentVendorId} // Pass the current vendor ID
            onNext={handleNext}
            onBack={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <VendorRegistrationStep3
            vendorId={currentVendorId} // Pass the current vendor ID
            onComplete={handleNext} // Use handleNext as onComplete for step 3
            onBack={handlePrevious}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <VendorRegistrationStep1
            onNext={handleNext}
            isLoading={isLoading}
          />
        );
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
          <div className="success-animation">
            <CheckCircle size={80} className="success-icon" />
            <h2 className="success-title">Registration Submitted Successfully!</h2>
            <p className="success-message">
              Thank you for joining EVEA! Your vendor registration has been submitted and is now under review.
            </p>
            <div className="success-details">
              <div className="success-step">
                <CheckCircle size={16} />
                <span>Application submitted for review</span>
              </div>
              <div className="success-step">
                <Clock size={16} />
                <span>You'll receive an email notification within 24-48 hours</span>
              </div>
              <div className="success-step">
                <Heart size={16} />
                <span>Welcome to the EVEA vendor community!</span>
              </div>
            </div>
            
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={handleGoToLogin}
              >
                Go to Vendor Login ({redirectCountdown}s)
              </button>
              <Link to="/" className="btn btn-secondary">
                <ArrowLeft size={20} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            background: '#f0f0f0', 
            padding: '10px', 
            margin: '10px 0', 
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <strong>Main Page Debug:</strong><br/>
            Current Step: {currentStep}<br/>
            Vendor ID State: {vendorId || 'undefined'}<br/>
            localStorage ID: {localStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            Registration Complete: {registrationComplete ? 'Yes' : 'No'}
          </div>
        )}
        
        {renderProgressBar()}
        {renderErrorBanner()}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default VendorRegistrationPage;