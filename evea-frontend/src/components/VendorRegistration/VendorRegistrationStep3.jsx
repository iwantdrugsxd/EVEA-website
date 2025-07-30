import React, { useState } from 'react';
import { Plus, Trash2, Star, DollarSign, Clock, Users, Palette, MapPin } from 'lucide-react';
import { RECOMMENDATION_QUESTIONS } from '../../constants/recommendationQuestions';

const VendorRegistrationStep3 = ({ onNext, onPrevious, isLoading }) => {
  const [services, setServices] = useState([{
    serviceInfo: {
      title: '',
      category: '',
      subcategory: '',
      description: '',
      features: [''],
      eventTypes: [],
      guestCapacity: { min: '', max: '' },
      budgetRange: { min: '', max: '' },
      serviceArea: { cities: [''], radiusKm: 50 },
      specializations: [''],
      themes: []
    },
    packages: [{
      name: 'Basic Package',
      description: '',
      price: '',
      duration: '',
      features: [''],
      addOns: [],
      isPopular: false
    }],
    availability: {
      workingDays: [],
      workingHours: { start: '09:00', end: '18:00' },
      advanceBookingDays: 30
    }
  }]);

  const [recommendationData, setRecommendationData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const allQuestions = [
    ...RECOMMENDATION_QUESTIONS.eventExpertise,
    ...RECOMMENDATION_QUESTIONS.budgetExpertise,
    ...RECOMMENDATION_QUESTIONS.geographicExpertise,
    ...RECOMMENDATION_QUESTIONS.styleExpertise,
    ...RECOMMENDATION_QUESTIONS.qualityIndicators
  ];

  const serviceCategories = [
    { value: 'photography', label: 'Photography' },
    { value: 'catering', label: 'Catering' },
    { value: 'decoration', label: 'Decoration' },
    { value: 'venue', label: 'Venue' },
    { value: 'music_entertainment', label: 'Music & Entertainment' },
    { value: 'planning', label: 'Event Planning' },
    { value: 'transport', label: 'Transportation' },
    { value: 'makeup_styling', label: 'Makeup & Styling' },
    { value: 'floral', label: 'Floral Arrangements' },
    { value: 'lighting', label: 'Lighting & Sound' }
  ];

  const eventTypes = [
    { value: 'wedding', label: 'Weddings' },
    { value: 'corporate', label: 'Corporate Events' },
    { value: 'birthday', label: 'Birthday Parties' },
    { value: 'anniversary', label: 'Anniversaries' },
    { value: 'religious', label: 'Religious Ceremonies' },
    { value: 'graduation', label: 'Graduations' },
    { value: 'baby_shower', label: 'Baby Showers' },
    { value: 'engagement', label: 'Engagements' }
  ];

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleServiceChange = (serviceIndex, field, value) => {
    setServices(prev => 
      prev.map((service, index) => 
        index === serviceIndex 
          ? { ...service, [field]: value }
          : service
      )
    );
  };

  const handleServiceInfoChange = (serviceIndex, field, value) => {
    setServices(prev => 
      prev.map((service, index) => 
        index === serviceIndex 
          ? { 
              ...service, 
              serviceInfo: { ...service.serviceInfo, [field]: value }
            }
          : service
      )
    );
  };

  const handleAddService = () => {
    setServices(prev => [...prev, {
      serviceInfo: {
        title: '',
        category: '',
        subcategory: '',
        description: '',
        features: [''],
        eventTypes: [],
        guestCapacity: { min: '', max: '' },
        budgetRange: { min: '', max: '' },
        serviceArea: { cities: [''], radiusKm: 50 },
        specializations: [''],
        themes: []
      },
      packages: [{
        name: 'Basic Package',
        description: '',
        price: '',
        duration: '',
        features: [''],
        addOns: [],
        isPopular: false
      }],
      availability: {
        workingDays: [],
        workingHours: { start: '09:00', end: '18:00' },
        advanceBookingDays: 30
      }
    }]);
  };

  const handleRemoveService = (serviceIndex) => {
    if (services.length > 1) {
      setServices(prev => prev.filter((_, index) => index !== serviceIndex));
    }
  };

  const handleRecommendationAnswer = (questionId, answer) => {
    setRecommendationData(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const renderRecommendationQuestion = (question) => {
    const currentAnswer = recommendationData[question.id];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="question-options">
            {question.options.map(option => (
              <div 
                key={option.value}
                className={`option-card ${
                  question.multiple 
                    ? (currentAnswer?.includes(option.value) ? 'selected' : '')
                    : (currentAnswer === option.value ? 'selected' : '')
                }`}
                onClick={() => {
                  if (question.multiple) {
                    const current = currentAnswer || [];
                    const updated = current.includes(option.value)
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value];
                    handleRecommendationAnswer(question.id, updated);
                  } else {
                    handleRecommendationAnswer(question.id, option.value);
                  }
                }}
              >
                <div className="option-content">
                  <h4>{option.label}</h4>
                  {option.description && <p>{option.description}</p>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="number-input">
            <input
              type="number"
              min={question.min}
              max={question.max}
              value={currentAnswer || ''}
              onChange={(e) => handleRecommendationAnswer(question.id, parseInt(e.target.value))}
              className="form-input"
              placeholder={`Enter value between ${question.min} and ${question.max}`}
            />
          </div>
        );

      case 'budget_range':
        return (
          <div className="budget-ranges">
            {question.options.map(option => (
              <div 
                key={option.value}
                className={`budget-card ${currentAnswer?.includes(option.value) ? 'selected' : ''}`}
                onClick={() => {
                  const current = currentAnswer || [];
                  const updated = current.includes(option.value)
                    ? current.filter(v => v !== option.value)
                    : [...current, option.value];
                  handleRecommendationAnswer(question.id, updated);
                }}
              >
                <h4>{option.label}</h4>
                <p>₹{option.range[0].toLocaleString()} - ₹{option.range[1].toLocaleString()}</p>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Question type not supported</div>;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    services.forEach((service, index) => {
      if (!service.serviceInfo.title.trim()) {
        newErrors[`service_${index}_title`] = 'Service title is required';
      }
      if (!service.serviceInfo.category) {
        newErrors[`service_${index}_category`] = 'Service category is required';
      }
      if (service.packages.length === 0 || !service.packages[0].price) {
        newErrors[`service_${index}_package`] = 'At least one package with pricing is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext({
        services,
        recommendationData
      });
    }
  };

  return (
    <div className="vendor-registration-step">
      <div className="step-header">
        <h2 className="step-title">Services & Packages</h2>
        <p className="step-description">
          Set up your services, packages, and help us understand your expertise for better recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Services Section */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Your Services</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddService}
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>

          {services.map((service, serviceIndex) => (
            <div key={serviceIndex} className="service-card">
              <div className="service-header">
                <h4>Service {serviceIndex + 1}</h4>
                {services.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveService(serviceIndex)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Service Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Wedding Photography"
                    value={service.serviceInfo.title}
                    onChange={(e) => handleServiceInfoChange(serviceIndex, 'title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={service.serviceInfo.category}
                    onChange={(e) => handleServiceInfoChange(serviceIndex, 'category', e.target.value)}
                  >
                    <option value="">Select category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Service Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe your service in detail..."
                    value={service.serviceInfo.description}
                    onChange={(e) => handleServiceInfoChange(serviceIndex, 'description', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Types</label>
                  <div className="checkbox-group">
                    {eventTypes.map(eventType => (
                      <label key={eventType.value} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={service.serviceInfo.eventTypes.includes(eventType.value)}
                          onChange={(e) => {
                            const current = service.serviceInfo.eventTypes;
                            const updated = e.target.checked
                              ? [...current, eventType.value]
                              : current.filter(type => type !== eventType.value);
                            handleServiceInfoChange(serviceIndex, 'eventTypes', updated);
                          }}
                        />
                        {eventType.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Guest Capacity</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={service.serviceInfo.guestCapacity.min}
                      onChange={(e) => handleServiceInfoChange(serviceIndex, 'guestCapacity', {
                        ...service.serviceInfo.guestCapacity,
                        min: e.target.value
                      })}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={service.serviceInfo.guestCapacity.max}
                      onChange={(e) => handleServiceInfoChange(serviceIndex, 'guestCapacity', {
                        ...service.serviceInfo.guestCapacity,
                        max: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Budget Range (₹)</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={service.serviceInfo.budgetRange.min}
                      onChange={(e) => handleServiceInfoChange(serviceIndex, 'budgetRange', {
                        ...service.serviceInfo.budgetRange,
                        min: e.target.value
                      })}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={service.serviceInfo.budgetRange.max}
                      onChange={(e) => handleServiceInfoChange(serviceIndex, 'budgetRange', {
                        ...service.serviceInfo.budgetRange,
                        max: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Package Configuration */}
              <div className="packages-section">
                <h5>Service Packages</h5>
                {service.packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="package-card">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Package Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={pkg.name}
                          onChange={(e) => {
                            const updatedPackages = [...service.packages];
                            updatedPackages[pkgIndex].name = e.target.value;
                            handleServiceChange(serviceIndex, 'packages', updatedPackages);
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-input"
                          value={pkg.price}
                          onChange={(e) => {
                            const updatedPackages = [...service.packages];
                            updatedPackages[pkgIndex].price = e.target.value;
                            handleServiceChange(serviceIndex, 'packages', updatedPackages);
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., 4 hours, Full day"
                          value={pkg.duration}
                          onChange={(e) => {
                            const updatedPackages = [...service.packages];
                            updatedPackages[pkgIndex].duration = e.target.value;
                            handleServiceChange(serviceIndex, 'packages', updatedPackages);
                          }}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Package Description</label>
                        <textarea
                          className="form-textarea"
                          rows="2"
                          value={pkg.description}
                          onChange={(e) => {
                            const updatedPackages = [...service.packages];
                            updatedPackages[pkgIndex].description = e.target.value;
                            handleServiceChange(serviceIndex, 'packages', updatedPackages);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Questions */}
        <div className="form-section">
          <h3 className="section-title">
            <Star size={20} />
            Help Us Understand Your Expertise
          </h3>
          <p className="section-description">
            Answer these questions to help us recommend your services to the right customers
          </p>

          <div className="recommendation-questions">
            {allQuestions.slice(0, 5).map((question, index) => (
              <div key={question.id} className="question-card">
                <h4 className="question-title">{question.question}</h4>
                {renderRecommendationQuestion(question)}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPrevious}
          >
            Previous Step
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Completing Registration...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorRegistrationStep3;