// src/pages/VendorRegistrationPage/VendorRegistrationPage.jsx - Updated with Dashboard Redirect
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Heart, Check, Upload, X, Plus, 
  FileText, CreditCard, MapPin, Clock, Camera, Utensils, 
  Palette, Music, Building, Wrench, Car, Briefcase, 
  Cake, Music2, Volume2, User, Mail, 
  Phone, FileImage, CheckCircle
} from 'lucide-react';
import './VendorRegistrationPage.css';

const VendorRegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const navigate = useNavigate();

  // Form data state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    yearsInBusiness: '',
    address: '',
    description: '',
    services: []
  });

  const [verificationData, setVerificationData] = useState({
    businessLicense: [],
    taxRegistration: [],
    identityProof: [],
    addressProof: [],
    bankDetails: [],
    insurance: [],
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });

  const [servicesData, setServicesData] = useState({
    categories: [],
    coverageArea: '',
    minimumOrder: '',
    teamSize: '',
    advanceBooking: '',
    pricing: '',
    portfolio: [],
    openingTime: '',
    closingTime: '',
    workingDays: [],
    sampleServices: []
  });

  const totalSteps = 3;

  // Countdown effect for redirect
  useEffect(() => {
    if (registrationComplete && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (registrationComplete && redirectCountdown === 0) {
      navigate('/vendor-dashboard');
    }
  }, [registrationComplete, redirectCountdown, navigate]);

  const services = [
    { id: 'catering', name: 'Catering & Food', icon: <Utensils size={32} /> },
    { id: 'photography', name: 'Photography', icon: <Camera size={32} /> },
    { id: 'decoration', name: 'Decoration', icon: <Palette size={32} /> },
    { id: 'entertainment', name: 'Entertainment', icon: <Music size={32} /> },
    { id: 'venue', name: 'Venues', icon: <Building size={32} /> },
    { id: 'equipment', name: 'Equipment Rental', icon: <Wrench size={32} /> },
    { id: 'transport', name: 'Transportation', icon: <Car size={32} /> },
    { id: 'other', name: 'Other Services', icon: <Plus size={32} /> }
  ];

  const serviceCategories = [
    { id: 'wedding-catering', name: 'Wedding Catering', icon: <Heart size={24} /> },
    { id: 'corporate-catering', name: 'Corporate Catering', icon: <Briefcase size={24} /> },
    { id: 'birthday-decoration', name: 'Birthday Decoration', icon: <Cake size={24} /> },
    { id: 'wedding-photography', name: 'Wedding Photography', icon: <Camera size={24} /> },
    { id: 'dj-services', name: 'DJ Services', icon: <Music2 size={24} /> },
    { id: 'sound-systems', name: 'Sound Systems', icon: <Volume2 size={24} /> }
  ];

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitRegistration();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitRegistration = async () => {
    setIsLoading(true);
    
    // Simulate API call for registration
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful registration
      const registrationData = {
        businessInfo,
        verificationData,
        servicesData,
        registrationId: 'VEN-REG-' + Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'pending_review'
      };
      
      // In real implementation, this would be sent to API
      console.log('Registration submitted:', registrationData);
      
      // Set registration as complete
      setRegistrationComplete(true);
      setCurrentStep(totalSteps + 1);
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setBusinessInfo(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setServicesData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleDayToggle = (day) => {
    setServicesData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const updateServiceField = (index, field, value) => {
    setServicesData(prev => ({
      ...prev,
      sampleServices: prev.sampleServices.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleFileUpload = (field, files) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: [...prev[field], ...Array.from(files)]
    }));
  };

  const removeFile = (field, index) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleGoToDashboard = () => {
    navigate('/vendor-dashboard');
  };

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

  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Tell Us About Your Business</h2>
        <p className="step-description">
          Provide your basic business information to get started with the registration process
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Business Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your business name"
            value={businessInfo.businessName}
            onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Business Type *</label>
          <select
            className="form-select"
            value={businessInfo.businessType}
            onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
          >
            <option value="">Select business type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="llp">Limited Liability Partnership</option>
            <option value="private_limited">Private Limited Company</option>
            <option value="public_limited">Public Limited Company</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Contact Person Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Your full name"
            value={businessInfo.contactName}
            onChange={(e) => setBusinessInfo({...businessInfo, contactName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={businessInfo.email}
            onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+91 XXXXX XXXXX"
            value={businessInfo.phone}
            onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Years in Business *</label>
          <select
            className="form-select"
            value={businessInfo.yearsInBusiness}
            onChange={(e) => setBusinessInfo({...businessInfo, yearsInBusiness: e.target.value})}
          >
            <option value="">Select years</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">More than 10 years</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label className="form-label">Business Address *</label>
        <textarea
          className="form-textarea"
          placeholder="Enter your complete business address"
          value={businessInfo.address}
          onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
          rows="3"
        />
      </div>

      <div className="form-group full-width">
        <label className="form-label">Business Description *</label>
        <textarea
          className="form-textarea"
          placeholder="Describe your business, services, and what makes you unique..."
          value={businessInfo.description}
          onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
          rows="4"
        />
      </div>

      <div className="services-selection">
        <label className="form-label">Primary Services *</label>
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${businessInfo.services.includes(service.id) ? 'selected' : ''}`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="service-icon">{service.icon}</div>
              <span className="service-name">{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Verification & Documents</h2>
        <p className="step-description">
          Upload required documents for business verification and compliance
        </p>
      </div>

      {/* Business Registration Details */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Business Registration Number</label>
          <input
            type="text"
            className="form-input"
            placeholder="REG123456789"
            value={verificationData.registrationNumber}
            onChange={(e) => setVerificationData({...verificationData, registrationNumber: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">GST Number</label>
          <input
            type="text"
            className="form-input"
            placeholder="GSTIN (if applicable)"
            value={verificationData.gstNumber}
            onChange={(e) => setVerificationData({...verificationData, gstNumber: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">PAN Number *</label>
          <input
            type="text"
            className="form-input"
            placeholder="ABCDE1234F"
            value={verificationData.panNumber}
            onChange={(e) => setVerificationData({...verificationData, panNumber: e.target.value})}
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Account Holder Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="As per bank records"
            value={verificationData.accountHolderName}
            onChange={(e) => setVerificationData({...verificationData, accountHolderName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Account Number *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Bank account number"
            value={verificationData.accountNumber}
            onChange={(e) => setVerificationData({...verificationData, accountNumber: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">IFSC Code *</label>
          <input
            type="text"
            className="form-input"
            placeholder="IFSC Code"
            value={verificationData.ifscCode}
            onChange={(e) => setVerificationData({...verificationData, ifscCode: e.target.value})}
          />
        </div>
      </div>

      {/* Document Uploads */}
      <div className="documents-section">
        <h3>Required Documents</h3>
        
        <div className="document-upload-grid">
          <div className="upload-group">
            <label className="upload-label">Business License/Registration *</label>
            <div className="upload-help-text">PDF, JPG, PNG up to 5MB</div>
            <input
              type="file"
              className="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload('businessLicense', e.target.files)}
            />
          </div>

          <div className="upload-group">
            <label className="upload-label">Identity Proof (PAN Card) *</label>
            <div className="upload-help-text">PDF, JPG, PNG up to 5MB</div>
            <input
              type="file"
              className="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('identityProof', e.target.files)}
            />
          </div>

          <div className="upload-group">
            <label className="upload-label">Address Proof</label>
            <div className="upload-help-text">Electricity bill, rent agreement, etc.</div>
            <input
              type="file"
              className="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload('addressProof', e.target.files)}
            />
          </div>

          <div className="upload-group">
            <label className="upload-label">Bank Statement/Cancelled Cheque *</label>
            <div className="upload-help-text">Last 3 months bank statement</div>
            <input
              type="file"
              className="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload('bankDetails', e.target.files)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Services & Pricing</h2>
        <p className="step-description">
          Set up your service offerings and business operational details
        </p>
      </div>

      {/* Service Categories */}
      <div className="categories-selection">
        <label className="form-label">Specific Service Categories *</label>
        <div className="categories-grid">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${servicesData.categories.includes(category.id) ? 'selected' : ''}`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <div className="category-icon">{category.icon}</div>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Details */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Coverage Area *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Mumbai, Pune, Nashik"
            value={servicesData.coverageArea}
            onChange={(e) => setServicesData({...servicesData, coverageArea: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Team Size</label>
          <select
            className="form-select"
            value={servicesData.teamSize}
            onChange={(e) => setServicesData({...servicesData, teamSize: e.target.value})}
          >
            <option value="">Select team size</option>
            <option value="1">Just me</option>
            <option value="2-5">2-5 people</option>
            <option value="6-10">6-10 people</option>
            <option value="11-20">11-20 people</option>
            <option value="20+">More than 20 people</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Order Value</label>
          <input
            type="number"
            className="form-input"
            placeholder="₹ 10,000"
            value={servicesData.minimumOrder}
            onChange={(e) => setServicesData({...servicesData, minimumOrder: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Advance Booking Required</label>
          <select
            className="form-select"
            value={servicesData.advanceBooking}
            onChange={(e) => setServicesData({...servicesData, advanceBooking: e.target.value})}
          >
            <option value="">Select booking time</option>
            <option value="same-day">Same day</option>
            <option value="1-day">1 day</option>
            <option value="3-days">3 days</option>
            <option value="7-days">1 week</option>
            <option value="14-days">2 weeks</option>
            <option value="30-days">1 month</option>
          </select>
        </div>
      </div>

      {/* Portfolio Upload */}
      <div className="portfolio-section">
        <label className="form-label">Portfolio Images</label>
        <div className="upload-help-text">JPG, PNG up to 10MB each (Max 10 images)</div>
        <input
          type="file"
          className="file-input"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={(e) => handleFileUpload('portfolio', e.target.files)}
        />
      </div>

      {/* Working Hours */}
      <div className="working-hours-section">
        <label className="form-label">Working Hours</label>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Opening Time</label>
            <input
              type="time"
              className="form-input"
              value={servicesData.openingTime}
              onChange={(e) => setServicesData({...servicesData, openingTime: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Closing Time</label>
            <input
              type="time"
              className="form-input"
              value={servicesData.closingTime}
              onChange={(e) => setServicesData({...servicesData, closingTime: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Working Days</label>
          <div className="working-days-grid">
            {workingDays.map((day) => (
              <div
                key={day}
                className={`day-card ${servicesData.workingDays.includes(day) ? 'selected' : ''}`}
                onClick={() => handleDayToggle(day)}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
          <span>Redirecting to your dashboard in {redirectCountdown} seconds...</span>
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
          onClick={handleGoToDashboard}
        >
          Go to Dashboard Now
        </button>
        <Link to="/" className="success-btn secondary">
          Return to Homepage
        </Link>
      </div>
    </div>
  );

  if (currentStep > totalSteps) {
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
      <div className="registration-background">
        <div className="registration-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="registration-header">
        <div className="header-container">
          <Link to="/" className="registration-logo">
            <Heart className="heart-icon" />
            <span>EVEA</span>
          </Link>
          <Link to="/" className="header-back">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="registration-container">
        <div className="registration-wrapper">
          {renderProgressBar()}
          
          <div className="form-container">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="form-navigation">
              <button
                type="button"
                className="nav-button secondary"
                onClick={handlePrevious}
                style={{ display: currentStep > 1 ? 'block' : 'none' }}
              >
                <ArrowLeft size={16} /> Previous
              </button>
              <div></div>
              <button
                type="button"
                className="nav-button primary"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentStep < totalSteps ? 'Next' : 'Submit Registration'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationPage;