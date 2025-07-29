// src/pages/EventPlanningPage/components/EventDetailsStep/EventDetailsStep.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, FileText, Lightbulb, Heart } from 'lucide-react';
import './EventDetailsStep.css';

const EventDetailsStep = ({ eventData, updateEventDetails, nextStep, prevStep }) => {
  const [formData, setFormData] = useState(eventData.eventDetails);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const guestRanges = [
    { value: '1-25', label: '1-25 guests', icon: '👥' },
    { value: '26-50', label: '26-50 guests', icon: '👨‍👩‍👧‍👦' },
    { value: '51-100', label: '51-100 guests', icon: '🏛️' },
    { value: '101-200', label: '101-200 guests', icon: '🎪' },
    { value: '201-500', label: '201-500 guests', icon: '🏟️' },
    { value: '500+', label: '500+ guests', icon: '🌟' }
  ];

  const budgetRanges = [
    { value: '25000-50000', label: '₹25,000 - ₹50,000', description: 'Intimate celebration' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000', description: 'Small gathering' },
    { value: '100000-300000', label: '₹1,00,000 - ₹3,00,000', description: 'Medium event' },
    { value: '300000-500000', label: '₹3,00,000 - ₹5,00,000', description: 'Large celebration' },
    { value: '500000-1000000', label: '₹5,00,000 - ₹10,00,000', description: 'Grand event' },
    { value: '1000000+', label: '₹10,00,000+', description: 'Luxury experience' }
  ];

  const eventSuggestions = {
    wedding: [
      'Priya & Arjun\'s Dream Wedding',
      'A Royal Celebration',
      'Garden Paradise Wedding',
      'Traditional Elegance'
    ],
    corporate: [
      'Annual Company Celebration',
      'Product Launch Event',
      'Team Building Retreat',
      'Awards Ceremony'
    ],
    birthday: [
      'Sarah\'s 25th Birthday Bash',
      'Milestone Celebration',
      'Garden Party Birthday',
      'Themed Birthday Party'
    ]
  };

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateEventDetails(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.guests) {
      newErrors.guests = 'Number of guests is required';
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Budget range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  const generateEventName = () => {
    const suggestions = eventSuggestions[eventData.eventType] || eventSuggestions.wedding;
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    handleInputChange('name', randomSuggestion);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    const requiredFields = ['name', 'date', 'time', 'location', 'guests', 'budget'];
    const isValid = requiredFields.every(field => formData[field] && formData[field].trim() !== '');
    setIsFormValid(isValid);
  }, [formData]);

  return (
    <div className="event-details-step">
      <div className="details-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="details-container">
        <div className="details-header">
          <h1 className="step-title">
            Tell Us About Your <span className="gradient-text">Event</span>
          </h1>
          <p className="step-subtitle">
            The more details you provide, the better we can match you with perfect vendors
          </p>
        </div>

        <div className="details-form-wrapper">
          <form onSubmit={handleSubmit} className="details-form">
            <div className="form-sections">
              {/* Basic Information Section */}
              <div className="form-section">
                <div className="section-header">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3>Basic Information</h3>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label">
                      <FileText className="w-4 h-4" />
                      Event Name
                    </label>
                    <div className="input-with-suggestion">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g., Sarah & John's Wedding"
                      />
                      <button
                        type="button"
                        onClick={generateEventName}
                        className="suggestion-button"
                        title="Generate suggestion"
                      >
                        <Lightbulb className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar className="w-4 h-4" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`form-input ${errors.date ? 'error' : ''}`}
                      min={getMinDate()}
                    />
                    {errors.date && <span className="error-text">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Clock className="w-4 h-4" />
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`form-input ${errors.time ? 'error' : ''}`}
                    />
                    {errors.time && <span className="error-text">{errors.time}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`form-input ${errors.location ? 'error' : ''}`}
                      placeholder="City, Area or Venue"
                    />
                    {errors.location && <span className="error-text">{errors.location}</span>}
                  </div>
                </div>
              </div>

              {/* Guest & Budget Section */}
              <div className="form-section">
                <div className="section-header">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3>Guest Count & Budget</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </label>
                    <div className="custom-select-grid">
                      {guestRanges.map((range) => (
                        <button
                          key={range.value}
                          type="button"
                          onClick={() => handleInputChange('guests', range.value)}
                          className={`select-option ${formData.guests === range.value ? 'selected' : ''}`}
                        >
                          <span className="option-icon">{range.icon}</span>
                          <span className="option-label">{range.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.guests && <span className="error-text">{errors.guests}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label">
                      <DollarSign className="w-4 h-4" />
                      Budget Range
                    </label>
                    <div className="budget-options">
                      {budgetRanges.map((budget) => (
                        <button
                          key={budget.value}
                          type="button"
                          onClick={() => handleInputChange('budget', budget.value)}
                          className={`budget-option ${formData.budget === budget.value ? 'selected' : ''}`}
                        >
                          <div className="budget-main">{budget.label}</div>
                          <div className="budget-description">{budget.description}</div>
                        </button>
                      ))}
                    </div>
                    {errors.budget && <span className="error-text">{errors.budget}</span>}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="form-section">
                <div className="section-header">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3>Vision & Preferences</h3>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label">
                      Event Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="form-textarea"
                      placeholder="Tell us about your vision, theme, special requirements, or any other details that would help us create the perfect event for you..."
                    />
                    <div className="textarea-hint">
                      💡 Tip: Mention themes, colors, special requirements, or inspiration
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <button
                type="submit"
                className={`btn-primary ${!isFormValid ? 'disabled' : ''}`}
                disabled={!isFormValid}
              >
                Continue to Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Progress Indicator */}
          <div className="form-progress">
            <div className="progress-text">
              Step 3 of 12 - Event Details
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsStep;