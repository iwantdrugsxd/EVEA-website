// src/pages/EventPlanningPage/components/EventTypeStep/EventTypeStep.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Users, Building, Baby, GraduationCap, Gift } from 'lucide-react';
import './EventTypeStep.css';

const EventTypeStep = ({ eventData, updateEventData, nextStep, prevStep }) => {
  const [selectedType, setSelectedType] = useState(eventData.eventType || '');
  const [hoveredType, setHoveredType] = useState(null);

  const eventTypes = [
    {
      id: 'wedding',
      name: 'Wedding',
      icon: Heart,
      emoji: '💒',
      description: 'Create your dream wedding with expert vendors',
      color: 'pink',
      gradient: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      popularity: 'Most Popular',
      avgBudget: '₹5L - ₹25L',
      vendors: '500+ vendors'
    },
    {
      id: 'corporate',
      name: 'Corporate Event',
      icon: Building,
      emoji: '🏢',
      description: 'Professional events that leave lasting impressions',
      color: 'blue',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      popularity: 'Trending',
      avgBudget: '₹2L - ₹15L',
      vendors: '300+ vendors'
    },
    {
      id: 'birthday',
      name: 'Birthday Party',
      icon: Gift,
      emoji: '🎂',
      description: 'Celebrate life\'s special moments with joy',
      color: 'yellow',
      gradient: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      popularity: 'Popular',
      avgBudget: '₹50K - ₹5L',
      vendors: '250+ vendors'
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      icon: Heart,
      emoji: '💝',
      description: 'Romantic celebrations to cherish forever',
      color: 'purple',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      popularity: 'Special',
      avgBudget: '₹1L - ₹8L',
      vendors: '200+ vendors'
    },
    {
      id: 'graduation',
      name: 'Graduation',
      icon: GraduationCap,
      emoji: '🎓',
      description: 'Milestone celebrations done perfectly',
      color: 'green',
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      popularity: 'Seasonal',
      avgBudget: '₹75K - ₹4L',
      vendors: '150+ vendors'
    },
    {
      id: 'baby-shower',
      name: 'Baby Shower',
      icon: Baby,
      emoji: '👶',
      description: 'Welcome new life with beautiful celebrations',
      color: 'teal',
      gradient: 'from-teal-400 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      popularity: 'Sweet',
      avgBudget: '₹40K - ₹2L',
      vendors: '120+ vendors'
    }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    updateEventData('eventType', typeId);
    
    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      nextStep();
    }, 800);
  };

  useEffect(() => {
    // Add staggered animation to cards
    const cards = document.querySelectorAll('.event-type-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });
  }, []);

  return (
    <div className="event-type-step">
      <div className="event-type-background">
        <div className="bg-pattern"></div>
      </div>

      <div className="event-type-container">
        <div className="event-type-header">
          <h1 className="step-title">
            What's the <span className="gradient-text">Occasion?</span>
          </h1>
          <p className="step-subtitle">
            Choose your event type to get personalized vendor recommendations and planning tools
          </p>
        </div>

        <div className="event-types-grid">
          {eventTypes.map((type, index) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            const isHovered = hoveredType === type.id;
            
            return (
              <div
                key={type.id}
                className={`event-type-card ${isSelected ? 'selected' : ''} ${type.color}`}
                onClick={() => handleTypeSelect(type.id)}
                onMouseEnter={() => setHoveredType(type.id)}
                onMouseLeave={() => setHoveredType(null)}
                style={{ '--animation-delay': `${index * 100}ms` }}
              >
                <div className="card-background">
                  <div className={`gradient-bg bg-gradient-to-br ${type.gradient}`}></div>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <div className="event-icon">
                      <div className="icon-bg">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="emoji-icon">{type.emoji}</div>
                    </div>
                    
                    <div className={`popularity-badge ${type.textColor} ${type.bgColor}`}>
                      {type.popularity}
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="event-title">{type.name}</h3>
                    <p className="event-description">{type.description}</p>
                  </div>

                  <div className="card-footer">
                    <div className="event-stats">
                      <div className="stat-item">
                        <span className="stat-label">Budget</span>
                        <span className="stat-value">{type.avgBudget}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Available</span>
                        <span className="stat-value">{type.vendors}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="selected-indicator">
                      <div className="check-icon">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className={`card-overlay ${isHovered ? 'visible' : ''}`}>
                    <div className="overlay-content">
                      <ArrowRight className="w-6 h-6" />
                      <span>Select & Continue</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="step-footer">
          <div className="custom-event-option">
            <p className="custom-text">Don't see your event type?</p>
            <button className="custom-button">
              Contact us for custom events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTypeStep;