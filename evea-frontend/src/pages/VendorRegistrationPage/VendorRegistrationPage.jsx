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

// constants/recommendationQuestions.js
export const RECOMMENDATION_QUESTIONS = {
  eventExpertise: [
    {
      id: 'primary_event_types',
      question: 'What types of events do you specialize in?',
      type: 'multiple_choice',
      options: [
        { value: 'wedding', label: 'Weddings', description: 'Traditional & destination weddings' },
        { value: 'corporate', label: 'Corporate Events', description: 'Conferences, team building, launches' },
        { value: 'birthday', label: 'Birthday Parties', description: 'All age groups and themes' },
        { value: 'anniversary', label: 'Anniversaries', description: 'Milestone celebrations' },
        { value: 'religious', label: 'Religious Ceremonies', description: 'Festivals and rituals' },
        { value: 'graduation', label: 'Graduations', description: 'Academic celebrations' }
      ],
      required: true,
      multiple: true
    },
    {
      id: 'guest_capacity_expertise',
      question: 'What guest count ranges do you handle best?',
      type: 'multiple_choice',
      options: [
        { value: 'intimate', label: 'Intimate (1-50 guests)' },
        { value: 'medium', label: 'Medium (51-200 guests)' },
        { value: 'large', label: 'Large (201-500 guests)' },
        { value: 'massive', label: 'Grand (500+ guests)' }
      ],
      required: true,
      multiple: true
    }
  ],
  
  budgetExpertise: [
    {
      id: 'budget_segments',
      question: 'Which budget segments do you cater to?',
      type: 'budget_range',
      options: [
        { value: 'economy', label: 'Budget-Friendly', range: [5000, 50000] },
        { value: 'mid', label: 'Mid-Range', range: [50000, 200000] },
        { value: 'premium', label: 'Premium', range: [200000, 500000] },
        { value: 'luxury', label: 'Luxury', range: [500000, 2000000] }
      ],
      required: true,
      multiple: true
    }
  ],
  
  geographicExpertise: [
    {
      id: 'service_areas',
      question: 'What are your primary service areas?',
      type: 'text',
      placeholder: 'Enter cities you serve (comma separated)',
      required: true
    },
    {
      id: 'cultural_expertise',
      question: 'Which cultural traditions do you specialize in?',
      type: 'multiple_choice',
      options: [
        { value: 'north_indian', label: 'North Indian' },
        { value: 'south_indian', label: 'South Indian' },
        { value: 'bengali', label: 'Bengali' },
        { value: 'punjabi', label: 'Punjabi' },
        { value: 'gujarati', label: 'Gujarati' },
        { value: 'maharashtrian', label: 'Maharashtrian' },
        { value: 'western', label: 'Western' },
        { value: 'international', label: 'International' }
      ],
      multiple: true
    }
  ],
  
  styleExpertise: [
    {
      id: 'aesthetic_styles',
      question: 'What aesthetic styles do you excel in?',
      type: 'multiple_choice',
      options: [
        { value: 'traditional', label: 'Traditional' },
        { value: 'modern', label: 'Modern' },
        { value: 'vintage', label: 'Vintage' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'glamorous', label: 'Glamorous' },
        { value: 'royal', label: 'Royal' },
        { value: 'bohemian', label: 'Bohemian' },
        { value: 'rustic', label: 'Rustic' }
      ],
      multiple: true
    },
    {
      id: 'color_schemes',
      question: 'Which color schemes do you work best with?',
      type: 'multiple_choice',
      options: [
        { value: 'pastels', label: 'Pastels' },
        { value: 'vibrant', label: 'Vibrant Colors' },
        { value: 'monochrome', label: 'Monochrome' },
        { value: 'gold_red', label: 'Gold & Red' },
        { value: 'pink_gold', label: 'Pink & Gold' },
        { value: 'blue_silver', label: 'Blue & Silver' },
        { value: 'multicolor', label: 'Multicolor' }
      ],
      multiple: true
    }
  ],
  
  qualityIndicators: [
    {
      id: 'years_of_experience',
      question: 'How many years of experience do you have in this industry?',
      type: 'number',
      min: 0,
      max: 50,
      required: true
    },
    {
      id: 'response_time',
      question: 'What is your typical response time to client inquiries?',
      type: 'single_choice',
      options: [
        { value: 1, label: 'Within 1 hour' },
        { value: 4, label: 'Within 4 hours' },
        { value: 12, label: 'Within 12 hours' },
        { value: 24, label: 'Within 24 hours' },
        { value: 48, label: 'Within 48 hours' }
      ],
      required: true
    },
    {
      id: 'team_size',
      question: 'What is your typical team size for events?',
      type: 'single_choice',
      options: [
        { value: 'solo', label: 'Solo (Just me)' },
        { value: 'small', label: 'Small team (2-5 people)' },
        { value: 'medium', label: 'Medium team (6-15 people)' },
        { value: 'large', label: 'Large team (15+ people)' }
      ],
      required: true
    }
  ]
};

// hooks/useVendorRegistration.js (Updated version)
import { useState, useCallback } from 'react';
import { registerVendorStep1, uploadVendorDocuments, registerVendorStep3, getRegistrationStatus } from '../services/vendorAPI';

export const useVendorRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorId, setVendorId] = useState(() => {
    return localStorage.getItem('registrationVendorId') || null;
  });
  const [tempToken, setTempToken] = useState(() => {
    return localStorage.getItem('registrationTempToken') || null;
  });

  const handleStep1 = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerVendorStep1(formData);
      
      const newVendorId = response.data.vendorId;
      const newTempToken = response.data.tempToken;
      
      setVendorId(newVendorId);
      setTempToken(newTempToken);
      
      // Store for persistence across page reloads
      localStorage.setItem('registrationVendorId', newVendorId);
      localStorage.setItem('registrationTempToken', newTempToken);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStep2 = useCallback(async (documentsData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
      if (!currentVendorId) {
        throw new Error('Registration session expired. Please start from step 1.');
      }

      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Add text fields
      if (documentsData.registrationNumber) {
        formData.append('registrationNumber', documentsData.registrationNumber);
      }
      if (documentsData.gstNumber) {
        formData.append('gstNumber', documentsData.gstNumber);
      }
      if (documentsData.panNumber) {
        formData.append('panNumber', documentsData.panNumber);
      }
      if (documentsData.bankDetails) {
        formData.append('bankDetails', JSON.stringify(documentsData.bankDetails));
      }

      // Add files
      if (documentsData.files) {
        Object.entries(documentsData.files).forEach(([fileType, file]) => {
          if (file) {
            formData.append(fileType, file);
          }
        });
      }

      const response = await uploadVendorDocuments(currentVendorId, formData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Document upload failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  const handleStep3 = useCallback(async (servicesData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
      if (!currentVendorId) {
        throw new Error('Registration session expired. Please start from step 1.');
      }

      const response = await registerVendorStep3(currentVendorId, servicesData);
      
      // Clear temporary registration data on successful completion
      localStorage.removeItem('registrationVendorId');
      localStorage.removeItem('registrationTempToken');
      setVendorId(null);
      setTempToken(null);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Service registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  const checkRegistrationStatus = useCallback(async () => {
    if (!vendorId) return null;
    
    try {
      const response = await getRegistrationStatus(vendorId);
      return response.data;
    } catch (err) {
      console.error('Failed to check registration status:', err);
      return null;
    }
  }, [vendorId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetRegistration = useCallback(() => {
    setVendorId(null);
    setTempToken(null);
    setError(null);
    localStorage.removeItem('registrationVendorId');
    localStorage.removeItem('registrationTempToken');
  }, []);

  return {
    isLoading,
    error,
    vendorId,
    tempToken,
    handleStep1,
    handleStep2,
    handleStep3,
    checkRegistrationStatus,
    clearError,
    resetRegistration
  };
};