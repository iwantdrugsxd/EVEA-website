// VendorRegistrationStep3.jsx - FIXED VERSION for vendor ID: 688bbc1843f3df2f6a6e4dda
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
  Building2,
  Sparkles,
  Target,
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

  // FIXED: Enhanced vendor ID resolution with better fallback chain (same as Step 2)
  const getVendorId = () => {
    // Priority order: URL params > component props > location state > localStorage > sessionStorage
    const sources = {
      urlParam: paramVendorId,
      componentProp: propVendorId,
      locationState: location.state?.vendorId,
      localStorage: localStorage.getItem('registrationVendorId'),
      sessionStorage: sessionStorage.getItem('registrationVendorId'),
      // Check for vendor data object in localStorage
      vendorDataId: (() => {
        try {
          const vendorData = JSON.parse(localStorage.getItem('vendorRegistrationData') || '{}');
          return vendorData.vendorId || vendorData._id;
        } catch (e) {
          return null;
        }
      })()
    };
    
    console.log('🔍 Step 3 - Vendor ID Resolution Sources:', sources);
    
    // Return first valid ID found
    const finalId = sources.urlParam || 
                   sources.componentProp || 
                   sources.locationState || 
                   sources.localStorage || 
                   sources.sessionStorage ||
                   sources.vendorDataId;
    
    console.log('✅ Step 3 - Final vendor ID selected:', finalId);
    return finalId;
  };
  
  const finalVendorId = getVendorId();

  // Enhanced error handling and ID persistence
  useEffect(() => {
    if (!finalVendorId) {
      console.error('❌ CRITICAL: No vendor ID found in Step 3!');
      
      // Try to extract from current URL if it's in the path
      const pathParts = window.location.pathname.split('/');
      const possibleId = pathParts[pathParts.length - 1];
      
      if (possibleId && possibleId.length === 24) { // MongoDB ObjectId length
        console.log('🔄 Found potential vendor ID in URL path:', possibleId);
        localStorage.setItem('registrationVendorId', possibleId);
        window.location.reload(); // Reload to pick up the ID
        return;
      }
      
      setErrors({ 
        submit: 'Registration session lost. Please restart from Step 1 or return to Step 2.' 
      });
    } else {
      // Ensure the ID is stored in localStorage for future use
      localStorage.setItem('registrationVendorId', finalVendorId);
      console.log('💾 Step 3 - Vendor ID saved to localStorage:', finalVendorId);
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
    const errorKey = `service${index}_${field.split('.')[0]}`;
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
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // FIXED: Always validate vendor ID first
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🎯 Starting Step 3 registration');
    console.log('📊 Services:', services);
    console.log('🏦 Bank Details:', { ...bankDetails, accountNumber: '[HIDDEN]' });
    console.log('👥 Using vendor ID:', finalVendorId);
    
    // FIXED: Enhanced vendor ID validation
    if (!finalVendorId) {
      console.error('❌ CRITICAL: No vendor ID available for Step 3 submission');
      setErrors({ 
        submit: 'Vendor ID is missing. Please restart registration from Step 1.' 
      });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(finalVendorId)) {
      console.error('❌ Invalid vendor ID format:', finalVendorId);
      setErrors({ 
        submit: 'Invalid vendor ID format. Please restart registration.' 
      });
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      console.log('📋 Current errors:', errors);
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

      console.log('🚀 Calling registerStep3 with vendor ID:', finalVendorId);
      console.log('📦 Submit data structure:', {
        servicesCount: submitData.services.length,
        bankDetailsKeys: Object.keys(submitData.bankDetails)
      });
      
      // Call the registerStep3 function from AuthContext
      const result = await registerStep3(finalVendorId, submitData);
      
      console.log('📡 registerStep3 result:', result);
      
      if (result && result.success) {
        console.log('✅ Step 3 registration completed successfully');
        setSuccessMessage('Registration completed successfully! Your application is now under review.');
        
        // Store completion status
        localStorage.setItem('registrationStep', '3');
        localStorage.setItem('registrationComplete', 'true');
        
        setTimeout(() => {
          console.log('🎉 Calling onComplete callback');
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          } else {
            // Fallback navigation
            console.log('⚠️ onComplete not provided, using fallback navigation');
            window.location.href = '/vendor/dashboard';
          }
        }, 2000);
        
      } else {
        const errorMessage = result?.message || 'Registration failed. Please try again.';
        console.error('❌ Step 3 registration failed:', errorMessage);
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      console.error('❌ Step 3 registration error:', error);
      setErrors({ 
        submit: error.message || 'Registration failed. Please check your information and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-registration-step3">
      <div className="registration-container">
        {/* FIXED: Enhanced debug info for Step 3 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            background: finalVendorId ? '#e6fffa' : '#fef2f2', 
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
            border: `2px solid ${finalVendorId ? '#38b2ac' : '#f56565'}`
          }}>
            <strong>🔧 Step 3 Debug Panel:</strong><br/>
            URL Param ID: {paramVendorId || 'undefined'}<br/>
            Component Prop ID: {propVendorId || 'undefined'}<br/>
            Location State ID: {location.state?.vendorId || 'undefined'}<br/>
            localStorage ID: {localStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            sessionStorage ID: {sessionStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            <strong>Final Selected ID: {finalVendorId || '❌ MISSING'}</strong><br/>
            ID Format Valid: {finalVendorId && /^[0-9a-fA-F]{24}$/.test(finalVendorId) ? '✅ Yes' : '❌ No'}<br/>
            Current URL: {window.location.pathname}
          </div>
        )}

        <div className="registration-header">
          <h1>Services & Bank Details</h1>
          <p>Step 3 of 3: Setup Your Services & Payment Information</p>
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
              <h3>
                <Sparkles size={24} />
                Your Services
              </h3>
              <p>Tell us about the services you offer</p>
            </div>

            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h4>Service {index + 1}</h4>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="remove-service-btn"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Service Title*</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      placeholder="e.g., Wedding Photography"
                      className={errors[`service${index}_title`] ? 'error' : ''}
                    />
                    {errors[`service${index}_title`] && (
                      <span className="error-text">{errors[`service${index}_title`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Category*</label>
                    <select
                      value={service.category}
                      onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                      className={errors[`service${index}_category`] ? 'error' : ''}
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
                </div>

                <div className="form-group">
                  <label>Service Description*</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    placeholder="Describe your service in detail..."
                    rows={4}
                    className={errors[`service${index}_description`] ? 'error' : ''}
                  />
                  {errors[`service${index}_description`] && (
                    <span className="error-text">{errors[`service${index}_description`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Event Types* (Select all that apply)</label>
                  <div className={`event-types-grid ${errors[`service${index}_eventTypes`] ? 'error' : ''}`}>
                    {eventTypes.map(eventType => (
                      <label key={eventType} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={service.eventTypes.includes(eventType)}
                          onChange={() => handleEventTypeToggle(index, eventType)}
                        />
                        <span>{eventType}</span>
                      </label>
                    ))}
                  </div>
                  {errors[`service${index}_eventTypes`] && (
                    <span className="error-text">{errors[`service${index}_eventTypes`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Budget Range*</label>
                  <div className="budget-range">
                    <div className="budget-input">
                      <IndianRupee size={20} />
                      <input
                        type="number"
                        value={service.budgetRange.min}
                        onChange={(e) => handleServiceChange(index, 'budgetRange.min', e.target.value)}
                        placeholder="Min amount"
                        min="0"
                      />
                    </div>
                    <span>to</span>
                    <div className="budget-input">
                      <IndianRupee size={20} />
                      <input
                        type="number"
                        value={service.budgetRange.max}
                        onChange={(e) => handleServiceChange(index, 'budgetRange.max', e.target.value)}
                        placeholder="Max amount"
                        min="0"
                      />
                    </div>
                  </div>
                  {errors[`service${index}_budget`] && (
                    <span className="error-text">{errors[`service${index}_budget`]}</span>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addService}
              className="add-service-btn"
            >
              <Plus size={20} />
              <span>Add Another Service</span>
            </button>
          </div>

          {/* Bank Details Section */}
          <div className="form-section">
            <div className="section-header">
              <h3>
                <CreditCard size={24} />
                Bank Account Details
              </h3>
              <p>For receiving payments from clients</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Account Holder Name*</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                  placeholder="As per bank records"
                  className={errors.accountHolderName ? 'error' : ''}
                />
                {errors.accountHolderName && (
                  <span className="error-text">{errors.accountHolderName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Account Number*</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  className={errors.accountNumber ? 'error' : ''}
                />
                {errors.accountNumber && (
                  <span className="error-text">{errors.accountNumber}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>IFSC Code*</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value.toUpperCase())}
                  placeholder="e.g., SBIN0001234"
                  className={errors.ifscCode ? 'error' : ''}
                />
                {errors.ifscCode && (
                  <span className="error-text">{errors.ifscCode}</span>
                )}
              </div>

              <div className="form-group">
                <label>Bank Name*</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                  placeholder="e.g., State Bank of India"
                  className={errors.bankName ? 'error' : ''}
                />
                {errors.bankName && (
                  <span className="error-text">{errors.bankName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                value={bankDetails.branch}
                onChange={(e) => handleBankDetailsChange('branch', e.target.value)}
                placeholder="Branch name (optional)"
              />
            </div>
          </div>

          {/* Important Information */}
          <div className="form-section">
            <div className="info-box">
              <h4>📋 Important Information:</h4>
              <ul>
                <li>Your application will be reviewed by our team within 2-3 business days</li>
                <li>You will receive email notifications about your application status</li>
                <li>Once approved, you can start accepting bookings through our platform</li>
                <li>Bank details are encrypted and stored securely</li>
                <li>You can update your services and bank details later from your dashboard</li>
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