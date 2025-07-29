import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './EventPlanningPage.css';

// Import components with error handling
let ProgressBar, LandingStep, EventTypeStep, EventDetailsStep, ServiceCategoriesStep, ServiceRequirementsStep;
let VendorSearchStep, VendorComparisonStep, VendorSelectionStep, EventCanvasStep, ReviewStep, CheckoutStep, ConfirmationStep;

try {
  ProgressBar = require('../../components/event-planning-page/ProgressBar/ProgressBar').default;
} catch (e) {
  ProgressBar = () => <div>Progress Bar Loading...</div>;
}

try {
  LandingStep = require('../../components/event-planning-page/LandingStep/LandingStep').default;
} catch (e) {
  LandingStep = ({ nextStep }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>Welcome to EVEA</h1>
      <button onClick={nextStep} style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Start Planning
      </button>
    </div>
  );
}

try {
  EventTypeStep = require('../../components/event-planning-page/EventTypeStep/EventTypeStep').default;
} catch (e) {
  EventTypeStep = ({ nextStep, prevStep, updateEventData }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>Select Event Type</h1>
      <div style={{ display: 'flex', gap: '16px' }}>
        {['Wedding', 'Birthday', 'Corporate', 'Anniversary'].map(type => (
          <button
            key={type}
            onClick={() => { updateEventData('eventType', type); nextStep(); }}
            style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

try {
  EventDetailsStep = require('../../components/event-planning-page/EventDetailsStep/EventDetailsStep').default;
} catch (e) {
  EventDetailsStep = ({ nextStep, prevStep }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>Event Details</h1>
      <button onClick={nextStep} style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Continue
      </button>
    </div>
  );
}

try {
  ServiceCategoriesStep = require('../../components/event-planning-page/ServiceCategoriesStep/ServiceCategoriesStep').default;
} catch (e) {
  ServiceCategoriesStep = ({ nextStep, prevStep }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>Service Categories</h1>
      <button onClick={nextStep} style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Continue
      </button>
    </div>
  );
}

try {
  ServiceRequirementsStep = require('../../components/event-planning-page/ServiceRequirementsStep/ServiceRequirementsStep').default;
} catch (e) {
  ServiceRequirementsStep = ({ nextStep, prevStep }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>Service Requirements</h1>
      <button onClick={nextStep} style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Continue
      </button>
    </div>
  );
}

// Create fallback components for missing ones
const createFallbackStep = (stepName, nextAction = 'Continue') => ({ nextStep, prevStep }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '20px' }}>
    <h1>{stepName}</h1>
    <p style={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>
      This step is currently being developed. Click continue to proceed to the next step.
    </p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button 
        onClick={prevStep} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '2px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <button 
        onClick={nextStep} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        {nextAction}
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

// Try to import remaining components, use fallbacks if they don't exist
try {
  VendorSearchStep = require('../../components/event-planning-page/VendorSearchStep/VendorSearchStep').default;
} catch (e) {
  VendorSearchStep = createFallbackStep('Vendor Search');
}

try {
  VendorComparisonStep = require('../../components/event-planning-page/VendorComparisonStep/VendorComparisonStep').default;
} catch (e) {
  VendorComparisonStep = createFallbackStep('Vendor Comparison');
}

try {
  VendorSelectionStep = require('../../components/event-planning-page/VendorSelectionStep/VendorSelectionStep').default;
} catch (e) {
  VendorSelectionStep = createFallbackStep('Vendor Selection');
}

try {
  EventCanvasStep = require('../../components/event-planning-page/EventCanvasStep/EventCanvasStep').default;
} catch (e) {
  EventCanvasStep = createFallbackStep('Event Canvas');
}

try {
  ReviewStep = require('../../components/event-planning-page/ReviewStep/ReviewStep').default;
} catch (e) {
  ReviewStep = createFallbackStep('Review', 'Proceed to Checkout');
}

try {
  CheckoutStep = require('../../components/event-planning-page/CheckoutStep/CheckoutStep').default;
} catch (e) {
  CheckoutStep = createFallbackStep('Checkout', 'Complete Payment');
}

try {
  ConfirmationStep = require('../../components/event-planning-page/ConfirmationStep/ConfirmationStep').default;
} catch (e) {
  ConfirmationStep = ({ goToStep }) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1>🎉 Booking Confirmed!</h1>
      <p>Thank you for choosing EVEA for your event planning needs.</p>
      <button onClick={() => goToStep(0)} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Plan Another Event
      </button>
    </div>
  );
}

const EventPlanningPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState({
    eventType: '',
    eventDetails: {
      name: '',
      date: '',
      time: '',
      location: '',
      guests: '',
      budget: '',
      description: ''
    },
    serviceCategories: [],
    serviceRequirements: {},
    selectedVendors: [],
    comparedVendors: [],
    customizations: {},
    paymentDetails: {}
  });

  const steps = [
    { id: 'landing', name: 'Welcome', component: 'LandingStep' },
    { id: 'event-type', name: 'Event Type', component: 'EventTypeStep' },
    { id: 'details', name: 'Event Details', component: 'EventDetailsStep' },
    { id: 'categories', name: 'Service Categories', component: 'ServiceCategoriesStep' },
    { id: 'requirements', name: 'Service Requirements', component: 'ServiceRequirementsStep' },
    { id: 'search', name: 'Vendor Search', component: 'VendorSearchStep' },
    { id: 'comparison', name: 'Vendor Comparison', component: 'VendorComparisonStep' },
    { id: 'selection', name: 'Vendor Selection', component: 'VendorSelectionStep' },
    { id: 'canvas', name: 'Event Canvas', component: 'EventCanvasStep' },
    { id: 'review', name: 'Review', component: 'ReviewStep' },
    { id: 'checkout', name: 'Checkout', component: 'CheckoutStep' },
    { id: 'confirmation', name: 'Confirmation', component: 'ConfirmationStep' }
  ];

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Data update functions
  const updateEventData = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEventDetails = (field, value) => {
    setEventData(prev => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        [field]: value
      }
    }));
  };

  const updateServiceRequirements = (serviceId, requirements) => {
    setEventData(prev => ({
      ...prev,
      serviceRequirements: {
        ...prev.serviceRequirements,
        [serviceId]: requirements
      }
    }));
  };

  const addSelectedVendor = (vendor) => {
    setEventData(prev => ({
      ...prev,
      selectedVendors: [...prev.selectedVendors, vendor]
    }));
  };

  const removeSelectedVendor = (vendorId) => {
    setEventData(prev => ({
      ...prev,
      selectedVendors: prev.selectedVendors.filter(v => v.id !== vendorId)
    }));
  };

  // Component props object
  const stepProps = {
    eventData,
    updateEventData,
    updateEventDetails,
    updateServiceRequirements,
    addSelectedVendor,
    removeSelectedVendor,
    nextStep,
    prevStep,
    goToStep,
    currentStep,
    totalSteps: steps.length
  };

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <LandingStep {...stepProps} />;
      case 1: return <EventTypeStep {...stepProps} />;
      case 2: return <EventDetailsStep {...stepProps} />;
      case 3: return <ServiceCategoriesStep {...stepProps} />;
      case 4: return <ServiceRequirementsStep {...stepProps} />;
      case 5: return <VendorSearchStep {...stepProps} />;
      case 6: return <VendorComparisonStep {...stepProps} />;
      case 7: return <VendorSelectionStep {...stepProps} />;
      case 8: return <EventCanvasStep {...stepProps} />;
      case 9: return <ReviewStep {...stepProps} />;
      case 10: return <CheckoutStep {...stepProps} />;
      case 11: return <ConfirmationStep {...stepProps} />;
      default: return <LandingStep {...stepProps} />;
    }
  };

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Load saved data only after component mounts and loading is complete
  useEffect(() => {
    if (!isLoading) {
      const savedData = localStorage.getItem('evea-event-planning-data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setEventData(parsedData);
          
          // If there's saved progress, move to appropriate step
          if (parsedData.eventType && currentStep === 0) {
            setCurrentStep(1);
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
          localStorage.removeItem('evea-event-planning-data');
        }
      }
    }
  }, [isLoading, currentStep]);

  // Auto-save functionality (debounced)
  useEffect(() => {
    if (!isLoading && currentStep > 0) {
      const saveData = setTimeout(() => {
        localStorage.setItem('evea-event-planning-data', JSON.stringify(eventData));
      }, 1000);

      return () => clearTimeout(saveData);
    }
  }, [eventData, isLoading, currentStep]);

  // Show loading state briefly to prevent content flash
  if (isLoading) {
    return (
      <div className="event-planning-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your event planning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-planning-page">
      {/* Progress Bar - Hidden on landing and confirmation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <ProgressBar 
          currentStep={currentStep - 1} // Adjust for landing step
          totalSteps={steps.length - 2} // Exclude landing and confirmation
          stepName={steps[currentStep]?.name}
        />
      )}

      {/* Main Content Area */}
      <div className={`step-container step-${currentStep} ${currentStep > 0 && currentStep < steps.length - 1 ? 'with-progress' : ''}`}>
        <div className="step-transition-wrapper">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel">
          <h4>Debug Panel</h4>
          <p>Current Step: {currentStep} ({steps[currentStep]?.name})</p>
          <p>Event Type: {eventData.eventType || 'Not selected'}</p>
          <p>Services: {eventData.serviceCategories.length}</p>
          <p>Selected Vendors: {eventData.selectedVendors.length}</p>
          <div className="debug-buttons">
            {steps.map((step, index) => (
              <button 
                key={step.id}
                onClick={() => goToStep(index)}
                className={currentStep === index ? 'active' : ''}
                title={step.name}
              >
                {index}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPlanningPage;