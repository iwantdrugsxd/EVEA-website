// src/components/event-planning-page/ServiceRequirementsStep/ServiceRequirementsStep.jsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Utensils, 
  Palette, 
  Music, 
  Home, 
  Car,
  Check,
  Plus,
  Settings,
  Clock,
  Users,
  MapPin
} from 'lucide-react';
import './ServiceRequirementsStep.css';

const ServiceRequirementsStep = ({ eventData, updateServiceRequirements, nextStep, prevStep }) => {
  const [requirements, setRequirements] = useState(eventData.serviceRequirements || {});
  const [activeService, setActiveService] = useState(eventData.serviceCategories[0] || null);

  const serviceDetails = {
    photography: {
      icon: Camera,
      name: 'Photography',
      color: 'blue',
      options: {
        duration: {
          label: 'Coverage Duration',
          type: 'select',
          options: ['4 hours', '6 hours', '8 hours', '10 hours', 'Full day'],
          default: '8 hours'
        },
        style: {
          label: 'Photography Style',
          type: 'multiple',
          options: ['Traditional', 'Candid', 'Artistic', 'Documentary', 'Fashion'],
          default: ['Candid']
        },
        deliverables: {
          label: 'Deliverables',
          type: 'multiple',
          options: ['Digital Gallery', 'Printed Album', 'USB Drive', 'Online Sharing', 'Raw Files'],
          default: ['Digital Gallery']
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Any specific shots, locations, or requirements...'
        }
      }
    },
    catering: {
      icon: Utensils,
      name: 'Catering',
      color: 'orange',
      options: {
        mealType: {
          label: 'Meal Type',
          type: 'select',
          options: ['Breakfast', 'Lunch', 'Dinner', 'Cocktail', 'Full Day'],
          default: 'Dinner'
        },
        cuisine: {
          label: 'Cuisine Preferences',
          type: 'multiple',
          options: ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Italian', 'Mexican', 'Fusion'],
          default: ['North Indian']
        },
        serviceStyle: {
          label: 'Service Style',
          type: 'select',
          options: ['Buffet', 'Plated Service', 'Family Style', 'Cocktail Style', 'Live Counters'],
          default: 'Buffet'
        },
        dietaryRequirements: {
          label: 'Dietary Requirements',
          type: 'multiple',
          options: ['Vegetarian', 'Vegan', 'Jain', 'Gluten-free', 'Diabetic-friendly', 'No restrictions'],
          default: ['Vegetarian']
        },
        guestCount: {
          label: 'Expected Guest Count',
          type: 'number',
          placeholder: 'Number of guests for catering'
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Allergies, special dishes, setup requirements...'
        }
      }
    },
    decoration: {
      icon: Palette,
      name: 'Decoration',
      color: 'pink',
      options: {
        theme: {
          label: 'Theme/Style',
          type: 'select',
          options: ['Traditional', 'Modern', 'Vintage', 'Rustic', 'Bohemian', 'Minimalist', 'Royal'],
          default: 'Modern'
        },
        colorScheme: {
          label: 'Color Scheme',
          type: 'multiple',
          options: ['Red & Gold', 'Pink & White', 'Blue & Silver', 'Purple & Gold', 'Green & White', 'Custom'],
          default: ['Pink & White']
        },
        areas: {
          label: 'Areas to Decorate',
          type: 'multiple',
          options: ['Entrance', 'Stage/Mandap', 'Dining Area', 'Dance Floor', 'Photo Booth', 'Bar Area'],
          default: ['Entrance', 'Stage/Mandap']
        },
        flowers: {
          label: 'Flower Preferences',
          type: 'multiple',
          options: ['Roses', 'Marigolds', 'Jasmine', 'Lilies', 'Orchids', 'Mixed Seasonal'],
          default: ['Roses']
        },
        lighting: {
          label: 'Lighting Requirements',
          type: 'multiple',
          options: ['Fairy Lights', 'LED Uplighting', 'Chandeliers', 'Candles', 'Spotlight', 'Color Changing'],
          default: ['Fairy Lights']
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Specific decorative elements, cultural requirements...'
        }
      }
    },
    entertainment: {
      icon: Music,
      name: 'Music & Entertainment',
      color: 'purple',
      options: {
        musicType: {
          label: 'Music Type',
          type: 'select',
          options: ['DJ', 'Live Band', 'Classical Musicians', 'Folk Artists', 'Mixed'],
          default: 'DJ'
        },
        genres: {
          label: 'Music Genres',
          type: 'multiple',
          options: ['Bollywood', 'Punjabi', 'Classical', 'Rock', 'Pop', 'Electronic', 'Folk'],
          default: ['Bollywood']
        },
        equipment: {
          label: 'Equipment Needed',
          type: 'multiple',
          options: ['Sound System', 'Microphones', 'Stage Setup', 'Dance Floor', 'Lighting', 'Fog Machine'],
          default: ['Sound System', 'Microphones']
        },
        duration: {
          label: 'Entertainment Duration',
          type: 'select',
          options: ['2 hours', '4 hours', '6 hours', '8 hours', 'Full event'],
          default: '4 hours'
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Specific songs, announcements, special performances...'
        }
      }
    },
    venue: {
      icon: Home,
      name: 'Venue',
      color: 'green',
      options: {
        venueType: {
          label: 'Venue Type',
          type: 'select',
          options: ['Banquet Hall', 'Garden/Outdoor', 'Hotel', 'Resort', 'Heritage Property', 'Farmhouse'],
          default: 'Banquet Hall'
        },
        capacity: {
          label: 'Guest Capacity',
          type: 'select',
          options: ['50-100', '100-200', '200-300', '300-500', '500+'],
          default: '100-200'
        },
        amenities: {
          label: 'Required Amenities',
          type: 'multiple',
          options: ['Parking', 'AC/Heating', 'Generator', 'Catering Kitchen', 'Bridal Room', 'Stage Area'],
          default: ['Parking', 'AC/Heating']
        },
        location: {
          label: 'Preferred Location',
          type: 'text',
          placeholder: 'Specific area or landmarks nearby'
        },
        budget: {
          label: 'Budget Range',
          type: 'select',
          options: ['Under ₹50k', '₹50k-₹1L', '₹1L-₹2L', '₹2L-₹5L', '₹5L+'],
          default: '₹1L-₹2L'
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Accessibility needs, specific setup requirements...'
        }
      }
    },
    transportation: {
      icon: Car,
      name: 'Transportation',
      color: 'teal',
      options: {
        vehicleType: {
          label: 'Vehicle Type',
          type: 'multiple',
          options: ['Luxury Car', 'Decorated Car', 'Bus/Tempo', 'Horse/Buggy', 'Bike/Scooty'],
          default: ['Luxury Car']
        },
        purpose: {
          label: 'Transportation Purpose',
          type: 'multiple',
          options: ['Groom Transportation', 'Guest Transportation', 'Vendor Transportation', 'General Purpose'],
          default: ['Groom Transportation']
        },
        duration: {
          label: 'Service Duration',
          type: 'select',
          options: ['2 hours', '4 hours', '6 hours', '8 hours', 'Full day'],
          default: '4 hours'
        },
        pickupLocation: {
          label: 'Pickup Location',
          type: 'text',
          placeholder: 'Starting point for transportation'
        },
        dropLocation: {
          label: 'Drop Location',
          type: 'text',
          placeholder: 'Destination point'
        },
        specialRequests: {
          label: 'Special Requirements',
          type: 'textarea',
          placeholder: 'Decoration preferences, route preferences...'
        }
      }
    }
  };

  const handleRequirementChange = (serviceId, field, value) => {
    setRequirements(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: value
      }
    }));
  };

  const handleContinue = () => {
    updateServiceRequirements(requirements);
    nextStep();
  };

  const renderField = (serviceId, fieldKey, field) => {
    const currentValue = requirements[serviceId]?.[fieldKey] || field.default || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleRequirementChange(serviceId, fieldKey, e.target.value)}
            className="requirement-select"
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiple':
        return (
          <div className="checkbox-group">
            {field.options.map(option => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={(currentValue || []).includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(currentValue || []), option]
                      : (currentValue || []).filter(v => v !== option);
                    handleRequirementChange(serviceId, fieldKey, newValue);
                  }}
                />
                <span className="checkbox-custom"></span>
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={currentValue}
            onChange={(e) => handleRequirementChange(serviceId, fieldKey, e.target.value)}
            placeholder={field.placeholder}
            className="requirement-textarea"
            rows={3}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleRequirementChange(serviceId, fieldKey, e.target.value)}
            placeholder={field.placeholder}
            className="requirement-input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleRequirementChange(serviceId, fieldKey, e.target.value)}
            placeholder={field.placeholder}
            className="requirement-input"
          />
        );

      default:
        return null;
    }
  };

  const getCompletionPercentage = (serviceId) => {
    const service = serviceDetails[serviceId];
    if (!service) return 0;
    
    const totalFields = Object.keys(service.options).length;
    const completedFields = Object.keys(requirements[serviceId] || {}).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <div className="service-requirements-step">
      <div className="requirements-background">
        <div className="bg-mesh"></div>
      </div>

      <div className="requirements-container">
        <div className="requirements-header">
          <h1 className="step-title">
            Customize Your <span className="gradient-text">Services</span>
          </h1>
          <p className="step-subtitle">
            Tell us your specific requirements for each service to get personalized recommendations
          </p>
        </div>

        <div className="requirements-content">
          {/* Service Navigation */}
          <div className="service-nav">
            <h3>Selected Services</h3>
            <div className="service-nav-list">
              {eventData.serviceCategories.map(serviceId => {
                const service = serviceDetails[serviceId];
                if (!service) return null;
                
                const IconComponent = service.icon;
                const completion = getCompletionPercentage(serviceId);
                
                return (
                  <div
                    key={serviceId}
                    className={`service-nav-item ${activeService === serviceId ? 'active' : ''} ${service.color}`}
                    onClick={() => setActiveService(serviceId)}
                  >
                    <div className="nav-item-icon">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="nav-item-content">
                      <h4>{service.name}</h4>
                      <div className="completion-indicator">
                        <div className="completion-bar">
                          <div 
                            className="completion-fill"
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                        <span>{completion}% complete</span>
                      </div>
                    </div>
                    {completion === 100 && (
                      <div className="completion-check">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements Form */}
          <div className="requirements-form">
            {activeService && serviceDetails[activeService] && (
              <div className="form-content">
                <div className="form-header">
                  <div className="service-title">
                    {React.createElement(serviceDetails[activeService].icon, { className: "w-6 h-6" })}
                    <h2>{serviceDetails[activeService].name} Requirements</h2>
                  </div>
                  <div className="progress-indicator">
                    {getCompletionPercentage(activeService)}% Complete
                  </div>
                </div>

                <div className="form-fields">
                  {Object.entries(serviceDetails[activeService].options).map(([fieldKey, field]) => (
                    <div key={fieldKey} className="form-field">
                      <label className="field-label">{field.label}</label>
                      {renderField(activeService, fieldKey, field)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="requirements-summary">
          <h3>Requirements Summary</h3>
          <div className="summary-content">
            {eventData.serviceCategories.map(serviceId => {
              const service = serviceDetails[serviceId];
              const completion = getCompletionPercentage(serviceId);
              
              return (
                <div key={serviceId} className="summary-item">
                  <div className="summary-header">
                    <span className="service-name">{service?.name}</span>
                    <span className={`completion-badge ${completion === 100 ? 'complete' : 'incomplete'}`}>
                      {completion}%
                    </span>
                  </div>
                  <div className="summary-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">
                {eventData.serviceCategories.filter(s => getCompletionPercentage(s) === 100).length}
              </span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {eventData.serviceCategories.filter(s => getCompletionPercentage(s) > 0 && getCompletionPercentage(s) < 100).length}
              </span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        {/* Step Actions */}
        <div className="step-actions">
          <button onClick={prevStep} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button 
            onClick={handleContinue}
            className="btn-primary"
          >
            Continue to Vendor Search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequirementsStep;