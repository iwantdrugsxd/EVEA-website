// VendorRegistrationStep3.jsx - WORKING VERSION WITH PROPER LOGIC
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  X,
  CreditCard,
  Sparkles,
  IndianRupee
} from 'lucide-react';
import './VendorRegistrationStep3.css';

const VendorRegistrationStep3 = ({ vendorId: propVendorId, onComplete, onBack }) => {
  const { registerStep3 } = useAuth();
  const location = useLocation();
  const { vendorId: paramVendorId } = useParams();
  
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

  // ENHANCED vendor ID resolution - keeping original logic but with fallbacks
const finalVendorId = propVendorId || 
                     paramVendorId || 
                     location.state?.vendorId || 
                     localStorage.getItem('registrationVendorId') || 
                     sessionStorage.getItem('registrationVendorId') || 
                     (() => {
                       try {
                         const vendorData = JSON.parse(localStorage.getItem('vendorRegistrationData') || '{}');
                         return vendorData.vendorId || vendorData._id;
                       } catch (e) {
                         return null;
                       }
                     })();

  // Service categories and event types
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

  // FIXED: Add debug logging and loading state timeout
  useEffect(() => {
    console.log('🔍 FORM DEBUG:', {
      loading,
      finalVendorId,
      servicesCount: services.length,
      hasRegisterStep3Function: !!registerStep3
    });

    // Auto-reset loading if stuck for more than 30 seconds
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('⚠️ Loading timeout - force reset');
        setLoading(false);
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [loading, finalVendorId, services.length, registerStep3]);

  // Service change handler with logging
  const handleServiceChange = (index, field, value) => {
    console.log('📝 Service change:', { index, field, value });
    
    const updatedServices = [...services];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedServices[index][parent][child] = value;
    } else {
      updatedServices[index][field] = value;
    }
    setServices(updatedServices);

    // Clear errors
    const errorKey = `service${index}_${field.split('.')[0]}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleEventTypeToggle = (serviceIndex, eventType) => {
    console.log('✅ Event toggle:', { serviceIndex, eventType });
    
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
    console.log('➕ Adding service');
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
    console.log('➖ Removing service:', index);
    if (services.length > 1) {
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
    }
  };

  const handleBankDetailsChange = (field, value) => {
    console.log('🏦 Bank change:', { field, value });
    setBankDetails(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ENHANCED form validation
  const validateForm = () => {
    const newErrors = {};

    if (!finalVendorId) {
      newErrors.submit = 'Vendor ID is missing. Please restart registration.';
      return false;
    }

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

  // FIXED submit handler with proper error handling and logging
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 SUBMIT BUTTON CLICKED');
    console.log('📊 Current state:', {
      loading,
      finalVendorId,
      servicesCount: services.length,
      registerStep3Available: !!registerStep3
    });
    
    // Prevent double submission
    if (loading) {
      console.log('❌ Already submitting, ignoring click');
      return;
    }

    // Validate vendor ID
    if (!finalVendorId) {
      console.error('❌ No vendor ID available');
      setErrors({ submit: 'Vendor ID is missing. Please restart registration.' });
      return;
    }

    // Validate form
    if (!validateForm()) {
      console.log('❌ Form validation failed:', errors);
      return;
    }

    // Check if registerStep3 function exists
    if (!registerStep3 || typeof registerStep3 !== 'function') {
      console.error('❌ registerStep3 function not available');
      setErrors({ submit: 'Registration function not available. Please refresh the page.' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      console.log('📦 Preparing submission data...');
      
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

      console.log('🚀 Calling registerStep3 with:', {
        vendorId: finalVendorId,
        servicesCount: submitData.services.length,
        bankDetailsKeys: Object.keys(submitData.bankDetails)
      });
      
      const result = await registerStep3(finalVendorId, submitData);
      
      console.log('📡 API Result:', result);
      
      if (result && result.success) {
        console.log('✅ Registration successful');
        setSuccessMessage('Registration completed successfully! Your application is now under review.');
        
        // Store completion status
        localStorage.setItem('registrationStep', '3');
        localStorage.setItem('registrationComplete', 'true');
        
        // Call completion callback
        setTimeout(() => {
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          } else {
            console.log('⚠️ No onComplete callback, redirecting...');
            window.location.href = '/vendor/dashboard';
          }
        }, 2000);
        
      } else {
        throw new Error(result?.message || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ Submit error:', error);
      setErrors({ 
        submit: error.message || 'Registration failed. Please check your information and try again.' 
      });
    } finally {
      console.log('🔄 Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="vendor-registration-step3">
      <div className="registration-container">
        {/* Enhanced Debug Panel */}
        <div className="debug-panel">
          <div className="debug-header">🔧 Form Debug Status</div>
          <div className="debug-grid">
            <div>Loading: <span className={loading ? 'status-bad' : 'status-good'}>{loading ? 'YES' : 'NO'}</span></div>
            <div>Vendor ID: <span className={finalVendorId ? 'status-good' : 'status-bad'}>{finalVendorId ? 'Present' : 'Missing'}</span></div>
            <div>Services: <span className="status-info">{services.length}</span></div>
            <div>Register Func: <span className={registerStep3 ? 'status-good' : 'status-bad'}>{registerStep3 ? 'Available' : 'Missing'}</span></div>
          </div>
          {loading && (
            <button 
              onClick={() => setLoading(false)} 
              className="debug-reset-btn"
              type="button"
            >
              🔧 Force Reset Loading
            </button>
          )}
        </div>

        <div className="registration-header">
          <div className="header-content">
            <h1>Services & Bank Details</h1>
            <p>Step 3 of 3: Setup Your Services & Payment Information</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
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
              <h2>
                <Sparkles size={24} />
                Your Services
              </h2>
              <p>Tell us about the services you offer to potential clients</p>
            </div>

            <div className="services-container">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-card-header">
                    <h3>Service {index + 1}</h3>
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="remove-service-btn"
                        disabled={loading}
                        aria-label={`Remove service ${index + 1}`}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="service-form-grid">
                    <div className="form-group">
                      <label htmlFor={`service-title-${index}`}>Service Title*</label>
                      <input
                        id={`service-title-${index}`}
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        placeholder="e.g., Wedding Photography"
                        className={errors[`service${index}_title`] ? 'error' : ''}
                        disabled={loading}
                        required
                      />
                      {errors[`service${index}_title`] && (
                        <span className="error-text">{errors[`service${index}_title`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor={`service-category-${index}`}>Category*</label>
                      <select
                        id={`service-category-${index}`}
                        value={service.category}
                        onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                        className={errors[`service${index}_category`] ? 'error' : ''}
                        disabled={loading}
                        required
                      >
                        <option value="">Select Category</option>
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors[`service${index}_category`] && (
                        <span className="error-text">{errors[`service${index}_category`]}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor={`service-description-${index}`}>Service Description*</label>
                      <textarea
                        id={`service-description-${index}`}
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        placeholder="Describe your service in detail, including what's included and your unique approach..."
                        rows={4}
                        className={errors[`service${index}_description`] ? 'error' : ''}
                        disabled={loading}
                        required
                      />
                      {errors[`service${index}_description`] && (
                        <span className="error-text">{errors[`service${index}_description`]}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <fieldset disabled={loading}>
                        <legend>Event Types* (Select all that apply)</legend>
                        <div className={`event-types-grid ${errors[`service${index}_eventTypes`] ? 'error' : ''}`}>
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
                      </fieldset>
                      {errors[`service${index}_eventTypes`] && (
                        <span className="error-text">{errors[`service${index}_eventTypes`]}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Budget Range* (in INR)</label>
                      <div className="budget-range">
                        <div className="budget-input">
                          <label htmlFor={`budget-min-${index}`} className="budget-label">Minimum</label>
                          <div className="input-with-icon">
                            <IndianRupee size={20} className="currency-icon" />
                            <input
                              id={`budget-min-${index}`}
                              type="number"
                              value={service.budgetRange.min}
                              onChange={(e) => handleServiceChange(index, 'budgetRange.min', e.target.value)}
                              placeholder="5000"
                              min="0"
                              disabled={loading}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="budget-separator">
                          <span>to</span>
                        </div>
                        
                        <div className="budget-input">
                          <label htmlFor={`budget-max-${index}`} className="budget-label">Maximum</label>
                          <div className="input-with-icon">
                            <IndianRupee size={20} className="currency-icon" />
                            <input
                              id={`budget-max-${index}`}
                              type="number"
                              value={service.budgetRange.max}
                              onChange={(e) => handleServiceChange(index, 'budgetRange.max', e.target.value)}
                              placeholder="50000"
                              min="0"
                              disabled={loading}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      {errors[`service${index}_budget`] && (
                        <span className="error-text">{errors[`service${index}_budget`]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addService}
              className="add-service-btn"
              disabled={loading}
            >
              <Plus size={20} />
              <span>Add Another Service</span>
            </button>
          </div>

          {/* Bank Details Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>
                <CreditCard size={24} />
                Bank Account Details
              </h2>
              <p>Secure payment processing for your bookings</p>
            </div>

            <div className="bank-form-grid">
              <div className="form-group">
                <label htmlFor="account-holder-name">Account Holder Name*</label>
                <input
                  id="account-holder-name"
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                  placeholder="Full name as per bank records"
                  className={errors.accountHolderName ? 'error' : ''}
                  disabled={loading}
                  required
                />
                {errors.accountHolderName && (
                  <span className="error-text">{errors.accountHolderName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="account-number">Account Number*</label>
                <input
                  id="account-number"
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                  placeholder="Enter your account number"
                  className={errors.accountNumber ? 'error' : ''}
                  disabled={loading}
                  required
                />
                {errors.accountNumber && (
                  <span className="error-text">{errors.accountNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ifsc-code">IFSC Code*</label>
                <input
                  id="ifsc-code"
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value.toUpperCase())}
                  placeholder="e.g., SBIN0001234"
                  className={errors.ifscCode ? 'error' : ''}
                  disabled={loading}
                  required
                />
                {errors.ifscCode && (
                  <span className="error-text">{errors.ifscCode}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="bank-name">Bank Name*</label>
                <input
                  id="bank-name"
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                  placeholder="e.g., State Bank of India"
                  className={errors.bankName ? 'error' : ''}
                  disabled={loading}
                  required
                />
                {errors.bankName && (
                  <span className="error-text">{errors.bankName}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="branch-name">Branch Name</label>
                <input
                  id="branch-name"
                  type="text"
                  value={bankDetails.branch}
                  onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
                  placeholder="Branch name (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-box">
              <h3>📋 Important Information</h3>
              <ul>
                <li>Your application will be reviewed within 2-3 business days</li>
                <li>You'll receive email notifications about your status</li>
                <li>Once approved, you can start accepting bookings</li>
                <li>Bank details are encrypted and secure</li>
                <li>You can update information later from your dashboard</li>
              </ul>
            </div>
          </div>

          {/* Error Display */}
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
              className="submit-btn"
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