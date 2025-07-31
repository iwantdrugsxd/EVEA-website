// evea-frontend/src/components/VendorRegistration/VendorRegistrationStep3.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  X,
  CreditCard,
  Building2,
  Sparkles,
  Target,
  IndianRupee
} from 'lucide-react';
import './VendorRegistrationStep3.css';

const VendorRegistrationStep3 = ({ vendorId, onComplete, onBack }) => {
  const { registerStep3 } = useAuth();
  
  const [services, setServices] = useState([{
    title: '',
    category: '',
    description: '',
    eventTypes: [],
    budgetRange: { min: '', max: '' },
    packages: []
  }]);

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get vendor ID with multiple fallback options
  const getVendorId = () => {
    const id = vendorId || 
                localStorage.getItem('registrationVendorId') || 
                sessionStorage.getItem('registrationVendorId');
    
    console.log('🔍 Getting vendor ID in Step 3:', {
      fromProp: vendorId,
      fromLocalStorage: localStorage.getItem('registrationVendorId'),
      fromSessionStorage: sessionStorage.getItem('registrationVendorId'),
      finalId: id
    });
    
    return id;
  };
  
  const finalVendorId = getVendorId();

  // Show error if no vendor ID found
  useEffect(() => {
    if (!finalVendorId) {
      console.error('❌ No vendor ID found in Step 3!');
      setErrors({ 
        submit: 'Session expired. Please start registration again from Step 1.' 
      });
    }
  }, [finalVendorId]);

  // Service categories
  const serviceCategories = [
    'Photography & Videography',
    'Catering Services',
    'Decoration & Design',
    'Entertainment & Music',
    'Venue & Location',
    'Wedding Planning',
    'Transportation',
    'Makeup & Styling',
    'Floral Services',
    'Security Services',
    'Other Services'
  ];

  // Event types
  const eventTypes = [
    'Wedding',
    'Birthday Party',
    'Corporate Event',
    'Anniversary',
    'Baby Shower',
    'Engagement',
    'Festival Celebration',
    'Conference',
    'Product Launch',
    'Social Gathering'
  ];

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedServices[index][parent][child] = value;
    } else {
      updatedServices[index][field] = value;
    }
    setServices(updatedServices);

    // Clear errors
    const errorKey = `service${index}_${field.split('.').pop()}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleEventTypeToggle = (serviceIndex, eventType) => {
    const updatedServices = [...services];
    const currentEventTypes = updatedServices[serviceIndex].eventTypes;
    
    if (currentEventTypes.includes(eventType)) {
      updatedServices[serviceIndex].eventTypes = currentEventTypes.filter(type => type !== eventType);
    } else {
      updatedServices[serviceIndex].eventTypes = [...currentEventTypes, eventType];
    }
    
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, {
      title: '',
      category: '',
      description: '',
      eventTypes: [],
      budgetRange: { min: '', max: '' },
      packages: []
    }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
    }
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate services
    services.forEach((service, index) => {
      if (!service.title.trim()) {
        newErrors[`service${index}_title`] = 'Service title is required';
      }
      if (!service.category) {
        newErrors[`service${index}_category`] = 'Service category is required';
      }
      if (!service.description.trim()) {
        newErrors[`service${index}_description`] = 'Service description is required';
      }
      if (service.eventTypes.length === 0) {
        newErrors[`service${index}_eventTypes`] = 'Select at least one event type';
      }
      if (!service.budgetRange.min || !service.budgetRange.max) {
        newErrors[`service${index}_budget`] = 'Budget range is required';
      } else if (parseInt(service.budgetRange.min) >= parseInt(service.budgetRange.max)) {
        newErrors[`service${index}_budget`] = 'Maximum budget must be greater than minimum';
      }
    });

    // Validate bank details
    if (!bankDetails.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    if (!bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    if (!bankDetails.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(bankDetails.ifscCode.toUpperCase())) {
        newErrors.ifscCode = 'Please enter a valid IFSC code';
      }
    }
    if (!bankDetails.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🎯 Starting Step 3 registration');
    console.log('📊 Services:', services);
    console.log('🏦 Bank Details:', { ...bankDetails, accountNumber: '[HIDDEN]' });
    console.log('👥 Using vendor ID:', finalVendorId);
    
    // CRITICAL: Check vendor ID first
    if (!finalVendorId) {
      setErrors({ 
        submit: 'No vendor ID found. Please start registration from Step 1.' 
      });
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Prepare form data with proper structure
      const submitData = {
        services: services.map(service => ({
          ...service,
          budgetRange: {
            min: parseInt(service.budgetRange.min) || 0,
            max: parseInt(service.budgetRange.max) || 0
          }
        })),
        bankDetails: {
          ...bankDetails,
          ifscCode: bankDetails.ifscCode.toUpperCase()
        }
      };

      console.log('🚀 Calling registerStep3 with:', { vendorId: finalVendorId, submitData });
      
      // Call the registerStep3 function from AuthContext
      const result = await registerStep3(finalVendorId, submitData);
      
      console.log('📡 registerStep3 result:', result);
      
      if (result && result.success) {
        console.log('✅ Step 3 registration completed successfully');
        setSuccessMessage('Registration completed successfully! Your application is now under review.');
        
        // Complete registration after showing success message
        setTimeout(() => {
          if (onComplete && typeof onComplete === 'function') {
            console.log('🔄 Calling onComplete - Registration finished');
            onComplete(); // Signal completion to parent
          } else {
            console.error('⚠️ onComplete function not provided');
            // Fallback navigation
            window.location.href = '/vendor-login?registration=complete';
          }
        }, 2000);
        
      } else {
        const errorMessage = result?.message || 'Registration completion failed';
        console.log('❌ Step 3 registration failed:', errorMessage);
        setErrors({ submit: errorMessage });
      }
      
    } catch (error) {
      console.error('❌ Step 3 registration error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-registration-step3">
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
            <strong>Debug Info:</strong><br/>
            Vendor ID Prop: {vendorId || 'undefined'}<br/>
            localStorage ID: {localStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            Final ID: {finalVendorId || 'undefined'}
          </div>
        )}

        <div className="registration-header">
          <h1>Services & Banking</h1>
          <p>Step 3 of 3: Setup Your Services and Payment Details</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Services Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><Sparkles size={20} /> Your Services</h3>
              <p>Tell us about the services you offer for events</p>
            </div>

            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h4>Service {index + 1}</h4>
                  {services.length > 1 && (
                    <button
                      type="button"
                      className="remove-service-btn"
                      onClick={() => removeService(index)}
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="service-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Service Title *</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className={errors[`service${index}_title`] ? 'error' : ''}
                        placeholder="e.g., Wedding Photography, Catering Services"
                        disabled={loading}
                      />
                      {errors[`service${index}_title`] && (
                        <span className="error-text">{errors[`service${index}_title`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={service.category}
                        onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                        className={errors[`service${index}_category`] ? 'error' : ''}
                        disabled={loading}
                      >
                        <option value="">Select category</option>
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors[`service${index}_category`] && (
                        <span className="error-text">{errors[`service${index}_category`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Service Description *</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      className={errors[`service${index}_description`] ? 'error' : ''}
                      placeholder="Describe your service, what you offer, and what makes you unique"
                      rows="4"
                      disabled={loading}
                    />
                    {errors[`service${index}_description`] && (
                      <span className="error-text">{errors[`service${index}_description`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Event Types *</label>
                    <div className="event-types-grid">
                      {eventTypes.map(eventType => (
                        <label key={eventType} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={service.eventTypes.includes(eventType)}
                            onChange={() => handleEventTypeToggle(index, eventType)}
                            disabled={loading}
                          />
                          <span className="checkbox-text">{eventType}</span>
                        </label>
                      ))}
                    </div>
                    {errors[`service${index}_eventTypes`] && (
                      <span className="error-text">{errors[`service${index}_eventTypes`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Budget Range (INR) *</label>
                    <div className="budget-range">
                      <div className="budget-input">
                        <IndianRupee size={16} />
                        <input
                          type="number"
                          value={service.budgetRange.min}
                          onChange={(e) => handleServiceChange(index, 'budgetRange.min', e.target.value)}
                          placeholder="Minimum"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                      <span className="budget-separator">to</span>
                      <div className="budget-input">
                        <IndianRupee size={16} />
                        <input
                          type="number"
                          value={service.budgetRange.max}
                          onChange={(e) => handleServiceChange(index, 'budgetRange.max', e.target.value)}
                          placeholder="Maximum"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {errors[`service${index}_budget`] && (
                      <span className="error-text">{errors[`service${index}_budget`]}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="add-service-btn"
              onClick={addService}
              disabled={loading || services.length >= 5}
            >
              <Plus size={16} />
              <span>Add Another Service</span>
            </button>
            {services.length >= 5 && (
              <p className="service-limit-note">Maximum 5 services allowed during registration</p>
            )}
          </div>

          {/* Bank Details Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><CreditCard size={20} /> Banking Information</h3>
              <p>Enter your bank details for payment processing</p>
            </div>

            <div className="bank-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Account Holder Name *</label>
                  <input
                    type="text"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                    className={errors.accountHolderName ? 'error' : ''}
                    placeholder="Enter account holder name"
                    disabled={loading}
                  />
                  {errors.accountHolderName && (
                    <span className="error-text">{errors.accountHolderName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Bank Name *</label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    className={errors.bankName ? 'error' : ''}
                    placeholder="Enter bank name"
                    disabled={loading}
                  />
                  {errors.bankName && (
                    <span className="error-text">{errors.bankName}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Account Number *</label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    className={errors.accountNumber ? 'error' : ''}
                    placeholder="Enter account number"
                    disabled={loading}
                  />
                  {errors.accountNumber && (
                    <span className="error-text">{errors.accountNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>IFSC Code *</label>
                  <input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value.toUpperCase())}
                    className={errors.ifscCode ? 'error' : ''}
                    placeholder="Enter IFSC code"
                    maxLength="11"
                    disabled={loading}
                  />
                  {errors.ifscCode && (
                    <span className="error-text">{errors.ifscCode}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  value={bankDetails.branch}
                  onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
                  placeholder="Enter branch name"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="form-section">
            <div className="info-box">
              <h4><Target size={20} /> What Happens Next?</h4>
              <ul>
                <li><strong>Application Review:</strong> Our team will review your application and documents</li>
                <li><strong>Verification Process:</strong> We'll verify your business information and documents</li>
                <li><strong>Approval Notification:</strong> You'll receive an email once your application is approved</li>
                <li><strong>Dashboard Access:</strong> Start managing your services and bookings</li>
                <li><strong>Payment Setup:</strong> Begin receiving payments from customers</li>
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="back-btn"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft size={20} />
              <span>Back to Documents</span>
            </button>

            <button 
              type="submit" 
              className="complete-btn"
              disabled={loading || !finalVendorId}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Completing Registration...</span>
                </div>
              ) : (
                <div className="button-content">
                  <CheckCircle size={20} />
                  <span>Complete Registration</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistrationStep3;