// src/components/home-page/FeaturesSection/FeaturesSection.jsx
import React from 'react';
import { Shield, Zap, Users, Heart, Star, Clock } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Verified Vendors',
      description: 'All vendors go through our rigorous verification process to ensure quality and reliability.',
      color: 'blue'
    },
    {
      icon: <Zap size={32} />,
      title: 'Instant Booking',
      description: 'Book services instantly with real-time availability and immediate confirmations.',
      color: 'yellow'
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Support',
      description: '24/7 customer support from our team of event planning experts.',
      color: 'green'
    },
    {
      icon: <Heart size={32} />,
      title: 'Personalized Experience',
      description: 'Tailored recommendations based on your preferences and event requirements.',
      color: 'pink'
    },
    {
      icon: <Star size={32} />,
      title: 'Quality Guaranteed',
      description: 'Money-back guarantee if you\'re not completely satisfied with our services.',
      color: 'purple'
    },
    {
      icon: <Clock size={32} />,
      title: 'Time Saving',
      description: 'Plan your entire event in minutes instead of weeks with our streamlined process.',
      color: 'orange'
    }
  ];

  return (
    <section className="features-section section">
      <div className="container">
        <div className="features-header" data-aos="fade-up">
          <h2 className="section-title">Why Choose Evea?</h2>
          <p className="section-subtitle">
            Experience the future of event planning with our innovative platform designed 
            to make your special moments truly unforgettable.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card feature-${feature.color}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-icon-bg"></div>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>

              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>

        <div className="features-stats" data-aos="fade-up" data-aos-delay="600">
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5 Min</div>
            <div className="stat-label">Average Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure Payments</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;