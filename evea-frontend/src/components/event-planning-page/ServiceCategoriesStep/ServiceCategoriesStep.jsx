// src/components/event-planning-page/ServiceCategoriesStep/ServiceCategoriesStep.jsx
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Music, Camera, Utensils, Flower, Car, Palette } from 'lucide-react';
import './ServiceCategoriesStep.css';

const ServiceCategoriesStep = ({ 
  eventData, 
  updateEventData, 
  nextStep, 
  prevStep, 
  currentStep, 
  totalSteps 
}) => {
  const [selectedServices, setSelectedServices] = useState(eventData.serviceCategories || []);

  const serviceCategories = [
    {
      id: 'catering',
      name: 'Catering',
      description: 'Professional food and beverage services',
      icon: <Utensils size={32} />,
      color: 'orange',
      popular: true
    },
    {
      id: 'photography',
      name: 'Photography & Videography',
      description: 'Capture your special moments',
      icon: <Camera size={32} />,
      color: 'blue',
      popular: true
    },
    {
      id: 'music',
      name: 'Music & Entertainment',
      description: 'DJs, bands, and entertainment services',
      icon: <Music size={32} />,
      color: 'purple',
      popular: true
    },
    {
      id: 'decoration',
      name: 'Decoration & Flowers',
      description: 'Beautiful decorations and floral arrangements',
      icon: <Flower size={32} />,
      color: 'pink',
      popular: false
    },
    {
      id: 'transportation',
      name: 'Transportation',
      description: 'Wedding cars, buses, and transport services',
      icon: <Car size={32} />,
      color: 'green',
      popular: false
    },
    {
      id: 'planning',
      name: 'Event Planning',
      description: 'Full-service event planning and coordination',
      icon: <Palette size={32} />,
      color: 'indigo',
      popular: true
    }
  ];

  const handleServiceToggle = (serviceId) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updatedServices);
    updateEventData('serviceCategories', updatedServices);
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      nextStep();
    }
  };

  const isServiceSelected = (serviceId) => selectedServices.includes(serviceId);

  return (
    <div className="service-categories-step">
      <div className="step-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="step-container">
        <div className="step-header">
          <div className="header-badge">
            <span>Step {currentStep + 1} of {totalSteps}</span>
          </div>
          <h1 className="step-title">
            Choose Your <span className="gradient-text">Services</span>
          </h1>
          <p className="step-subtitle">
            Select the services you need for your {eventData.eventType?.toLowerCase() || 'event'}. 
            You can customize each service in the next step.
          </p>
        </div>

        <div className="services-grid">
          {serviceCategories.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.color} ${isServiceSelected(service.id) ? 'selected' : ''} ${service.popular ? 'popular' : ''}`}
              onClick={() => handleServiceToggle(service.id)}
            >
              {service.popular && (
                <div className="popular-badge">
                  Popular
                </div>
              )}
              
              <div className="service-icon-wrapper">
                <div className="service-icon">
                  {service.icon}
                </div>
              </div>
              
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
              </div>
              
              <div className="service-selector">
                <div className={`checkbox ${isServiceSelected(service.id) ? 'checked' : ''}`}>
                  {isServiceSelected(service.id) && <Check size={16} />}
                </div>
              </div>
              
              <div className="service-hover-effect"></div>
            </div>
          ))}
        </div>

        <div className="selection-summary">
          <div className="summary-text">
            {selectedServices.length === 0 ? (
              'Please select at least one service to continue'
            ) : (
              `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
            )}
          </div>
          
          {selectedServices.length > 0 && (
            <div className="selected-services">
              {selectedServices.map(serviceId => {
                const service = serviceCategories.find(s => s.id === serviceId);
                return service ? (
                  <span key={serviceId} className="selected-service-tag">
                    {service.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="step-actions">
          <button onClick={prevStep} className="btn-secondary">
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button 
            onClick={handleContinue}
            className={`btn-primary ${selectedServices.length === 0 ? 'disabled' : ''}`}
            disabled={selectedServices.length === 0}
          >
            Continue to Requirements
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="step-progress">
          <div className="progress-text">
            Step {currentStep + 1} of {totalSteps} - Service Categories
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesStep;